using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Others.Commands.Connect
{
    public class ConnectHandler : IRequestHandler<ConnectRequest, Unit>
    {
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly SignInManager<User> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly LogInTrackerService _logInTrackerService;

        public ConnectHandler(
            AuthenticatedUserService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , SignInManager<User> signInManager
            , IHttpContextAccessor httpContextAccessor
            , LogInTrackerService logInTrackerService
            )
        {
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _signInManager = signInManager;
            _httpContextAccessor = httpContextAccessor;
            _logInTrackerService = logInTrackerService;
        }

        public async Task<Unit> Handle(ConnectRequest req, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(req.IdentityUserName)) return Unit.Value;

            _authenticatedUserService.RemoveWithIdentityUsername(req.IdentityUserName);

            _authenticatedUserService.Add(req.UserConnectionId, req.IdentityUserName);

            await _hubContext.Clients.Client(req.UserConnectionId).SendAsync(RoomMethods.onGetUserConnectionId, req.UserConnectionId);

            bool currentLogIn = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

            if (currentLogIn)
            {
                _logInTrackerService.Add(req.IdentityUserName);
            }

            return Unit.Value;

        }
    }
}
