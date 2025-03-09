using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly GameRoomService _gameRoomService; 
        private readonly UserConnectionService _authenticatedUserService;
        private readonly UserManager<User> _userManager;

        public JoinRoomHandler(
            IHubContext<GameHub> hubContext
            , GameQueueService gameQueueService
            , UserConnectionService authenticatedUserService
            , GameRoomService gameRoomService
            , UserManager<User> userManager
        )
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            var queue = _gameQueueService.GetOne(request.GameRoomKeyString);

            if (queue == null || string.IsNullOrEmpty(request.IdentityUserName))
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            var user = (await _userManager.FindByNameAsync(request.IdentityUserName ?? ""));
            if (user == null) return Unit.Value;

            // add joiner user to the group
            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, request.GameRoomKeyString);
            
            var val = new Random().Next(0, 2);  // Generates either 0 or 1
            var randomColor = val == 0 ? Color.White : Color.Black;
            var newColor = queue.CreatedByUserInfo.Color == Color.Random ? randomColor : queue.CreatedByUserInfo.Color;

            queue.CreatedByUserInfo.Color = newColor;

            // remove from game queue and add to game room
            var room = new GameRoom(){
                GameKey = queue.GameKey,
                CreateDate = queue.CreateDate,
                GameType = queue.GameType,
                GamePlayStatus = GamePlayStatus.Ongoing,
                GameStartedAt = DateTime.Now,
                CreatedByUserInfo = queue.CreatedByUserInfo,
                JoinByUserInfo = new Models.Play.PlayerInfo()
                {
                    UserName = user.UserName
                    ,IsPlayersTurnToMove = !queue.CreatedByUserInfo.IsColorWhite
                    ,IsColorWhite = !queue.CreatedByUserInfo.IsColorWhite
                    ,Color = queue.CreatedByUserInfo.Color == Color.White ? Color.Black : Color.White
                    ,ProfileImageUrl = user.ProfileImageUrl
                }
            };

            _gameRoomService.Add(room.GameKey, room);

            // remove both player queuing rooms
            _gameQueueService.RemoveByCreator(room.CreatedByUserInfo.UserName);
            _gameQueueService.RemoveByCreator(room.JoinByUserInfo.UserName);

            await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
            );

            // redirect both users to play page
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onMatchFound, room.GameKey.ToString());

            return Unit.Value;
        }
    }
}
