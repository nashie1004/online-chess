using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Lobby;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.AddToQueue
{
    public class AddToQueueHandler : IRequestHandler<AddToQueueRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GameQueueService _gameRoomService;
        private readonly UserManager<User> _userManager;

        public AddToQueueHandler(
            IHubContext<GameHub> hubContext
            , IHttpContextAccessor httpContextAccessor
            , GameQueueService gameRoomService
            , UserManager<User> userManager
        )
        {
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _gameRoomService = gameRoomService;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(AddToQueueRequest request, CancellationToken cancellationToken)
        {
            var roomKey = Guid.NewGuid();
            var user = (await _userManager.FindByNameAsync(request.IdentityUserName ?? ""));
            if (user == null) return Unit.Value;

            _gameRoomService.Add(roomKey, new GameQueue()
            {
                GameKey = roomKey,
                CreateDate = DateTime.Now,
                GameType = request.GameType,
                GamePlayStatus = GamePlayStatus.WaitingForPlayers,
                CreatedByUserInfo = new Models.Play.PlayerInfo()
                {
                    UserName = user.UserName
                    ,IsPlayersTurnToMove = request.ColorOption == Color.White
                    ,IsColorWhite = request.ColorOption == Color.White
                    ,Color = request.ColorOption
                    ,ProfileImageUrl = user.ProfileImageUrl
                }
            });

            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, roomKey.ToString());
            
            await _hubContext.Clients.Group(roomKey.ToString()).SendAsync(RoomMethods.onGetRoomKey, roomKey);

            await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                _gameRoomService.GetPaginatedDictionary().ToArray()
            );

            return Unit.Value;
        }
    }
}
