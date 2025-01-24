using MediatR;
using Microsoft.AspNetCore.SignalR;
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

        public MovePieceHandler(GameRoomService gameRoomService, AuthenticatedUserService authenticatedUserService, IHubContext<GameHub> hubContext)
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
                //await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
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

            // 1. set color
            bool isRoomCreator = room.CreatedByUserId == request.IdentityUserName;

            // Assign pieceMoveIsWhite based on the room creator's color
            bool pieceMoveIsWhite = isRoomCreator 
                ? room.CreatedByUserColor == Enums.Color.White 
                : room.CreatedByUserColor == Enums.Color.Black;

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

            var retVal = new{
                moveInfo
                , moveIsWhite = pieceMoveIsWhite
            };


            // send move to opponent player
            string opponentConnectionId = _authenticatedUserService.GetConnectionId(
                request.IdentityUserName == room.CreatedByUserId ? room.JoinedByUserId : room.CreatedByUserId
            );
            await _hubContext.Clients.Client(opponentConnectionId).SendAsync("OpponentPieceMoved", retVal);

            // send updated move history to both players
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync("UpdateMoveHistory", retVal);

            return Unit.Value;
         }
    }
}
