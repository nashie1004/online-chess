using System;
using MediatR;
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
            /*
            Username, Wins, Loses, Draw, Last Game Date
            */
            var userList = _userIdentityDbContext.Users.Skip((req.PageNumber - 1) * 5).Take(5).ToList();

            foreach(var user in userList){
                if (user == null) continue;

                retVal.LeaderboardList.Add(new LeaderboardList(){
                    UserName = user?.UserName,
                    Wins = 0,
                    Loses = 0,
                    Draws = 0,
                    LastGameDate = user.CreateDate
                });
            }
            
        } 
        catch (Exception err){
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
