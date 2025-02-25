using MediatR;

namespace online_chess.Server.Features.Game.Commands.UserDisconnectedFromGame
{
    public class UserDisconnectedFromGameHandler : IRequestHandler<UserDisconnectedFromGameRequest, Unit>
    {
        public UserDisconnectedFromGameHandler()
        {
            
        }

        public async Task<Unit> Handle(UserDisconnectedFromGameRequest req, CancellationToken ct)
        {
            return Unit.Value;
        }
    }
}
