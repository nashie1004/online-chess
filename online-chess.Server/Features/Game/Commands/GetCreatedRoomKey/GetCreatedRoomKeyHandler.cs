using System;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.GetRoomKey;

public class GetCreatedRoomKeyHandler : IRequestHandler<GetCreatedRoomKeyRequest, Unit>
{
    private readonly GameRoomService _gameRoomService;
    private readonly IHubContext<GameHub> _hubContext;

    public GetCreatedRoomKeyHandler(GameRoomService gameRoomService, IHubContext<GameHub> hubContext)
    {
        _gameRoomService = gameRoomService;
        _hubContext = hubContext;
    }

    public async Task<Unit> Handle(GetCreatedRoomKeyRequest req, CancellationToken ct)
    {
        foreach(var item in _gameRoomService.GetDictionary())
        {
            if (item.Value.CreatedByUserId == req.UserConnectionId){
                await _hubContext.Clients.Client(req.UserConnectionId).SendAsync("GetRoomKey", item.Key);
                return Unit.Value;
            }
        }
        
        return Unit.Value;
    }
}
