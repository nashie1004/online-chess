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
            string? identityUserName = request.IdentityUserName;

            if (string.IsNullOrEmpty(identityUserName)) return Unit.Value;

            _authenticatedUserService.RemoveWithIdentityUsername(identityUserName);

            var aQueuedRoomIsRemoved = _gameQueueService.RemoveByCreator(identityUserName);

            if (aQueuedRoomIsRemoved)
            {
                await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                    _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
                );
            }

            bool currentLogIn = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

            if (currentLogIn)
            {
                _logInTrackerService.Remove(identityUserName);
            }

            return Unit.Value;
        }
    }
}
