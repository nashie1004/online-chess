using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.Checkmate
{
    public class CheckmateRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
