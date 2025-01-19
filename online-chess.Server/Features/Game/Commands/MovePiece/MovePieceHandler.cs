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
            bool pieceMoveIsWhite = true;

            if (room.CreatedByUserId == request.IdentityUserName){
                if (room.CreatedByUserColor == Enums.Color.Black){
                    pieceMoveIsWhite = false;
                }
            } else {
                if (room.CreatedByUserColor == Enums.Color.Black){
                    pieceMoveIsWhite = true;
                }
            }

            // 2. add to move history
            if (pieceMoveIsWhite){
                room.MoveHistory.White.Add(new Move(){
                    Old = request.OldMove,
                    New = request.NewMove
                });
            } else {
                room.MoveHistory.Black.Add(new Move(){
                    Old = request.OldMove,
                    New = request.NewMove
                });
            }

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync("APieceHasMoved", "TODO piece has moved broadcast");

            return Unit.Value;
         }
    }
}
