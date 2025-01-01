using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;

namespace online_chess.Server.Features.Game.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, JoinRoomResponse>   
    {
        private readonly IHubContext<GameHub> _hubContext;

        public JoinRoomHandler(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task<JoinRoomResponse> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            await _hubContext.Clients.All.SendAsync("TestClientResponse", $"New connect: ${DateTime.Now}");
            return new JoinRoomResponse();
        }
    }
}
