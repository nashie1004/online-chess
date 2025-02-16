﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Lobby.Commands.JoinRoom
{
    public class JoinRoomHandler : IRequestHandler<JoinRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly GameRoomService _gameRoomService; 
        private readonly AuthenticatedUserService _authenticatedUserService;

        public JoinRoomHandler(IHubContext<GameHub> hubContext, GameQueueService gameQueueService, AuthenticatedUserService authenticatedUserService, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _gameQueueService = gameQueueService;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
        }

        public async Task<Unit> Handle(JoinRoomRequest request, CancellationToken cancellationToken)
        {
            // 1.1 if not a valid guid, redirect to 404 not found
            // 1.2 or no connection id found
            var room = _gameQueueService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            room.JoinedByUserId = request.IdentityUserName;

            var p1Connection = _authenticatedUserService.GetConnectionId(room.CreatedByUserId);
            var p2Connection = _authenticatedUserService.GetConnectionId(room.JoinedByUserId);

            if (string.IsNullOrWhiteSpace(p1Connection))
            {
                string retMsg = $"404 - Connection Id for {room.CreatedByUserId} not found";
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, retMsg);
                return Unit.Value;
            }
            
            if (string.IsNullOrWhiteSpace(p2Connection))
            {
                string retMsg = $"404 - Connection Id for {room.JoinedByUserId} not found";
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, retMsg);
                return Unit.Value;
            }


            var val = new Random().Next(0, 2);  // Generates either 0 or 1
            var randomColor = val == 0 ? Color.White : Color.Black;
            var newColor = room.CreatedByUserColor == Color.Random ? randomColor : room.CreatedByUserColor;

            // remove from game queue and add to game room
            _gameRoomService.Add(room.GameKey, new GameRoom(){
                GameKey = room.GameKey,
                CreatedByUserId = room.CreatedByUserId,
                CreateDate = room.CreateDate,
                GameType = room.GameType,
                CreatedByUserColor = newColor, 
                JoinedByUserId = room.JoinedByUserId,
                GamePlayStatus = GamePlayStatus.Ongoing,
                //GameStartedAt = DateTime.Now,
            });

            // remove both player queuing rooms
            _gameQueueService.RemoveByCreator(room.CreatedByUserId);
            _gameQueueService.RemoveByCreator(room.JoinedByUserId);

            await _hubContext.Clients.All.SendAsync(RoomMethods.onRefreshRoomList,
                _gameQueueService.GetPaginatedDictionary().ToArray().OrderByDescending(i => i.Value.CreateDate)
            );

            // redirect both users
            await _hubContext.Clients.Client(p1Connection).SendAsync(RoomMethods.onMatchFound, room.GameKey.ToString());
            await _hubContext.Clients.Client(p2Connection).SendAsync(RoomMethods.onMatchFound, room.GameKey.ToString());

            return Unit.Value;
        }
    }
}
