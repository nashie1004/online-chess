using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly GameRoomService _gameRoomService; 
        private readonly AuthenticatedUserService _authenticatedUserService;

        public JoinRoomHandler(IHubContext<GameHub> hubContext, GameQueueService gameQueueService, AuthenticatedUserService authenticatedUserService, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            var queue = _gameQueueService.GetOne(request.GameRoomKeyString);

            if (queue == null || string.IsNullOrEmpty(request.IdentityUserName))
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            queue.JoinedByUserId = request.IdentityUserName;

            // add joiner user to the group
            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, request.GameRoomKeyString);
            
            var val = new Random().Next(0, 2);  // Generates either 0 or 1
            var randomColor = val == 0 ? Color.White : Color.Black;
            var newColor = queue.CreatedByUserColor == Color.Random ? randomColor : queue.CreatedByUserColor;

            // remove from game queue and add to game room
            var room = new GameRoom(){
                GameKey = queue.GameKey,
                CreatedByUserId = queue.CreatedByUserId,
                CreateDate = queue.CreateDate,
                GameType = queue.GameType,
                CreatedByUserColor = newColor, 
                JoinedByUserId = queue.JoinedByUserId
            };

            _gameRoomService.Add(room.GameKey, room);

            // remove both player queuing rooms
            _gameQueueService.RemoveByCreator(room.CreatedByUserId);
            _gameQueueService.RemoveByCreator(room.JoinedByUserId);

            await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
            );

            // redirect both users to play page
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onMatchFound, room.GameKey.ToString());

            return Unit.Value;
        }
    }
}
