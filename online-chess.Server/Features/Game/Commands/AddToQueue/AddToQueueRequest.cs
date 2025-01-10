using MediatR;
using online_chess.Server.Common;
using online_chess.Server.Constants;

namespace online_chess.Server.Features.Game.Commands.AddToQueue
{
    public class AddToQueueRequest : BaseGameRequest, IRequest<Unit>
    {
        public GameType GameType { get; set; }
    }
}
