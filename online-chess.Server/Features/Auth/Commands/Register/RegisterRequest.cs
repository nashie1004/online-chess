using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Commands.Register
{
    public class RegisterRequest : BaseRequest, IRequest<RegisterResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
