using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;
using online_chess.Server.Enums;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;

        public GameStartHandler(IHubContext<GameHub> hubContext, GameRoomService gameRoomService, AuthenticatedUserService authenticatedUserService)
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
        }

        public async Task<Unit> Handle(GameStartRequest request, CancellationToken cancellationToken)
        {
            // not a valid guid
            if (!Guid.TryParse(request.GameRoomKeyString, out Guid gameRoomKey))
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync("NotFound", true);
                return Unit.Value;
            }

            var gameRoom = _gameRoomService.GetOne(gameRoomKey);

            // TODO: if user disconnects re apply new connectid as 
            // it may cause null here _authenticatedUserService
            await _hubContext.Groups.AddToGroupAsync(
                _authenticatedUserService.GetConnectionId(gameRoom.CreatedByUserId)
                , gameRoomKey.ToString());

            await _hubContext.Groups.AddToGroupAsync(
                _authenticatedUserService.GetConnectionId(gameRoom.JoinedByUserId)
                , gameRoomKey.ToString());

            /*
            Start The Game
            - passed to Play.tsx > MainGameScene constructor
            */
            var playerColor = (gameRoom.CreatedByUserId == request.IdentityUserName)
                ? gameRoom.CreatedByUserColor
                : (gameRoom.CreatedByUserColor == Color.White ? Color.Black : Color.White);

            gameRoom.GameStartedAt = DateTime.Now;
            gameRoom.ChatMessages = new List<Models.Play.Chat>()
            {
                new Models.Play.Chat()
                {
                    CreateDate = DateTime.Now
                    , CreatedByUser = gameRoom.CreatedByUserId
                    , Message = $"{gameRoom.CreatedByUserId} has joined the game."
                }
                ,new Models.Play.Chat()
                {
                    CreateDate = DateTime.Now
                    , CreatedByUser = gameRoom.JoinedByUserId
                    , Message = $"{gameRoom.JoinedByUserId} has joined the game."
                }
            };

            var initGameinfo = new
            {
                gameRoomKey,
                isColorWhite = playerColor == Color.White,
                moveHistory = gameRoom.MoveHistory,
                captureHistory = gameRoom.CaptureHistory,
                gameStartedAtDate = gameRoom.GameStartedAt,
                messages = gameRoom.ChatMessages,
                createdByUserInfo = gameRoom.CreatedByUserInfo,
                joinedByUserInfo = gameRoom.JoinByUserInfo,
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync("InitializeGameInfo", initGameinfo);

            return Unit.Value;
        }
    }
}
