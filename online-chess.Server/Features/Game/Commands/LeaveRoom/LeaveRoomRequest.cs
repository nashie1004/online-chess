using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.LeaveRoom
{
    public class LeaveRoomRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
