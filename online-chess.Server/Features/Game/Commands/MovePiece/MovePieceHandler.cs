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
        private readonly GameLogicService _gameLogicService;

        public MovePieceHandler(
            GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , GameLogicService gameLogicService
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _gameLogicService = gameLogicService;
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
             * - send to both players
             */

            // TODO - when a piece moves, update gamelogic service piece coords

            // 1. set color
            bool isRoomCreator = room.CreatedByUserId == request.IdentityUserName;

            // Assign pieceMoveIsWhite based on the room creator's color
            bool pieceMoveIsWhite = isRoomCreator 
                ? room.CreatedByUserColor == Enums.Color.White 
                : room.CreatedByUserColor == Enums.Color.Black;

            // 1.1 invert orientation
            request.OldMove.Y = 7 - request.OldMove.Y;
            request.NewMove.Y = 7 - request.NewMove.Y;
            request.OldMove.X = 7 - request.OldMove.X;
            request.NewMove.X = 7 - request.NewMove.X;

            // 2. add to move history
            Move moveInfo = new Move(){
                Old = request.OldMove,
                New = request.NewMove
            };

            if (pieceMoveIsWhite){
                room.MoveHistory.White.Add(moveInfo);
            } else {
                room.MoveHistory.Black.Add(moveInfo);
            }

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
            };

            // send move to opponent player
            string opponentConnectionId = _authenticatedUserService.GetConnectionId(
                request.IdentityUserName == room.CreatedByUserId ? room.JoinedByUserId : room.CreatedByUserId
            );
            await _hubContext.Clients.Client(opponentConnectionId).SendAsync(RoomMethods.onOpponentPieceMoved, retVal);

            // send updated move history to both players
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onUpdateBoard, retVal);

            return Unit.Value;
         }
    }
}
