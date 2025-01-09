using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Service;
using System.Security.Claims;

namespace online_chess.Server.Features.Game.Commands.AddToQueue
{
    public class AddToQueueHandler : IRequestHandler<AddToQueueRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GameRoomService _gameRoomService;

        public AddToQueueHandler(IHubContext<GameHub> hubContext, IHttpContextAccessor httpContextAccessor, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(AddToQueueRequest request, CancellationToken cancellationToken)
        {
            var userIdString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            long userId = long.TryParse(userIdString, out var temp) ? temp : 0;

            _gameRoomService.Add(new GameQueue()
            {
                CreatedByUserId = userId,
                CreateDate = DateTime.Now,
                GameType = request.GameType
            });

            //await Clients.Caller.SendAsync("RefreshRoomList", _gameRoomService.GetAll());
            await _hubContext.Clients
                .Client(request.UserConnectionId)
                .SendAsync("RefreshRoomList", _gameRoomService.GetAll());

            return Unit.Value;
        }
    }
}
