using System;
using System.Security.Claims;
using MediatR;
using online_chess.Server.Enums;
using online_chess.Server.Models.DTOs;
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

        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try{
            retVal.Items = new List<GameHistoryDTO>()
            {
                new GameHistoryDTO(){
                    GameStatus = GameStatus.Won,
                    IsColorWhite = true,
                    OpponentName = string.Empty,
                    CreateDate = DateTime.Now
                },  
                new GameHistoryDTO(){
                    GameStatus = GameStatus.Draw,
                    IsColorWhite = false,
                    OpponentName = string.Empty,
                    CreateDate = DateTime.Now
                }, 
            };
        } 
        catch (Exception err)
        {
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
