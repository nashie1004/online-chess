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
                int pageSize = 5;
                var path = Path.Combine(Environment.CurrentDirectory, "Queries","GameTypeList.txt");
                var query = await File.ReadAllTextAsync(path);

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
