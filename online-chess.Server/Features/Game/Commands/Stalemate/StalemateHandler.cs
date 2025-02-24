using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.Stalemate
{
    public class StalemateHandler : IRequestHandler<StalemateRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly GameRoomService _gameRoomService;

        public StalemateHandler(
            IHubContext<GameHub> hubContext            
            ,AuthenticatedUserService authenticatedUserService
            ,GameRoomService gameRoomService
        )
        {
            _hubContext = hubContext;
            _authenticatedUserService = authenticatedUserService;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(StalemateRequest req, CancellationToken ct)
        {

            return Unit.Value;
        }

    }
}
