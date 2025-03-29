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
        private readonly string _defaultProfileImageKey;

        public RegisterHandler(
            UserManager<User> userManager
            , SignInManager<User> signInManager
            , IConfiguration configuration
            )
        {
            _userManager = userManager;
            _signManager = signInManager;

            bool.TryParse(configuration["UseS3"], out bool useS3);
            _defaultProfileImageKey = useS3 ? "profile-images/DefaultProfileImage.jpg" : "DefaultProfileImage.jpg";
        }

        public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
        {
            var retVal = new RegisterResponse();

            try
            {
                var user = new User()
                {
                    UserName = request.Username,
                    ProfileImageUrl = _defaultProfileImageKey
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
