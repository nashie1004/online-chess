using System;
using System.Security.Claims;
using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using online_chess.Server.Enums;
using online_chess.Server.Models.Profile;
using online_chess.Server.Persistence;

namespace online_chess.Server.Features.Auth.Queries.GetGameHistory;

public class GetGameHistoryHandler : IRequestHandler<GetGameHistoryRequest, GetGameHistoryResponse>
{
    private readonly MainDbContext _mainDbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public GetGameHistoryHandler(MainDbContext mainDbContext, IHttpContextAccessor httpContextAccessor)
    {
        _mainDbContext = mainDbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetGameHistoryResponse> Handle(GetGameHistoryRequest req, CancellationToken ct){
        var retVal = new GetGameHistoryResponse();

        try{
            int pageSize = 5;
            var path = Path.Combine(Environment.CurrentDirectory, "Queries","GameHistoryList.txt");
            var query = await File.ReadAllTextAsync(path);
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            retVal.Items = await _mainDbContext.Set<GameHistoryList>().FromSqlRaw(
                query 
                ,new SqliteParameter("@PlayerId", userId)
                ,new SqliteParameter("@PageSize", pageSize)
                ,new SqliteParameter("@PaginationOffset", pageSize * (req.PageNumber - 1))
            ).ToListAsync();

            // retVal.Items.ForEach(i =>
            // {
            //     i.ProfileImageUrl = $"https://picsum.photos/300/300";
            // });
        } 
        catch (Exception err)
        {
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
