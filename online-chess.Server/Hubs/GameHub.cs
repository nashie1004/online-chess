
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Features.Game.Commands.AddMessageToRoom;
using online_chess.Server.Features.Game.Commands.AddToQueue;
using online_chess.Server.Features.Game.Commands.JoinRoom;
using online_chess.Server.Features.Game.Commands.LeaveRoom;
using online_chess.Server.Features.Game.Queries.GetRoomList;
using online_chess.Server.Models;
using online_chess.Server.Service;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace online_chess.Server.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {
        private readonly IMediator _mediator;

        public GameHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        /* 1. Lobby Page */
        public async Task AddToQueue(short gameType)
        {
            await _mediator.Send(new AddToQueueRequest()
            {
                GameType = (GameType)gameType,
                UserConnectionId = Context.ConnectionId
            });
        }

        public async Task GetRoomList()
        {
            await _mediator.Send(new GetRoomListRequest()
            {
                UserConnectionId = Context.ConnectionId
            });
        }

        public async Task JoinRoom(string gameRoomKey)
        {
            await _mediator.Send(new JoinRoomRequest()
            {
                GameRoomKeyString = gameRoomKey,
                UserConnectionId = Context.ConnectionId
            });
        }

        public async Task DeleteRoom(string gameRoomKey)
        {

        }

        public async Task AddMessageToRoom(string message)
        {
            await _mediator.Send(new AddMessageToRoomRequest()
            {
                UserConnectionId = Context.ConnectionId
            });
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            await _mediator.Send(new LeaveRoomRequest()
            {
                UserConnectionId = Context.ConnectionId
            });

            await base.OnDisconnectedAsync(ex);
        }

    }
}
