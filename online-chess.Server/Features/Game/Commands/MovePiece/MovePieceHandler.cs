using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Play;
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


        public MovePieceHandler(
            GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , ILogger<MovePieceHandler> logger
            , TimerService timerService
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _logger = logger;
            _timerService = timerService;
        }

        public async Task<Unit> Handle(MovePieceRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                //await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("onNotFound", true);
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
                },
                New = new BaseMoveInfo(){
                    X = 7 - request.NewMove.X,
                    Y = 7 - request.NewMove.Y,
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

            // add to move history
            var moveHistory = room.MoveHistory;
            if (pieceMoveIsWhite){
                moveHistory?.White.Add(whitesOrientationMoveInfo);
            } else {
                moveHistory?.Black.Add(whitesOrientationMoveInfo);
            }

            var hasCapture = room.UpdatePieceCoords(whitesOrientationMoveInfo, request.HasCapture, pieceMoveIsWhite);

            UpdateTimer(room, isRoomCreator);

            var retVal = new{
                moveInfo = invertedMoveInfo
                , moveIsWhite = pieceMoveIsWhite
                , creatorColorIsWhite = room.CreatedByUserColor == Enums.Color.White
                , capturedPiece = hasCapture == null ? null : hasCapture
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onUpdateBoard, retVal);

            return Unit.Value;
         }

        
        private async void UpdateTimer(GameRoom room, bool creatorsTurn)
        {
            double creatorSecondsLeft = room.CreatedByUserInfo.TimeLeft;
            double joinerSecondsLeft = room.JoinByUserInfo.TimeLeft;

            // cancel previous timer and start a new timer
            room.TimerDetector.Cancel();
            room.TimerDetector = new CancellationTokenSource();

            var roomStatus = room.GamePlayStatus;

            while (creatorSecondsLeft > 0 && joinerSecondsLeft > 0 && roomStatus != GamePlayStatus.Finished)
            {
                /*
                TODO 2/5/2025 - may need to use a separate singleton to properly
                reflect time
                - use TimerService here
                */
                if (room.TimerDetector.Token.IsCancellationRequested){
                    _logger.LogInformation("TOKEN CANCELLED");

                    //if (creatorsTurn){
                        room.CreatedByUserInfo.LastMoveDate = DateTime.Now;
                        room.CreatedByUserInfo.TimeLeft = creatorSecondsLeft;

                    //} else {
                        room.JoinByUserInfo.LastMoveDate = DateTime.Now;
                        room.JoinByUserInfo.TimeLeft = joinerSecondsLeft;
                    //}

                    _logger.LogInformation(
                        "Token cancelled - Creator: {1}, Joiner: {2}", 
                        room.CreatedByUserInfo.TimeLeft, room.JoinByUserInfo.TimeLeft);

                    break;
                }

                _logger.LogInformation(
                    "Running - Creator: {0}, Joiner: {1}", 
                    creatorSecondsLeft, joinerSecondsLeft);

                var retVal = new {
                    white = (room.CreatedByUserInfo.IsColorWhite ? creatorSecondsLeft : joinerSecondsLeft),
                    black = (!room.CreatedByUserInfo.IsColorWhite ? creatorSecondsLeft : joinerSecondsLeft),
                    whitesTurn = (room.CreatedByUserInfo.IsColorWhite && creatorsTurn)
                };
                await _hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onUpdateTimer, retVal);

                await Task.Delay(1000);

                if (creatorsTurn){
                    creatorSecondsLeft--;
                } else {
                    joinerSecondsLeft--;
                }

                // for every 30 seconds check if the game is finished
                if (creatorSecondsLeft % 30 == 0 || joinerSecondsLeft % 30 == 0){
                    var gameRoom = _gameRoomService.GetOne(room.GameKey);

                    if (gameRoom == null){
                        _logger.LogInformation("1. Game done: {0}, Date ended: {1}", room.GameKey, DateTime.Now);
                        break;
                    }

                    if (gameRoom != null && gameRoom.GamePlayStatus == GamePlayStatus.Finished){
                        _logger.LogInformation("2. Game done: {0}, Date ended: {1}", room.GameKey, DateTime.Now);
                        break;
                    }

                    if (gameRoom != null)
                    {
                        roomStatus = gameRoom.GamePlayStatus;
                    }
                }

                if (roomStatus == GamePlayStatus.Finished){
                    _logger.LogInformation("3. Game done: {0}, Date ended: {1}", room.GameKey, DateTime.Now);
                    break;
                }

            }
        } 
        
    }
}
