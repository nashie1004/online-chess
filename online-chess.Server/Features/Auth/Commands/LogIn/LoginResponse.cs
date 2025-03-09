using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Commands.LogIn
{
    public class LoginResponse : BaseResponse
    {
        public string UserName { get; set; }
        public string ProfileImageUrl { get; set; }
    }
}
