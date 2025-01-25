using MediatR;
using online_chess.Server.Common;
using online_chess.Server.Constants;

namespace online_chess.Server.Features.Leaderboard.Queries.GetGameTypeList
{
    public class GetGameTypeListRequest : BaseRequestList, IRequest<GetGameTypeListResponse>
    {
        public GameType GameType { get; set; }
    }
}
