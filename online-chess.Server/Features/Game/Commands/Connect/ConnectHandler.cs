using System;
using MediatR;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.Connect;

public class ConnectHandler : IRequestHandler<ConnectRequest, Unit>
{   
    private readonly AuthenticatedUserService _authenticatedUserService;
    public ConnectHandler(AuthenticatedUserService authenticatedUserService)
    {
        _authenticatedUserService = authenticatedUserService;
    }

    public async Task<Unit> Handle(ConnectRequest req, CancellationToken ct){

        if (string.IsNullOrEmpty(req.IdentityUserName)) return Unit.Value;

        var existing = _authenticatedUserService.GetOne(req.UserConnectionId);

        if (string.IsNullOrEmpty(existing)){
            _authenticatedUserService.Add(req.UserConnectionId, req.IdentityUserName);
        }

        return Unit.Value;
    }
}
