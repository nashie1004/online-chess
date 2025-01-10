using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Game.Commands.MovePiece
{
    public class MovePieceRequest : BaseGameRequest, IRequest<Unit>
    {
    }
}
