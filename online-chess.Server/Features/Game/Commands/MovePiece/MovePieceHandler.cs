using MediatR;
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
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly ILogger<MovePieceHandler> _logger;

        public MovePieceHandler(
            GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , ILogger<MovePieceHandler> logger
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _logger = logger;
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
            //_logger.LogInformation("hi test only");

            // update timer
            var timeNow = (DateTime.Now).TimeOfDay;

            if (isRoomCreator){
                var elapsedTime = timeNow - (room.CreatedByUserInfo.LastMoveDate).TimeOfDay;

                room.CreatedByUserInfo.TimeLeft -= elapsedTime;
                room.CreatedByUserInfo.LastMoveDate = DateTime.Now;
            } 
            else {
                var elapsedTime = timeNow - (room.JoinByUserInfo.LastMoveDate).TimeOfDay;

                room.JoinByUserInfo.TimeLeft -= elapsedTime;
                room.JoinByUserInfo.LastMoveDate = DateTime.Now;
            }

            var retVal = new{
                moveInfo = invertedMoveInfo
                , moveIsWhite = pieceMoveIsWhite
                , creatorTimeLeft = room.CreatedByUserInfo.TimeLeft.TotalMilliseconds
                , joinerTimeLeft = room.JoinByUserInfo.TimeLeft.TotalMilliseconds
                , creatorColorIsWhite = room.CreatedByUserColor == Enums.Color.White
                , capturedPiece = hasCapture == null ? null : hasCapture
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onUpdateBoard, retVal);

            return Unit.Value;
         }
    }
}
