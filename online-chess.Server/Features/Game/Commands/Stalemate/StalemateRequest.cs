using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.Stalemate
{
    public class StalemateRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
