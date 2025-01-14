using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;

namespace online_chess.Server.Features.Auth.Commands.LogOut
{
    public class LogoutHandler : IRequestHandler<LogoutRequest, LogoutResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;

        public LogoutHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
        }

        public async Task<LogoutResponse> Handle(LogoutRequest request, CancellationToken cancellationToken)
        {
            var retVal = new LogoutResponse();
            
            try
            {
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
