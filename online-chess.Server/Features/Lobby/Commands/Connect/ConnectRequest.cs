using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Lobby.Commands.Connect;

public class ConnectRequest : BaseGameRequest, IRequest<Unit>
{
}
