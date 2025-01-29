using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.RequestADraw
{
    public class RequestADrawRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
