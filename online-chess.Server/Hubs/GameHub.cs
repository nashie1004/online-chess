
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
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
        private readonly GameRoomService _gameRoomService;
        private IHttpContextAccessor _httpContextAccessor;

        public GameHub(IMediator mediator, IHttpContextAccessor httpContextAccessor, GameRoomService gameRoomService)
        {
            _mediator = mediator;
            _httpContextAccessor = httpContextAccessor;
            _gameRoomService = gameRoomService;
        }

        /* List */
        public async Task AddToQueue(short gameType)
        {
            var userIdString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            long userId = long.TryParse(userIdString, out var temp) ? temp : 0;

            _gameRoomService.Add(new GameQueue()
            {
                CreatedByUserId = userId,
                CreateDate = DateTime.Now,
                GameType = (GameType)gameType
            });
            
            await Clients.Caller.SendAsync("RefreshRoomList", _gameRoomService.GetAll());
        }

        public async Task GetRoomList()
        {
            await _mediator.Send(new GetRoomListRequest()
            {
                UserConnectionId = Context.ConnectionId
            });
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
