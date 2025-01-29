using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.DrawAgree
{
    public class DrawAgreeHandler : IRequestHandler<DrawAgreeRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly MainDbContext _mainContext;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly UserManager<User> _userManager;
        public DrawAgreeHandler(
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


        public async Task<Unit> Handle(DrawAgreeRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("onNotFound", true);
                return Unit.Value;
            }

            // retrieve ids
            var creator = await _userManager.FindByNameAsync(room.CreatedByUserId);
            var joiner = await _userManager.FindByNameAsync(room.JoinedByUserId);

            if (creator == null || joiner == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("onNotFound", true);
                return Unit.Value;
            }

            await _mainContext.GameHistories.AddAsync(new GameHistory()
            {
                GameStartDate = room.GameStartedAt
                ,GameEndDate = DateTime.Now

                ,PlayerOneId = creator.Id
                ,PlayerOneColor = room.CreatedByUserColor
                ,PlayerTwoId = joiner.Id
                ,PlayerTwoColor = room.CreatedByUserColor == Color.White ? Color.Black : Color.White
                
                ,WinnerPlayerId = 0
                ,IsDraw = true
                ,GameType = room.GameType
            }, cancellationToken);

            await _mainContext.SaveChangesAsync(cancellationToken);

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync("onGameOver", 2);

            return Unit.Value;
        }
    }
}
