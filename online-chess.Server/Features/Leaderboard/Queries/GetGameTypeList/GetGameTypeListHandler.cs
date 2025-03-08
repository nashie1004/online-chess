using System.Text;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using online_chess.Server.Constants;
using online_chess.Server.Models.Profile;
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
                string gameTypes = string.Empty;
                int pageSize = 5;
                string path = Path.Combine(Environment.CurrentDirectory, "Queries","GameTypeList.txt");
                string query = await File.ReadAllTextAsync(path);

                switch(request.GameType){
                    case GameType.Classical:
                        gameTypes = "1";
                        break;
                    case GameType.Blitz3Mins:
                    case GameType.Blitz5Mins:
                        gameTypes = "2, 3";
                        break;
                    case GameType.Rapid10Mins:
                    case GameType.Rapid25Mins:
                        gameTypes = "4, 5";
                        break;
                }

                query = query.Replace("@GameType", gameTypes);

                retVal.Items = await _mainContext.Set<GameTypeList>().FromSqlRaw(
                    query 
                    // ,new SqliteParameter("@GameType", gameTypes)
                    ,new SqliteParameter("@PageSize", pageSize)
                    ,new SqliteParameter("@PaginationOffset", pageSize * (request.PageNumber - 1))
                ).ToListAsync();

                retVal.Items.ForEach(i =>
                {
                    i.ProfileImageUrl = $"https://picsum.photos/id/{(new Random()).Next(1, 999)}/300/300";
                });
            } 
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
