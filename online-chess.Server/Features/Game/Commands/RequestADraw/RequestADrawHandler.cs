using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Play;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.RequestADraw
{
    public class RequestADrawHandler : IRequestHandler<RequestADrawRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly MainDbContext _mainContext;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly UserManager<User> _userManager;

        public RequestADrawHandler(
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

        public async Task<Unit> Handle(RequestADrawRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onNotFound, true);
                return Unit.Value;
            }

            string opponentConnectionId = _authenticatedUserService.GetConnectionId(
                request.IdentityUserName == room.CreatedByUserId ? room.JoinedByUserId : room.CreatedByUserId
            );

            var msgList = new List<Chat>(){
                new Models.Play.Chat(){
                CreateDate = DateTime.Now,
                CreatedByUser = "server",
                Message = $"{request.IdentityUserName} offered a draw."
            }
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, msgList);
            
            await _hubContext.Clients.Client(opponentConnectionId).SendAsync(RoomMethods.onOpponentDrawRequest, true);

            return Unit.Value;
        }
    }
}
