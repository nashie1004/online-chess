﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;
using online_chess.Server.Enums;
using online_chess.Server.Models.Play;
using online_chess.Server.Constants;
using online_chess.Server.Models;
using online_chess.Server.Persistence;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly UserManager<User> _userManager;

        public GameStartHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
            , UserManager<User> userManager
            )
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _userManager = userManager;
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

                await SetPlayersProfileImages(currentGameInfo);

                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onInitializeGameInfo, currentGameInfo);
            }
            /* New Game */
            else
            {
                var baseGameInfo = _gameRoomService.StartNewGame(gameRoom, request);

                await SetPlayersProfileImages(baseGameInfo);

                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onInitializeGameInfo, baseGameInfo);
            } 

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, gameRoom.ChatMessages);

            return Unit.Value;
        }
    
        private async Task SetPlayersProfileImages(CurrentGameInfo gameInfo)
        {
            string defaultImg = "https://picsum.photos/300/300"; 

            // gameInfo.CreatedByUserInfo.ProfileImageUrl = (await _userManager.FindByNameAsync(gameInfo.CreatedByUserInfo.UserName))?.ProfileImageUrl ?? defaultImg;
            // gameInfo.JoinedByUserInfo.ProfileImageUrl = (await _userManager.FindByNameAsync(gameInfo.JoinedByUserInfo.UserName))?.ProfileImageUrl ?? defaultImg;
        }

    }
}
