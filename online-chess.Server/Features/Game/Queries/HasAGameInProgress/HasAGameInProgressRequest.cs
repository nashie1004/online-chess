using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Queries.HasAGameInProgress
{
    public class HasAGameInProgressRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
