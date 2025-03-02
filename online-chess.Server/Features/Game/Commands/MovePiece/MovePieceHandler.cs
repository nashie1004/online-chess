using System;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Play;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.MovePiece
{
    public class MovePieceHandler : IRequestHandler<MovePieceRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly ILogger<MovePieceHandler> _logger;
        private readonly TimerService _timerService;
        private readonly IServiceProvider _serviceProvider;

        public MovePieceHandler(
            GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , ILogger<MovePieceHandler> logger
            , TimerService timerService
            , IServiceProvider serviceProvider
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _logger = logger;
            _timerService = timerService;
            _serviceProvider = serviceProvider;
        }

        public async Task<Unit> Handle(MovePieceRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                return Unit.Value;
            }

            /*
             * TODO
             * - save to move history
             * - save to capture history (if any)
             * - update king state (check, checkmate, stalemate)
             * - update timer
             */

            // set the color of the piece moved
            bool isRoomCreator = room.CreatedByUserId == request.IdentityUserName;

            bool pieceMoveIsWhite = isRoomCreator 
                ? room.CreatedByUserColor == Enums.Color.White 
                : room.CreatedByUserColor == Enums.Color.Black;

            // invert orientation (for phaser)
            Move invertedMoveInfo = new Move(){
                Old = new BaseMoveInfo(){
                    X = 7 - request.OldMove.X,
                    Y = 7 - request.OldMove.Y,
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                },
                New = new BaseMoveInfo(){
                    X = 7 - request.NewMove.X,
                    Y = 7 - request.NewMove.Y,
                    Name = request.OldMove.Name,
                    UniqueName = request.OldMove.UniqueName
                }
            };

            // move info on whites orientation
            Move whitesOrientationMoveInfo = new Move(){
                Old = new BaseMoveInfo(){
                    X = (pieceMoveIsWhite ? request.OldMove.X : 7 - request.OldMove.X),
                    Y = (pieceMoveIsWhite ? request.OldMove.Y : 7 - request.OldMove.Y),
                },
                New = new BaseMoveInfo(){
                    X = (pieceMoveIsWhite ? request.NewMove.X : 7 - request.NewMove.X),
                    Y = (pieceMoveIsWhite ? request.NewMove.Y : 7 - request.NewMove.Y),
                }
            };

            room.CreatedByUserInfo.IsPlayersTurnToMove = !isRoomCreator;
            room.JoinByUserInfo.IsPlayersTurnToMove = isRoomCreator;

            // add to move history
            var moveHistory = room.MoveHistory;
            if (pieceMoveIsWhite){
                moveHistory?.White.Add(whitesOrientationMoveInfo);
            } else {
                moveHistory?.Black.Add(whitesOrientationMoveInfo);
            }

            var hasCapture = room.UpdatePieceCoords(whitesOrientationMoveInfo, request.Capture, request.Castle, pieceMoveIsWhite);

            if (room.TimerId != null)
            {
                room.TimerId.Dispose();
                room.TimerId = null;
            }

            room.TimerId = new Timer(UpdateTimer, new TimerState(){
                GameRoom = room,
                CreatorsTurn = !isRoomCreator,
                ServiceScope = _serviceProvider.CreateScope()
            }, 0, 1000);
            
            var retVal = new{
                moveInfo = invertedMoveInfo
                , moveIsWhite = pieceMoveIsWhite
                , creatorColorIsWhite = room.CreatedByUserColor == Enums.Color.White
                , capturedPiece = hasCapture == null ? null : hasCapture
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onUpdateBoard, retVal);
            
            return Unit.Value;
         }

        
        public async void UpdateTimer(object? state)
        {
            var timerState = (TimerState)state;
            if (timerState == null) return;

            var room = timerState.GameRoom;
            var creatorsTurn = timerState.CreatorsTurn;
            var timer = _timerService.GetTimer(room.GameKey); 
            var scope = timerState.ServiceScope;

            // cancel previous timer and start a new timer
            double creatorSecondsLeft = timer.Item1;
            double joinerSecondsLeft = timer.Item2;

            var roomStatus = room.GamePlayStatus;
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

            _logger.LogInformation(
            "Running - Creator: {0}, Joiner: {1}, Current Player: {0}"
            , creatorSecondsLeft, joinerSecondsLeft, playerSecondsLeft);

            // for every 30 seconds check if the game is finished
            bool gameFinished = false;
            if (playerSecondsLeft % 30 == 0)
            {
                var gameRoom = _gameRoomService.GetOne(room.GameKey);

                _logger.LogInformation("Check room status: {0}, {1}", gameRoom?.GameKey, gameRoom?.GamePlayStatus);

                if (gameRoom == null)
                {
                    gameFinished = true;
                }

                if (gameRoom != null && gameRoom.GamePlayStatus == GamePlayStatus.Finished)
                {
                    gameFinished = true;
                }

                if (gameRoom != null)
                {
                    roomStatus = gameRoom.GamePlayStatus;
                }
            }

            if (roomStatus == GamePlayStatus.Finished)
            {
                gameFinished = true;
            }

            if (gameFinished)
            {
                _logger.LogInformation("Game done: {0}, Date ended: {1}", room.GameKey, DateTime.Now);
                room.TimerId.Dispose();
                // await _hubContext.Clients.Group(room.GameKey.ToString()).SendAsync("", "");
            }

            // TODO
            /*
            if (playerSecondsLeft == -1)
            {
                _logger.LogInformation("0 seconds left Game Ended: {0}", playerSecondsLeft);
                await TimeIsUp(room, creatorsTurn, scope);
                room.TimerId.Dispose();
            }
            */
        }


        // gets called when a player timer hits 0
        public async Task TimeIsUp(GameRoom room, bool creatorWon, IServiceScope? scope)
        {
            var identityDbContext = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var mainDbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<GameHub>>();

            var creator = await identityDbContext.FindByNameAsync(room.CreatedByUserId);
            var joiner = await identityDbContext.FindByNameAsync(room.JoinedByUserId);

            await mainDbContext.GameHistories.AddAsync(new GameHistory(){
                GameStartDate = room.GameStartedAt
                , GameEndDate = DateTime.Now

                , PlayerOneId = creator?.Id ?? 0
                , PlayerOneColor = room.CreatedByUserColor
                , PlayerTwoId = joiner?.Id ?? 0
                , PlayerTwoColor = room.CreatedByUserColor == Color.White ? Color.Black : Color.White
                    
                , WinnerPlayerId = creatorWon ? (creator?.Id ?? 0) : (joiner?.Id ?? 0) 
                , IsDraw = false
                , GameType = room.GameType
            });

            await mainDbContext.SaveChangesAsync();

            string creatorConnectionId = _authenticatedUserService.GetConnectionId(room.CreatedByUserId);
            string joinerConnectionId = _authenticatedUserService.GetConnectionId(room.JoinedByUserId);

            await hubContext.Clients.Client(creatorConnectionId).SendAsync(RoomMethods.onGameOver, creatorWon ? 1 : 0);
            await hubContext.Clients.Client(joinerConnectionId).SendAsync(RoomMethods.onGameOver, !creatorWon ? 1 : 0);

            _timerService.RemoveTimer(room.GameKey);
        }

    }
}
