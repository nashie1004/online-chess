using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Lobby.Commands.DeleteRoom;

public class DeleteRoomRequest : BaseGameRequest, IRequest<Unit>
{
}
