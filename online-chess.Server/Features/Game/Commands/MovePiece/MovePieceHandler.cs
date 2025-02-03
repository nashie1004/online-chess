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

        public MovePieceHandler(
            GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
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

            // set color
            bool isRoomCreator = room.CreatedByUserId == request.IdentityUserName;

            // Assign pieceMoveIsWhite based on the room creator's color
            bool pieceMoveIsWhite = isRoomCreator 
                ? room.CreatedByUserColor == Enums.Color.White 
                : room.CreatedByUserColor == Enums.Color.Black;

            // invert orientation
            request.OldMove.Y = 7 - request.OldMove.Y;
            request.OldMove.X = 7 - request.OldMove.X;

            request.NewMove.Y = 7 - request.NewMove.Y;
            request.NewMove.X = 7 - request.NewMove.X;

            // add to move history
            Move moveInfo = new Move(){
                Old = request.OldMove,
                New = request.NewMove
            };

            var moveHistory = room.MoveHistory;
            if (pieceMoveIsWhite){
                moveHistory?.White.Add(moveInfo);
            } else {
                moveHistory?.Black.Add(moveInfo);
            }

            // TODO: the coords saved on PiecesCoords is on white's orientation
            // update piece coordinates and capture history
            var hasCapture = room.UpdatePieceCoords(moveInfo, request.HasCapture);

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
                moveInfo
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
