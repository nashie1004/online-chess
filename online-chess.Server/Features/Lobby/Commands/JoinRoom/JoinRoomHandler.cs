using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;

        public JoinRoomHandler(IHubContext<GameHub> hubContext, GameQueueService gameRoomService, AuthenticatedUserService authenticatedUserService)
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            // 1. if not a valid guid, redirect to 404 not found
            if (!Guid.TryParse(request.GameRoomKeyString, out Guid gameRoomKey))
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            var room = _gameRoomService.GetOne(gameRoomKey);

            // 2. if room is not found, redirect to 404 not found
            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            room.JoinedByUserId = request.IdentityUserName;

            // Add both user to group
            await _hubContext.Groups.AddToGroupAsync(
                _authenticatedUserService.GetConnectionId(room.CreatedByUserId)
                , gameRoomKey.ToString());

            await _hubContext.Groups.AddToGroupAsync(
                _authenticatedUserService.GetConnectionId(room.JoinedByUserId)
                , gameRoomKey.ToString());

            // redirect both users
            await _hubContext.Clients.Group(gameRoomKey.ToString()).SendAsync("MatchFound", gameRoomKey.ToString());

            // Send message to all participants in the group
            //await _hubContext
            //    .Clients
            //    .Group(gameRoomKey.ToString())
            //    .SendAsync("GetRoomData", $"{request.IdentityUserName} has joined");

            return Unit.Value;
        }
    }
}
