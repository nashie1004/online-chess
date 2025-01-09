using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;

namespace online_chess.Server.Features.Game.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>   
    {
        private readonly IHubContext<GameHub> _hubContext;

        public JoinRoomHandler(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            // Add user to group
            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, request.GameRoomKey.ToString());
            // Send message to all participants in the group
            await _hubContext
                .Clients
                .Group(request.GameRoomKey.ToString())
                .SendAsync("GetRoomData", $"{request.UserConnectionId} has joined");
            
            return Unit.Value;
        }
    }
}
