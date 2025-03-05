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
        private readonly UserConnectionService _authenticatedUserService;
        private readonly LogInTrackerService _logInTrackerService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IServiceProvider _serviceProvider;

        public DisconnectHandler(
            IHubContext<GameHub> hubContext
            , GameQueueService gameQueueService
            , UserConnectionService authenticatedUserService
            , GameRoomService gameRoomService
            , LogInTrackerService logInTrackerService
            , IHttpContextAccessor httpContextAccessor
            , IServiceProvider serviceProvider
            )
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _logInTrackerService = logInTrackerService;
            _httpContextAccessor = httpContextAccessor;
            _serviceProvider = serviceProvider;
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

            // 2. is logged in
            bool currentLogIn = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

            if (currentLogIn)
            {
                _logInTrackerService.Remove(request.IdentityUserName);
            }

            // 3. has an ongoing game
            var ongoingGameRoom = _gameRoomService.GetRoomByEitherPlayer(request.IdentityUserName);
            if (ongoingGameRoom == null) return Unit.Value;

            // 3.1 ongoing game but the other player is also disconnected
            /*
            if (
                ongoingGameRoom.GamePlayStatus == GamePlayStatus.CreatorDisconnected
                || ongoingGameRoom.GamePlayStatus == GamePlayStatus.JoinerDisconnected
            ){
                await _gameRoomService.EndGame(_serviceProvider.CreateScope(), ongoingGameRoom, EndGameStatus.DrawBothPlayerDisconnected);

                return Unit.Value;
            }
            */

            // 3.2 ongoing game but the other player is not disconnected
            if (ongoingGameRoom.GamePlayStatus == GamePlayStatus.Ongoing){
                
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

            return Unit.Value;
        }
    }
}
