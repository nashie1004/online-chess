using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Queries.GetRoomList
{
    public class GetRoomListRequest : BaseGameRequest, IRequest<Unit>
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
