using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Auth.Commands.LogOut
{
    public class LogoutHandler : IRequestHandler<LogoutRequest, LogoutResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;
        private readonly LogInTrackerService _logInTackerService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;

        public LogoutHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            LogInTrackerService logInTackerService,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<GameHub> hubContext,
            GameQueueService gameQueueService
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
            _logInTackerService = logInTackerService;
            _httpContextAccessor = httpContextAccessor;
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
        }

        public async Task<LogoutResponse> Handle(LogoutRequest request, CancellationToken cancellationToken)
        {
            var retVal = new LogoutResponse();
            
            try
            {
                var identityUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "";
                _logInTackerService.Remove(identityUserName);

                await _signManager.SignOutAsync();
                
                var aQueuedRoomIsRemoved = _gameQueueService.RemoveByCreator(identityUserName);
            
                if (aQueuedRoomIsRemoved){
                    await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                        _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
                    );
                }

            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
