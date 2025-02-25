using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.UserDisconnectedFromGame
{
    public class UserDisconnectedFromGameRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
