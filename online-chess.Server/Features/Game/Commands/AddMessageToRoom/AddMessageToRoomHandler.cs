using MediatR;

namespace online_chess.Server.Features.Game.Commands.AddMessageToRoom
{
    public class AddMessageToRoomHandler : IRequestHandler<AddMessageToRoomRequest, Unit>
    {
        public AddMessageToRoomHandler()
        {

        }

        public async Task<Unit> Handle(AddMessageToRoomRequest request, CancellationToken cancellationToken)
        {
            return Unit.Value;
        }
    }
}
