﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Queries.GetRoomList
{
    public class GetRoomListHandler : IRequestHandler<GetRoomListRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubCtx;
        private readonly GameQueueService _gameRoomService;

        public GetRoomListHandler(IHubContext<GameHub> ctx, GameQueueService gameRoomService)
        {
            _hubCtx = ctx;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(GetRoomListRequest request, CancellationToken cancellationToken)
        {
            await _hubCtx.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onRefreshRoomList,
                _gameRoomService.GetPaginatedDictionary(request.PageNumber).ToArray().OrderByDescending(i => i.Value.CreateDate)
            );

            return Unit.Value;
        }
    }
}
