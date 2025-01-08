using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Queries.GetRoomList
{
    public class GetRoomListRequest : BaseRequest, IRequest<Unit>
    {
        public string UserConnectionId { get; set; }
    }
}
