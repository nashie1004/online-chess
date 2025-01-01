using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.JoinRoom
{
    public class JoinRoomRequest : BaseRequest, IRequest<JoinRoomResponse>
    {
    }
}
