using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Others.Commands.Disconnect
{
    public class DisconnectHandler : IRequestHandler<DisconnectRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly GameRoomService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly LogInTrackerService _logInTrackerService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DisconnectHandler(
            IHubContext<GameHub> hubContext
            , GameQueueService gameQueueService
            , AuthenticatedUserService authenticatedUserService
            , GameRoomService gameRoomService
            , LogInTrackerService logInTrackerService
            , IHttpContextAccessor httpContextAccessor
            )
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _logInTrackerService = logInTrackerService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Unit> Handle(DisconnectRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.IdentityUserName)) return Unit.Value;

            _authenticatedUserService.RemoveWithIdentityUsername(request.IdentityUserName);

            // 1. has a queuing room
            var aQueuedRoomIsRemoved = _gameQueueService.RemoveByCreator(request.IdentityUserName);

            if (aQueuedRoomIsRemoved)
            {
                await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                    _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
                );
            }

            // 2. has an ongoing game
            var ongoingGameRoom = _gameRoomService.GetRoomByEitherPlayer(request.IdentityUserName);

            if (ongoingGameRoom != null && ongoingGameRoom.GamePlayStatus == GamePlayStatus.Ongoing){
                
                if (ongoingGameRoom.CreatedByUserId == request.IdentityUserName)
                {
                    ongoingGameRoom.GamePlayStatus = GamePlayStatus.CreatorDisconnected;
                } 
                else
                {
                    ongoingGameRoom.GamePlayStatus = GamePlayStatus.JoinerDisconnected;
                }

                ongoingGameRoom.ChatMessages.Add(new Models.Play.Chat(){
                    CreateDate = DateTime.Now,
                    CreatedByUser = "server",
                    Message = $"{request.IdentityUserName} disconnected from the game."
                });

                await _hubContext.Clients.Group(ongoingGameRoom.GameKey.ToString())
                    .SendAsync(RoomMethods.onReceiveMessages, ongoingGameRoom.ChatMessages);
            }

            // 3. is logged in
            bool currentLogIn = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

            if (currentLogIn)
            {
                _logInTrackerService.Remove(request.IdentityUserName);
            }

            return Unit.Value;
        }
    }
}
