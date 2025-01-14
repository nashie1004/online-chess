using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Lobby.Queries.GetCreatedRoomKey;

public class GetCreatedRoomKeyRequest : BaseGameRequest, IRequest<Unit>
{

}
