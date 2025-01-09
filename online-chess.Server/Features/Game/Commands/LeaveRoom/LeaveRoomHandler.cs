using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.LeaveRoom
{
    public class LeaveRoomHandler : IRequestHandler<LeaveRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;

        public LeaveRoomHandler(IHubContext<GameHub> hubContext, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(LeaveRoomRequest request, CancellationToken cancellationToken)
        {
            var gameRooms = _gameRoomService.GetAll();
            foreach (var item in gameRooms)
            {
                // if either the user who created the room or a user who joined the room leaves
                // remove from group and broadcast to group
                if (
                    item.Value.CreatedByUserId == request.UserConnectionId ||
                    item.Value.JoinedByUserId == request.UserConnectionId
                    )
                {
                    // remove user from group
                    await _hubContext.Groups.RemoveFromGroupAsync(request.UserConnectionId, item.Key.ToString());
                    // broadcast user has left the group
                    await _hubContext.Clients.Group(item.Key.ToString()).SendAsync("LeaveRoom", $"{request.UserConnectionId} has left the room");
                }
            }

            return Unit.Value;
        }
    }
}
