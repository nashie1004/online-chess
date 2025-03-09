using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Queries.HasAGameInProgress
{
    public class HasAGameInProgressHandler : IRequestHandler<HasAGameInProgressRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;

        public HasAGameInProgressHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
        )
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(HasAGameInProgressRequest req, CancellationToken ct)
        {
            string? roomKey = null;
            var inProgressGame = _gameRoomService.GetRoomByEitherPlayer(req.IdentityUserName ?? "");

            if (inProgressGame != null)
            {
                roomKey = inProgressGame.GameKey.ToString();
            }

            await _hubContext.Clients.Client(req.UserConnectionId)
                .SendAsync(RoomMethods.onHasAGameInProgress, roomKey);


            return Unit.Value;
        }
    }
}
