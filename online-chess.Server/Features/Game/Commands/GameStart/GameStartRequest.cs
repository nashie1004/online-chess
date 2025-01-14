using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
