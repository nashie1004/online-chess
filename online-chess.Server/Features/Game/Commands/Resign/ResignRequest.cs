using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.Resign
{
    public class ResignRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
