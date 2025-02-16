using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Auth.Commands.LogIn
{
    public class LoginHandler : IRequestHandler<LoginRequest, LoginResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;
        private readonly LogInTackerService _logInTackerService;

        public LoginHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            LogInTackerService logInTackerService
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
            _logInTackerService = logInTackerService;
        }

        public async Task<LoginResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            var retVal = new LoginResponse();   

            try
            {
                var user = await _userManager.FindByNameAsync(request.Username);

                if (user == null)
                {
                    retVal.ValidationErrors.Add("Invalid username or password");
                    return retVal;
                }
                var signInRes = await _signManager.PasswordSignInAsync(user, request.Password, true, true);

                if (!signInRes.Succeeded)
                {
                    retVal.ValidationErrors.Add("Invalid password");
                    return retVal;
                }

                string identityUserName = user.UserName ?? string.Empty;
                var alreadyLoggedIn = _logInTackerService.AlreadyExists(identityUserName);
                
                if (alreadyLoggedIn)
                {
                    retVal.ValidationErrors.Add(
                        "Account is already signed-in in a different browser. Please logout your other sessions first.");
                    return retVal;
                }

                _logInTackerService.Add(identityUserName);

                retVal.UserName = identityUserName;
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
