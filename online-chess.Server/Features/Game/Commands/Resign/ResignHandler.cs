using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.Resign
{
    public class ResignHandler : IRequestHandler<ResignRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly MainDbContext _mainContext;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly UserIdentityDbContext _userIdentityDbContext;

        public ResignHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , MainDbContext mainDbContext
            , AuthenticatedUserService authenticatedUserService
            , UserIdentityDbContext userIdentityDbContext
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _mainContext = mainDbContext;
            _authenticatedUserService = authenticatedUserService;
            _userIdentityDbContext = userIdentityDbContext;
        }
        public async Task<Unit> Handle(ResignRequest request, CancellationToken cancellationToken)
        {
            

            return Unit.Value;
        }
    }
}
