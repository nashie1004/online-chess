using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.UserDisconnectedFromGame
{
    public class UserDisconnectedFromGameHandler : IRequestHandler<UserDisconnectedFromGameRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly UserConnectionService _authenticatedUserService;
        private readonly IHubContext<GameHub> _hubContext;

        public UserDisconnectedFromGameHandler(
            GameRoomService gameRoomService
            , UserConnectionService authenticatedUserService
            , IHubContext<GameHub> hubContext
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
        }

        public async Task<Unit> Handle(UserDisconnectedFromGameRequest request, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(request.IdentityUserName)) return Unit.Value;

            var ongoingGameRoom = _gameRoomService.GetRoomByEitherPlayer(request.IdentityUserName);
            if (ongoingGameRoom == null) return Unit.Value;

            if (request.IdentityUserName == ongoingGameRoom.CreatedByUserId)
            {
                ongoingGameRoom.GamePlayStatus = GamePlayStatus.CreatorDisconnected;
            } 
            else 
            {
                ongoingGameRoom.GamePlayStatus = GamePlayStatus.JoinerDisconnected;
            }

            ongoingGameRoom.ChatMessages.Add(new Models.Play.Chat(){
                CreateDate = DateTime.Now,
                CreatedByUser = "server",
                Message = $"{request.IdentityUserName} disconnected from the game."
            });

            await _hubContext.Clients.Group(ongoingGameRoom.GameKey.ToString())
                .SendAsync(RoomMethods.onReceiveMessages, ongoingGameRoom.ChatMessages);

            await _hubContext.Clients.Group(ongoingGameRoom.GameKey.ToString())
                .SendAsync(RoomMethods.onUserDisconnectedFromGame, "TODO");

            return Unit.Value;
        }
    }
}
