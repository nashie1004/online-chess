using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Commands.LogOut
{
    public class LogoutRequest : BaseRequest, IRequest<LogoutResponse>
    {
    }
}
