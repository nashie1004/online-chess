using MediatR;

namespace online_chess.Server.Features.Auth.Commands.LogIn
{
    public class LoginRequest : IRequest<LoginResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
