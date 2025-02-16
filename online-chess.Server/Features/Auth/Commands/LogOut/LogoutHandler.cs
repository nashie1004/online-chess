using MediatR;
using Microsoft.AspNetCore.Identity;
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

        public LogoutHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            LogInTrackerService logInTackerService,
            IHttpContextAccessor httpContextAccessor
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
            _logInTackerService = logInTackerService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<LogoutResponse> Handle(LogoutRequest request, CancellationToken cancellationToken)
        {
            var retVal = new LogoutResponse();
            
            try
            {
                var userName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
                _logInTackerService.Remove(userName ?? "");

                await _signManager.SignOutAsync();
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
