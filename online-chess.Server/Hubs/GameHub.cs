
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Features.Game.Commands.AddToQueue;
using online_chess.Server.Features.Game.Commands.JoinRoom;
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

        /* List */
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

        /* Form */
        public async Task JoinRoom(string gameRoomKey)
        {
            await _mediator.Send(new JoinRoomRequest()
            {
                GameRoomKey = Guid.Parse(gameRoomKey),
                UserConnectionId = Context.ConnectionId
            });
        }

        public async Task LeaveRoom(string user, string message)
        {
            //var retVal = await _mediator.Send(new JoinRoomRequest());
            await Clients.All.SendAsync("TestClientResponse", "New connect:");
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("NewlyConnected", $"{Context.ConnectionId} connected");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            await Clients.All.SendAsync("Disconnected", $"{Context.ConnectionId} disconnected");
            await base.OnDisconnectedAsync(ex);
        }

    }
}
