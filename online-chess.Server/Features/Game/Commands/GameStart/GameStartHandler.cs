using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;

        public GameStartHandler(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task<Unit> Handle(GameStartRequest request, CancellationToken cancellationToken)
        {
            // not a valid guid
            if (!Guid.TryParse(request.GameRoomKeyString, out Guid gameRoomKey))
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            return Unit.Value;
        }
    }
}
