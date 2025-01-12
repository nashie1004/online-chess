using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.DeleteRoom;

public class DeleteRoomRequest : BaseGameRequest, IRequest<Unit>
{
}
