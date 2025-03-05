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
        private readonly IServiceProvider _serviceProvider;

        public UserDisconnectedFromGameHandler(
            GameRoomService gameRoomService
            , UserConnectionService authenticatedUserService
            , IHubContext<GameHub> hubContext
            , IServiceProvider serviceProvider
            )
        {
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
        }

        public async Task<Unit> Handle(UserDisconnectedFromGameRequest request, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(request.IdentityUserName)) return Unit.Value;

            var ongoingGameRoom = _gameRoomService.GetRoomByEitherPlayer(request.IdentityUserName);
            if (ongoingGameRoom == null) return Unit.Value;

            // if (
            //     ongoingGameRoom.GamePlayStatus == GamePlayStatus.CreatorDisconnected
            //     || ongoingGameRoom.GamePlayStatus == GamePlayStatus.JoinerDisconnected
            // ){
            //     await _gameRoomService.EndGame(_serviceProvider.CreateScope(), ongoingGameRoom, EndGameStatus.DrawBothPlayerDisconnected);
            //     return Unit.Value;
            // }

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
