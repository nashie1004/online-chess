using System;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Queries.GetCreatedRoomKey;

public class GetCreatedRoomKeyHandler : IRequestHandler<GetCreatedRoomKeyRequest, Unit>
{
    private readonly GameQueueService _gameRoomService;
    private readonly IHubContext<GameHub> _hubContext;

    public GetCreatedRoomKeyHandler(GameQueueService gameRoomService, IHubContext<GameHub> hubContext)
    {
        _gameRoomService = gameRoomService;
        _hubContext = hubContext;
    }

    public async Task<Unit> Handle(GetCreatedRoomKeyRequest req, CancellationToken ct)
    {
        foreach (var item in _gameRoomService.GetDictionary())
        {
            if (item.Value.CreatedByUserInfo.UserName == req.IdentityUserName)
            {
                await _hubContext.Clients.Client(req.UserConnectionId).SendAsync(RoomMethods.onGetRoomKey, item.Key);
                return Unit.Value;
            }
        }

        return Unit.Value;
    }
}
