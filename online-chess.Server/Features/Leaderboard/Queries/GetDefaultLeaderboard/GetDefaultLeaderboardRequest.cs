using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Leaderboard.Queries.GetDefaultLeaderboard;

public class GetDefaultLeaderboardRequest : BaseRequestList, IRequest<GetDefaultLeaderboardResponse>
{

}
