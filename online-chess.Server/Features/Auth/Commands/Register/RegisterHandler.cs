using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;

namespace online_chess.Server.Features.Auth.Commands.Register
{
    public class RegisterHandler : IRequestHandler<RegisterRequest, RegisterResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;

        public RegisterHandler(
            UserManager<User> userManager,
            SignInManager<User> signInManager
            )
        {
            _userManager = userManager;
            _signManager = signInManager;
        }

        public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
        {
            var retVal = new RegisterResponse();

            try
            {
                var user = new User()
                {
                    UserName = request.Username,
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    retVal.ValidationErrors = result.Errors.Select(i => i.Description).ToList();
                    return retVal;
                }

                await _signManager.SignInAsync(user, true);

            } catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
