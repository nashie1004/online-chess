
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Enums;
using online_chess.Server.Features.Game.Commands.AddMessageToRoom;
using online_chess.Server.Features.Lobby.Commands.AddToQueue;
using online_chess.Server.Features.Lobby.Commands.Connect;
using online_chess.Server.Features.Lobby.Commands.DeleteRoom;
using online_chess.Server.Features.Lobby.Queries.GetCreatedRoomKey;
using online_chess.Server.Features.Lobby.Commands.JoinRoom;
using online_chess.Server.Features.Game.Commands.LeaveRoom;
using online_chess.Server.Features.Lobby.Queries.GetRoomList;
using online_chess.Server.Features.Game.Commands.GameStart;
using online_chess.Server.Features.Game.Commands.MovePiece;
using online_chess.Server.Models.Play;

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
        public async Task AddToQueue(short gameType, short colorOption)
        {
            await _mediator.Send(new AddToQueueRequest()
            {
                GameType = (GameType)gameType,
                ColorOption = (Color)colorOption,
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
        public async Task GameStart(string gameRoomKey)
        {
            await _mediator.Send(new GameStartRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey
            });
        }

        public async Task AddMessageToRoom(string gameRoomKey, string message)
        {
            await _mediator.Send(new AddMessageToRoomRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                Message = message
            });
        }

        public async Task MovePiece(string gameRoomKey, BaseMoveInfo moveInfo)
        {
            await _mediator.Send(new MovePieceRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                MoveInfo = moveInfo
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
