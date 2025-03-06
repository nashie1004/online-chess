using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.Resign
{
    public class ResignHandler : IRequestHandler<ResignRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;

        public ResignHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , IServiceProvider serviceProvider
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
        }
        public async Task<Unit> Handle(ResignRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);
        
            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            var endGameStatus = request.IdentityUserName == room.CreatedByUserId ? EndGameStatus.CreatorResigned : EndGameStatus.JoinerResigned;

            await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room, endGameStatus);

            return Unit.Value;
        }
    }
}
