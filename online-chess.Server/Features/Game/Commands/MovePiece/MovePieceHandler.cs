﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Play;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.MovePiece
{
    public class MovePieceHandler : IRequestHandler<MovePieceRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly ILogger<MovePieceHandler> _logger;
        private readonly TimerService _timerService;
        private readonly IServiceProvider _serviceProvider;

        public MovePieceHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , ILogger<MovePieceHandler> logger
            , TimerService timerService
            , IServiceProvider serviceProvider
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _logger = logger;
            _timerService = timerService;
            _serviceProvider = serviceProvider;
        }

        public async Task<Unit> Handle(MovePieceRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);
            if (room == null) return Unit.Value;

            bool isRoomCreator = room.CreatedByUserInfo.UserName == request.IdentityUserName;
            bool pieceMoveIsWhite = isRoomCreator ? room.CreatedByUserInfo.Color == Color.White 
                : room.CreatedByUserInfo.Color == Color.Black;

            var (invertedMoveInfo, whitesOrientationMoveInfo) = GenerateMoveInfo(request, pieceMoveIsWhite);

            var capturedPiece = room.MovePiece(whitesOrientationMoveInfo, request, pieceMoveIsWhite, isRoomCreator);

            if (room.TimerId != null)
            {
                room.TimerId.Dispose();
                room.TimerId = null;
            }

            room.TimerId = new Timer(StartNewTimer, new TimerState(){
                GameRoom = room,
                CreatorsTurn = !isRoomCreator,
                ServiceScope = _serviceProvider.CreateScope()
            }, 0, 1000);
            
            var retVal = new UpdateBoardInfo(){
                MoveInfo = invertedMoveInfo
                , MoveIsWhite = pieceMoveIsWhite
                , CreatorColorIsWhite = room.CreatedByUserInfo.Color == Enums.Color.White
                , CapturedPiece = capturedPiece
                , MoveHistoryLatestMove = whitesOrientationMoveInfo
                , BothKingsState = room.BothKingsState
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onUpdateBoard, retVal);
            
            if (room.BothKingsState.White.IsCheckmate || room.BothKingsState.Black.IsCheckmate)
            {
                await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room
                    , room.BothKingsState.White.IsCheckmate && room.CreatedByUserInfo.IsColorWhite ? EndGameStatus.CreatorIsCheckmated : EndGameStatus.JoinerIsCheckmated
                );
            }

            if (room.BothKingsState.White.IsInStalemate || room.BothKingsState.Black.IsInStalemate)
            {
                await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room, EndGameStatus.DrawByStalemate);
            }

            if (room.MoveCountSinceLastCapture > 50 && room.MoveCountSinceLastPawnMove != 0)
            {
                await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room, EndGameStatus.DrawBy50MoveRule);
            }

            if (room.LastFewMovesAreTheSame > 3)
            {
                await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room, EndGameStatus.DrawByThreeFoldRepetition);
            }

            return Unit.Value;
        }

        private (Move, Move) GenerateMoveInfo(MovePieceRequest request, bool pieceMoveIsWhite)
        {
            // invert orientation (for phaser)
            Move invertedMoveInfo = new Move()
            {
                Old = new BaseMoveInfo()
                {
                    X = 7 - request.OldMove.X,
                    Y = 7 - request.OldMove.Y,
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                },
                New = new BaseMoveInfo()
                {
                    X = 7 - request.NewMove.X,
                    Y = 7 - request.NewMove.Y,
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                }
            };

            // move info on whites orientation (saved here in the server)
            Move whitesOrientationMoveInfo = new Move()
            {
                Old = new BaseMoveInfo()
                {
                    X = (pieceMoveIsWhite ? request.OldMove.X : 7 - request.OldMove.X),
                    Y = (pieceMoveIsWhite ? request.OldMove.Y : 7 - request.OldMove.Y),
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                },
                New = new BaseMoveInfo()
                {
                    X = (pieceMoveIsWhite ? request.NewMove.X : 7 - request.NewMove.X),
                    Y = (pieceMoveIsWhite ? request.NewMove.Y : 7 - request.NewMove.Y),
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                }
            };

            return (invertedMoveInfo, whitesOrientationMoveInfo);
        }

        public async void StartNewTimer(object? state)
        {
            if (state == null) return;
            var timerState = (TimerState)state;
            if (timerState == null) return;

            var room = timerState.GameRoom;
            var creatorsTurn = timerState.CreatorsTurn;
            var (creatorSecondsLeft, joinerSecondsLeft) = _timerService.GetTimer(room.GameKey); 
            var scope = timerState.ServiceScope;

            var playerSecondsLeft = creatorsTurn ? creatorSecondsLeft : joinerSecondsLeft;

            var retVal = new
            {
                white = (room.CreatedByUserInfo.IsColorWhite ? creatorSecondsLeft : joinerSecondsLeft),
                black = (!room.CreatedByUserInfo.IsColorWhite ? creatorSecondsLeft : joinerSecondsLeft),
                whitesTurn = (room.CreatedByUserInfo.IsColorWhite ? creatorsTurn : !creatorsTurn)
            };
            await _hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onUpdateTimer, retVal);

            if (creatorsTurn)
            {
                creatorSecondsLeft--;
            }
            else
            {
                joinerSecondsLeft--;
            }

            playerSecondsLeft--;

            _timerService.UpdateTimer(room.GameKey, (creatorSecondsLeft, joinerSecondsLeft));

            // _logger.LogInformation(
            // "Running - Creator: {0}, Joiner: {1}, Current Player: {0}"
            // , creatorSecondsLeft, joinerSecondsLeft, playerSecondsLeft);

            // for every 30 seconds check if the game is finished
            if (playerSecondsLeft % 30 == 0)
            {
                var gameRoom = _gameRoomService.GetOne(room.GameKey);

                //_logger.LogInformation("Check room status: {0}, {1}", gameRoom?.GameKey, gameRoom?.GamePlayStatus);

                if (gameRoom == null)
                {
                    room.TimerId?.Dispose();
                }

            }

            if (playerSecondsLeft < 0)
            {
                //_logger.LogInformation("0 seconds left Game Ended: {0}", playerSecondsLeft);

                await _gameRoomService.EndGame(scope, room
                    , creatorsTurn ? EndGameStatus.CreatorTimeIsUp : EndGameStatus.JoinerTimeIsUp
                ); 
            }
            
        }

    }
}
