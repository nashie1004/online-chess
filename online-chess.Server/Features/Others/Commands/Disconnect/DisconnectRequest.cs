using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Others.Commands.Disconnect
{
    public class DisconnectRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
