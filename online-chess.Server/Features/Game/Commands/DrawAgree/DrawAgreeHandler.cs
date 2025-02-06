using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Play;
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
        private readonly TimerService _timerService;

        public DrawAgreeHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , MainDbContext mainDbContext
            , AuthenticatedUserService authenticatedUserService
            , UserManager<User> userManager
            , TimerService timerService
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _mainContext = mainDbContext;
            _authenticatedUserService = authenticatedUserService;
            _userManager = userManager;
            _timerService = timerService;
        }


        public async Task<Unit> Handle(DrawAgreeRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onNotFound, true);
                return Unit.Value;
            }

            // other player decline draw
            if (!request.AgreeOnDraw)
            {
                var msgList = new List<Chat>(){
                    new Models.Play.Chat(){
                    CreateDate = DateTime.Now,
                    CreatedByUser = "server",
                    Message = $"{request.IdentityUserName} declined the draw."
                }
                };

                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, msgList);
                
                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onDeclineDraw, true);
                return Unit.Value;
            }

            // retrieve ids
            var creator = await _userManager.FindByNameAsync(room.CreatedByUserId);
            var joiner = await _userManager.FindByNameAsync(room.JoinedByUserId);

            if (creator == null || joiner == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onNotFound, true);
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

            var msgLists = new List<Chat>(){
                new Models.Play.Chat(){
                CreateDate = DateTime.Now,
                CreatedByUser = "server",
                Message = $"Game ended in a draw."
            }
            };

            _timerService.RemoveTimer(room.GameKey);

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, msgLists);
                
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onGameOver, 2);

            return Unit.Value;
        }
    }
}
