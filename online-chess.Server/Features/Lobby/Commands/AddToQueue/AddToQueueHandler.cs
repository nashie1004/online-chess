﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Lobby;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.AddToQueue
{
    public class AddToQueueHandler : IRequestHandler<AddToQueueRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GameQueueService _gameRoomService;

        public AddToQueueHandler(IHubContext<GameHub> hubContext, IHttpContextAccessor httpContextAccessor, GameQueueService gameRoomService)
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
                GameKey = roomKey,
                CreatedByUserId = request.IdentityUserName,
                CreateDate = DateTime.Now,
                GameType = request.GameType,
                CreatedByUserColor = request.ColorOption,
                JoinedByUserId = string.Empty,
                GamePlayStatus = GamePlayStatus.WaitingForPlayers
            });

            await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, roomKey.ToString());
            
            await _hubContext.Clients.Group(roomKey.ToString()).SendAsync(RoomMethods.onGetRoomKey, roomKey);

            await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                _gameRoomService.GetPaginatedDictionary().ToArray()
            );

            return Unit.Value;
        }
    }
}
