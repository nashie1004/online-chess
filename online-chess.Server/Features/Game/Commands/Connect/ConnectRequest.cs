using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.Connect;

public class ConnectRequest : BaseGameRequest, IRequest<Unit>
{
    public string? IdentityUserName { get; set; }
}
