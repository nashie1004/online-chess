using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;
using online_chess.Server.Enums;
using online_chess.Server.Models.Play;
using online_chess.Server.Constants;
using online_chess.Server.Models;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly UserConnectionService _authenticatedUserService;
        private readonly TimerService _timerService;
        private readonly ILogger<GameStartHandler> _logger;

        public GameStartHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
            , UserConnectionService authenticatedUserService
            , TimerService timerService
            , ILogger<GameStartHandler> logger
            )
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _timerService = timerService;
            _logger = logger;
        }

        public async Task<Unit> Handle(GameStartRequest request, CancellationToken cancellationToken)
        {
            var gameRoom = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (gameRoom == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            if (request.IdentityUserName != gameRoom.CreatedByUserId && request.IdentityUserName != gameRoom.JoinedByUserId)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            /* Player Reconnects */
            // if (request.Reconnect && gameRoom.GameStartedAt != DateTime.MinValue)
            if (request.Reconnect)
            {
                await _hubContext.Groups.AddToGroupAsync(request.UserConnectionId, request.GameRoomKeyString);

                var currentGameInfo = _gameRoomService.ReconnectToGame(gameRoom, request);

                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onInitializeGameInfo, currentGameInfo);
            }
            /* New Game */
            else if (!request.Reconnect)
            {
                var baseGameInfo = _gameRoomService.StartNewGame(gameRoom, request);

                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onInitializeGameInfo, baseGameInfo);
            } 

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, gameRoom.ChatMessages);

            return Unit.Value;
        }
    
    }
}
