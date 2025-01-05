using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models;

namespace online_chess.Server.Features.Auth.Commands.LogIn
{
    public class LoginHandler : IRequestHandler<LoginRequest, LoginResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;

        public LoginHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
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

            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
