using System;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using online_chess.Server.Models;
using online_chess.Server.Models.DTOs;
using online_chess.Server.Persistence;

namespace online_chess.Server.Features.Leaderboard.Queries.GetDefaultLeaderboard;

public class GetDefaultLeaderboardHandler : IRequestHandler<GetDefaultLeaderboardRequest, GetDefaultLeaderboardResponse>
{
    private readonly MainDbContext _mainDbContext;
    private readonly UserIdentityDbContext _userIdentityDbContext;

    public GetDefaultLeaderboardHandler(MainDbContext mainDbContext, UserIdentityDbContext userIdentityDbContext)
    {
        _mainDbContext = mainDbContext;
        _userIdentityDbContext = userIdentityDbContext;
    }

    public async Task<GetDefaultLeaderboardResponse> Handle(GetDefaultLeaderboardRequest req, CancellationToken ct)
    {
        var retVal = new GetDefaultLeaderboardResponse();

        try{
            int pageSize = 5;
            var path = Path.Combine(Environment.CurrentDirectory, "Queries","LeaderboardList.txt");
            var query = await File.ReadAllTextAsync(path);

            retVal.Items = await _mainDbContext.Set<LeaderboardList>().FromSqlRaw(
                query 
                ,new SqliteParameter("@PageSize", pageSize)
                ,new SqliteParameter("@PaginationOffset", pageSize * (req.PageNumber - 1))
            ).ToListAsync();

        } 
        catch (Exception err){
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
