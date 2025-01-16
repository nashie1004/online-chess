﻿using MediatR;
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

            // passed to Play.tsx > MainGameScene constructor
            var playerColor = (gameRoom.CreatedByUserId == request.IdentityUserName)
                ? gameRoom.CreatedByUserColor
                : (gameRoom.CreatedByUserColor == Color.White ? Color.Black : Color.White);

            var initGameinfo = new
            {
                isColorWhite = playerColor == Color.White,
                moveHistory = 1,
                captureHistory = 1,
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync("InitializeGameInfo", initGameinfo);

            return Unit.Value;
        }
    }
}
