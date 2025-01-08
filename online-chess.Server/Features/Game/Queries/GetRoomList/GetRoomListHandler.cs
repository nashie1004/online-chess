using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Queries.GetRoomList
{
    public class GetRoomListHandler : IRequestHandler<GetRoomListRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubCtx;
        private readonly GameRoomService _gameRoomService;

        public GetRoomListHandler(IHubContext<GameHub> ctx, GameRoomService gameRoomService)
        {
            _hubCtx = ctx;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(GetRoomListRequest request, CancellationToken cancellationToken)
        {
            await _hubCtx.Clients.Client(request.UserConnectionId).SendAsync("RefreshRoomList", _gameRoomService.GetAll());

            return Unit.Value;
        }
    }
}
