using System;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.DeleteRoom;

public class DeleteRoomHandler : IRequestHandler<DeleteRoomRequest, Unit>
{
    private readonly GameQueueService _gameRoomService;
    private readonly IHubContext<GameHub> _hubContext;

    public DeleteRoomHandler(GameQueueService gameRoomService, IHubContext<GameHub> hubContext)
    {
        _gameRoomService = gameRoomService;
        _hubContext = hubContext;
    }

    public async Task<Unit> Handle(DeleteRoomRequest req, CancellationToken ct){

        // if not a valid guid, redirect to 404 notfound
        if (!Guid.TryParse(req.GameRoomKeyString, out Guid gameRoomKey))
        {
            await _hubContext
                .Clients
                .Client(req.UserConnectionId)
                .SendAsync("InvalidRoomKey", $"Room key {req.GameRoomKeyString} is invalid");

            return Unit.Value;
        }

        _gameRoomService.Remove(gameRoomKey);
        await _hubContext.Clients.All.SendAsync("RefreshRoomList", 
            _gameRoomService.GetPaginatedDictionary(1).ToArray()
        );

        return Unit.Value;
    }

}
