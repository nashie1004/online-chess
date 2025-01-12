using System;
using online_chess.Server.Common;
using online_chess.Server.Models;

namespace online_chess.Server.Features.Leaderboard.Queries.GetDefaultLeaderboard;

public class GetDefaultLeaderboardResponse : BaseResponse
{
    public List<LeaderboardList> LeaderboardList { get; set; } = new();
}
