using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.DrawAgree
{
    public class DrawAgreeRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
