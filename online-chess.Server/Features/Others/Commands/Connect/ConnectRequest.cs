using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Others.Commands.Connect
{
    public class ConnectRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
