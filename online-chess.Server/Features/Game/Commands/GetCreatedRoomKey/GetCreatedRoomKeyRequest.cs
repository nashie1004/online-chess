using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.GetRoomKey;

public class GetCreatedRoomKeyRequest : BaseGameRequest, IRequest<Unit>
{

}
