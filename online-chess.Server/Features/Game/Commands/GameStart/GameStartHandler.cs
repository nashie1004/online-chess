﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;
using online_chess.Server.Enums;
using online_chess.Server.Models.Play;
using online_chess.Server.Constants;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly AuthenticatedUserService _authenticatedUserService;
        private readonly TimerService _timerService;

        public GameStartHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
            , AuthenticatedUserService authenticatedUserService
            , TimerService timerService
            )
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _timerService = timerService;
        }

        public async Task<Unit> Handle(GameStartRequest request, CancellationToken cancellationToken)
        {
            // not a valid guid
            var gameRoom = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (gameRoom == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onNotFound, true);
                return Unit.Value;
            }

            // TODO: if user disconnects re apply new connectid as 
            // it may cause null here _authenticatedUserService
            var player1 = _authenticatedUserService.GetConnectionId(gameRoom.CreatedByUserId);
            var player2 = _authenticatedUserService.GetConnectionId(gameRoom.JoinedByUserId);

            if (string.IsNullOrEmpty(player1) || string.IsNullOrEmpty(player1))
            {
                return Unit.Value;
            }

            await _hubContext.Groups.AddToGroupAsync(player1, request.GameRoomKeyString);
            await _hubContext.Groups.AddToGroupAsync(player2, request.GameRoomKeyString);

            /*
            Start The Game
            - passed to Play.tsx > MainGameScene constructor
            */
            //gameRoom.InitializeGameLogic();

            TimeSpan initialCreatorTime; 
            TimeSpan initialJoinerTime; 

            switch(gameRoom.GameType){
                case GameType.Classical:
                    initialCreatorTime = TimeSpan.FromMinutes(60);
                    initialJoinerTime = TimeSpan.FromMinutes(60);
                    break;
                case GameType.Blitz3Mins:
                    initialCreatorTime = TimeSpan.FromMinutes(3);
                    initialJoinerTime = TimeSpan.FromMinutes(3);
                    break;
                case GameType.Blitz5Mins:
                    initialCreatorTime = TimeSpan.FromMinutes(5);
                    initialJoinerTime = TimeSpan.FromMinutes(5);
                    break;
                case GameType.Rapid10Mins:
                    initialCreatorTime = TimeSpan.FromMinutes(10);
                    initialJoinerTime = TimeSpan.FromMinutes(10);
                    break;
                case GameType.Rapid25Mins:
                    initialCreatorTime = TimeSpan.FromMinutes(25);
                    initialJoinerTime = TimeSpan.FromMinutes(25);
                    break;
                default:
                    initialCreatorTime = TimeSpan.FromMinutes(5);
                    initialJoinerTime = TimeSpan.FromMinutes(5);
                    break;
            }

            // add small buffer for player white
            /*
            initialCreatorTime = 
                (gameRoom.CreatedByUserColor == Color.White) 
                ? initialCreatorTime.Add(TimeSpan.FromSeconds(5)) 
                : initialCreatorTime;
            initialJoinerTime = 
                (gameRoom.CreatedByUserColor != Color.White) 
                ? initialJoinerTime.Add(TimeSpan.FromSeconds(5)) 
                : initialJoinerTime;
            */

            _timerService.InitializeTimer(gameRoom.GameKey, 
                (initialCreatorTime.TotalSeconds, initialJoinerTime.TotalSeconds)
            );

            gameRoom.GameStartedAt = DateTime.Now;
            gameRoom.CreatedByUserInfo = new PlayerInfo(){
                UserName = gameRoom.CreatedByUserId
                , IsPlayersTurnToMove = gameRoom.CreatedByUserColor == Color.White
                , TimeLeft = initialCreatorTime.TotalSeconds
                , LastMoveDate = DateTime.Now
                , IsColorWhite = gameRoom.CreatedByUserColor == Color.White
                , KingInCheck = false
                , KingInCheckMate = false
                , KingInStaleMate = false
            };
            gameRoom.JoinByUserInfo = new PlayerInfo(){
                UserName = gameRoom.JoinedByUserId
                , IsPlayersTurnToMove = gameRoom.CreatedByUserColor != Color.White
                , TimeLeft = initialJoinerTime.TotalSeconds
                , LastMoveDate = DateTime.Now
                , IsColorWhite = gameRoom.CreatedByUserColor != Color.White
                , KingInCheck = false
                , KingInCheckMate = false
                , KingInStaleMate = false
            };
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

            var baseGameInfo = new CurrentGameInfo()
            {
                GameRoomKey = gameRoom.GameKey,
                LastMoveInfo = new BaseMoveInfo(),
                LastCapture = null,
                MoveCount = 0,
                CreatedByUserInfo = gameRoom.CreatedByUserInfo,
                JoinedByUserInfo = gameRoom.JoinByUserInfo,
                GameType = gameRoom.GameType
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onInitializeGameInfo, baseGameInfo);
            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, gameRoom.ChatMessages);

            return Unit.Value;
        }
    }
}
