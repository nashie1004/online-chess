using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
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
            // TODO
            // - save to move history
            // - save to capture history
            // - update timer
            // - send new states to both players
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            // DOING 1/19/2025 11:20AM

            return Unit.Value;
        }
    }
}
