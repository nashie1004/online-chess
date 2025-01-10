using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>   
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;

        public JoinRoomHandler(IHubContext<GameHub> hubContext, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            // if not a valid guid, redirect to 404 notfound
            if (!Guid.TryParse(request.GameRoomKeyString, out Guid gameRoomKey))
            {
                await _hubContext
                    .Clients
                    .Client(request.UserConnectionId)
                    .SendAsync("NotFound", true);

                return Unit.Value;
            }

            // Add user to group
            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, gameRoomKey.ToString());

            // add joiner to the room
            var room = _gameRoomService.GetOne(gameRoomKey);
            if (
                room != null &&
                room.CreatedByUserId != request.UserConnectionId
                )
            {
                room.JoinedByUserId = request.UserConnectionId;
            }

            // Send message to all participants in the group
            await _hubContext
                .Clients
                .Group(gameRoomKey.ToString())
                .SendAsync("GetRoomData", $"{request.UserConnectionId} has joined");
            
            return Unit.Value;
        }
    }
}
