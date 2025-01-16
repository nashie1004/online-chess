using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.AddMessageToRoom
{
    public class AddMessageToRoomRequest : BaseGameRequest, IRequest<Unit>
    {
        public string Message { get; set; }
    }
}
