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
            var roomKey = Guid.NewGuid();

            _gameRoomService.Add(roomKey, new GameQueue()
            {
                CreatedByUserId = request.UserConnectionId,
                CreateDate = DateTime.Now,
                GameType = request.GameType,
                JoinedByUserId = string.Empty
            });

            await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("GetRoomKey", roomKey);

            await _hubContext.Clients.All.SendAsync("RefreshRoomList",
                _gameRoomService.GetPaginatedDictionary(1).ToArray()
                );

            return Unit.Value;
        }
    }
}
