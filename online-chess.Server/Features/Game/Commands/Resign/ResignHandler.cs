using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.Resign
{
    public class ResignHandler : IRequestHandler<ResignRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly MainDbContext _mainContext;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly UserManager<User> _userManager;

        public ResignHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , MainDbContext mainDbContext
            , AuthenticatedUserService authenticatedUserService
            , UserManager<User> userManager
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _mainContext = mainDbContext;
            _authenticatedUserService = authenticatedUserService;
            _userManager = userManager;
        }
        public async Task<Unit> Handle(ResignRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);
        
            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            // retrieve ids
            var creator = await _userManager.FindByNameAsync(room.CreatedByUserId);
            var joiner = await _userManager.FindByNameAsync(room.JoinedByUserId);

            if (creator == null || joiner == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            await _mainContext.GameHistories.AddAsync(new GameHistory(){
                GameStartDate = room.GameStartedAt
                , GameEndDate = room.CreateDate

                , PlayerOneId = creator.Id
                , PlayerOneColor = room.CreatedByUserColor
                , PlayerTwoId = joiner.Id
                , PlayerTwoColor = room.CreatedByUserColor == Color.White ? Color.Black : Color.White
                
                , WinnerPlayerId = request.IdentityUserName == room.CreatedByUserId ? joiner.Id : creator.Id
                , IsDraw = false
                , GameType = room.GameType
            }, cancellationToken);

            await _mainContext.SaveChangesAsync(cancellationToken);

            string opponentConnectionId = _authenticatedUserService.GetConnectionId(
                request.IdentityUserName == room.CreatedByUserId ? room.JoinedByUserId : room.CreatedByUserId
            );

            // lose
            await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("GameOver", 1);
            // win
            await _hubContext.Clients.Client(opponentConnectionId).SendAsync("GameOver", 0);

            return Unit.Value;
        }
    }
}
