using System.Text;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using online_chess.Server.Models.DTOs;
using online_chess.Server.Persistence;

namespace online_chess.Server.Features.Leaderboard.Queries.GetGameTypeList
{
    public class GetGameTypeListHandler : IRequestHandler<GetGameTypeListRequest, GetGameTypeListResponse>
    {
        private readonly MainDbContext _mainContext;
        private readonly UserIdentityDbContext _userIdentityContext;

        public GetGameTypeListHandler(MainDbContext mainDbContext, UserIdentityDbContext userIdentityContext)
        {
            _mainContext = mainDbContext;
            _userIdentityContext = userIdentityContext;
        }

        public async Task<GetGameTypeListResponse> Handle(GetGameTypeListRequest request, CancellationToken cancellationToken)
        {
            var retVal = new GetGameTypeListResponse();

            try
            {
                var sb = new StringBuilder();
                int pageSize = 5;
                                
                sb.AppendLine("SELECT");
                sb.AppendLine("  ROW_NUMBER() OVER (ORDER BY Wins DESC) AS Rank,");
                sb.AppendLine("  U1.UserName AS Username,");
                sb.AppendLine("  (SELECT COUNT(GameHistoryId) FROM GameHistories GH2 WHERE GH2.WinnerPlayerId = U1.Id) AS Wins,");
                sb.AppendLine("  (SELECT COUNT(GameHistoryId) FROM GameHistories GH2 WHERE (GH2.PlayerOneId = U1.Id OR GH2.PlayerTwoId = U1.Id) AND GH2.WinnerPlayerId != U1.Id AND GH2.IsDraw = 0) AS Loses,");
                sb.AppendLine("  (SELECT COUNT(GameHistoryId) FROM GameHistories GH2 WHERE (GH2.PlayerOneId = U1.Id OR GH2.PlayerTwoId = U1.Id) AND GH2.IsDraw = 1) AS Draws,");
                sb.AppendLine("  (SELECT GameEndDate FROM GameHistories GH2 WHERE (GH2.PlayerOneId = U1.Id OR GH2.PlayerTwoId = U1.Id) ORDER BY GH2.GameHistoryId DESC LIMIT 1) AS LastGameDate");
                sb.AppendLine("FROM AspNetUsers U1");
                sb.AppendLine("LEFT JOIN GameHistories GH ON GH.WinnerPlayerId = U1.Id");
                sb.AppendLine($"WHERE GH.GameType = @GameType");
                sb.AppendLine("GROUP BY U1.UserName, GH.GameType");
                sb.AppendLine("ORDER BY Wins DESC");
                sb.AppendLine("LIMIT @PageSize OFFSET @PaginationOffset");

                var query = sb.ToString();

                retVal.Items = await _mainContext.Set<GameTypeList>().FromSqlRaw(
                    query 
                    ,new SqliteParameter("@GameType", request.GameType)
                    ,new SqliteParameter("@PageSize", pageSize)
                    ,new SqliteParameter("@PaginationOffset", pageSize * (request.PageNumber - 1))
                ).ToListAsync();
            } 
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
