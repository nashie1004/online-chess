using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Auth.Queries.GetPlayerInfo
{
    public class GetPlayerInfoHandler : IRequestHandler<GetPlayerInfoRequest, GetPlayerInfoResponse>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;

        public GetPlayerInfoHandler(
            IHttpContextAccessor httpContextAccessor,
            UserManager<User> userManager,
            SignInManager<User> signInManager
            )
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _signManager = signInManager;
        }

        public async Task<GetPlayerInfoResponse> Handle(GetPlayerInfoRequest req, CancellationToken ct)
        {
            var retVal = new GetPlayerInfoResponse();

            try
            {
                var identityName = _httpContextAccessor.HttpContext?.User.Identity?.Name ?? string.Empty;

                var user = await _userManager.FindByNameAsync(identityName);
                if (user == null) return retVal;

                retVal.UserName = user.UserName ?? string.Empty;
                var num = (new Random()).Next(1, 999);
                // TOOD
                retVal.ProfileImageUrl = user.ProfileImageUrl ?? $"https://picsum.photos/id/{num}/300/300";
            }
            catch (Exception ex) { 
                retVal.ValidationErrors.Add(ex.Message);
            }
            
            return retVal;
        }
    }
}
