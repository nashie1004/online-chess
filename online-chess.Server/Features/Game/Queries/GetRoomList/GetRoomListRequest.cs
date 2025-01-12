using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Queries.GetRoomList
{
    public class GetRoomListRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
