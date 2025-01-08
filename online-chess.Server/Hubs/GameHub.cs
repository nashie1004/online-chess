
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Features.Game.Commands.JoinRoom;
using System.Collections.Concurrent;

namespace online_chess.Server.Hubs
{
    public class GameHub : Hub
    {
        private readonly IMediator _mediator;
        private static ConcurrentDictionary<Guid, string> _gameRoomIds = new ConcurrentDictionary<Guid, string>();

        public GameHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        /* List */
        public async Task AddToQueue(string gameType)
        {
            Guid roomId = Guid.NewGuid();
            _gameRoomIds.TryAdd(roomId, gameType);
            await Clients.Caller.SendAsync("RefreshRoomList", _gameRoomIds.ToArray());
        }

        public async Task GetRoomList()
        {
            await Clients.Caller.SendAsync("RefreshRoomList", _gameRoomIds.ToArray());
        }

        /* Form */
        public async Task JoinRoom(string user, string message)
        {
            //var retVal = await _mediator.Send(new JoinRoomRequest());
            await Clients.All.SendAsync("TestClientResponse", "New connect:");
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
