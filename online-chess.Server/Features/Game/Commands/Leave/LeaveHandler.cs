using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.LeaveRoom
{
    public class LeaveHandler : IRequestHandler<LeaveRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly GameRoomService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;

        public LeaveHandler(
            IHubContext<GameHub> hubContext
            , GameQueueService gameQueueService
            , AuthenticatedUserService authenticatedUserService
            , GameRoomService gameRoomService
            )
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
        }

        public async Task<Unit> Handle(LeaveRequest request, CancellationToken cancellationToken)
        {
            _authenticatedUserService.RemoveWithConnectionId(request.UserConnectionId);
            _authenticatedUserService.RemoveWithIdentityUsername(request.IdentityUserName ?? "");
            var aQueuedRoomIsRemoved = _gameQueueService.RemoveByCreator(request.IdentityUserName ?? "");
            
            if (aQueuedRoomIsRemoved){
                await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                    _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
                );
            }

            /*
            foreach (var item in gameRooms)
            {
                // if either the user who created the room or a user who joined the room leaves
                // remove from group and broadcast to group
                if (
                    item.Value.CreatedByUserId == request.IdentityUserName ||
                    item.Value.JoinedByUserId == request.IdentityUserName
                    )
                {

                    // if (item.Value.CreatedByUserId == request.IdentityUserName){
                    //     item.Value.CreatedByUserId = string.Empty;
                    // } else {
                    //     item.Value.JoinedByUserId = string.Empty;
                    // }

                    // remove user from group
                    await _hubContext.Groups.RemoveFromGroupAsync(request.UserConnectionId, item.Key.ToString());
                    // broadcast user has left the group
                    await _hubContext.Clients.Group(item.Key.ToString()).SendAsync(RoomMethods.onLeaveRoom, $"{request.IdentityUserName} has left the room");
                }
            }
            */

            return Unit.Value;
        }
    }
}
