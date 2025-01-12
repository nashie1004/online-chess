
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Features.Game.Commands.AddMessageToRoom;
using online_chess.Server.Features.Game.Commands.AddToQueue;
using online_chess.Server.Features.Game.Commands.Connect;
using online_chess.Server.Features.Game.Commands.DeleteRoom;
using online_chess.Server.Features.Game.Commands.GetRoomKey;
using online_chess.Server.Features.Game.Commands.JoinRoom;
using online_chess.Server.Features.Game.Commands.LeaveRoom;
using online_chess.Server.Features.Game.Queries.GetRoomList;

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
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        public async Task GetRoomList(int pageNumber)
        {
            await _mediator.Send(new GetRoomListRequest()
            {
                UserConnectionId = Context.ConnectionId,
                PageNumber = pageNumber,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        public async Task JoinRoom(string gameRoomKey)
        {
            await _mediator.Send(new JoinRoomRequest()
            {
                GameRoomKeyString = gameRoomKey,
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        public async Task DeleteRoom(string gameRoomKey)
        {
            await _mediator.Send(new DeleteRoomRequest()
            {
                GameRoomKeyString = gameRoomKey,
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }
        
        public async Task GetCreatedRoomKey()
        {
            await _mediator.Send(new GetCreatedRoomKeyRequest()
            {   
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        /* 2. Play Page */
        public async Task AddMessageToRoom(string message)
        {
            await _mediator.Send(new AddMessageToRoomRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            await _mediator.Send(new ConnectRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            await _mediator.Send(new LeaveRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });

            await base.OnDisconnectedAsync(ex);
        }
    }
}
