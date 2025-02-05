using System;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.Connect;

public class ConnectHandler : IRequestHandler<ConnectRequest, Unit>
{
    private readonly AuthenticatedUserService _authenticatedUserService;
    private readonly IHubContext<GameHub> _hubContext;

    public ConnectHandler(AuthenticatedUserService authenticatedUserService, IHubContext<GameHub> hubContext)
    {
        _authenticatedUserService = authenticatedUserService;
        _hubContext = hubContext;
    }

    public async Task<Unit> Handle(ConnectRequest req, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(req.IdentityUserName)) return Unit.Value;

        _authenticatedUserService.RemoveOneWithConnectionId(req.UserConnectionId);

        var existing = _authenticatedUserService.GetIdentityName(req.UserConnectionId);

        if (string.IsNullOrEmpty(existing))
        {
            _authenticatedUserService.Add(req.UserConnectionId, req.IdentityUserName);
            await _hubContext.Clients.Client(req.UserConnectionId).SendAsync(RoomMethods.onGetUserConnectionId, req.UserConnectionId);
        }

        return Unit.Value;
    }
}
