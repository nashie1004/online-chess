using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Enums;
using online_chess.Server.Features.Game.Commands.AddMessageToRoom;
using online_chess.Server.Features.Lobby.Commands.AddToQueue;
using online_chess.Server.Features.Lobby.Commands.DeleteRoom;
using online_chess.Server.Features.Lobby.Queries.GetCreatedRoomKey;
using online_chess.Server.Features.Lobby.Commands.JoinRoom;
using online_chess.Server.Features.Lobby.Queries.GetRoomList;
using online_chess.Server.Features.Game.Commands.GameStart;
using online_chess.Server.Features.Game.Commands.MovePiece;
using online_chess.Server.Models.Play;
using online_chess.Server.Features.Game.Commands.Resign;
using online_chess.Server.Features.Game.Commands.RequestADraw;
using online_chess.Server.Features.Game.Commands.DrawAgree;
using online_chess.Server.Features.Game.Commands.SetPromotionPreference;
using online_chess.Server.Features.Auth.Queries.GetGameHistory;
using online_chess.Server.Features.Leaderboard.Queries.GetDefaultLeaderboard;
using online_chess.Server.Features.Leaderboard.Queries.GetGameTypeList;
using online_chess.Server.Features.Game.Queries.HasAGameInProgress;
using online_chess.Server.Features.Game.Commands.Checkmate;
using online_chess.Server.Features.Game.Commands.Stalemate;
using online_chess.Server.Features.Game.Commands.UserDisconnectedFromGame;
using online_chess.Server.Features.Others.Commands.Connect;
using online_chess.Server.Features.Others.Commands.Disconnect;

namespace online_chess.Server.Hubs
{
    public class GameHub : Hub
    {
        private readonly IMediator _mediator;

        public GameHub(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        #region Lists
        [Authorize]
        public async Task GameHistory(int pageSize, int pageNo)
        {
            var response = await _mediator.Send(new GetGameHistoryRequest(){
                PageSize = pageSize
                , PageNumber = pageNo
            });
            await Clients.Caller.SendAsync(RoomMethods.onGetGameHistory, response);
        }

        [AllowAnonymous]
        public async Task Leaderboard(int pageSize, int pageNo)
        {
            var response = await _mediator.Send(new GetDefaultLeaderboardRequest(){
                PageSize = pageSize
                , PageNumber = pageNo
            });
            await Clients.Caller.SendAsync(RoomMethods.onGetLeaderboard, response);
        }

        [AllowAnonymous]
        public async Task GameTypeList(int pageSize, int pageNo, GameType gameType)
        {
            var response = await _mediator.Send(new GetGameTypeListRequest(){
                PageSize = pageSize
                , PageNumber = pageNo
                , GameType = gameType
            });
            await Clients.Caller.SendAsync(RoomMethods.onGetGameTypeList + "_" + gameType.ToString(), response);
        }

        #endregion

        #region LobbyPage
        [Authorize]
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

        [Authorize]
        public async Task GetRoomList(int pageNumber)
        {
            await _mediator.Send(new GetRoomListRequest()
            {
                UserConnectionId = Context.ConnectionId,
                PageNumber = pageNumber,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        [Authorize]
        public async Task JoinRoom(string gameRoomKey)
        {
            await _mediator.Send(new JoinRoomRequest()
            {
                GameRoomKeyString = gameRoomKey,
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        [Authorize]
        public async Task DeleteRoom(string gameRoomKey)
        {
            await _mediator.Send(new DeleteRoomRequest()
            {
                GameRoomKeyString = gameRoomKey,
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }
        
        [Authorize]
        public async Task GetCreatedRoomKey()
        {
            await _mediator.Send(new GetCreatedRoomKeyRequest()
            {   
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }
        #endregion

        #region PlayPage
        [Authorize]
        public async Task GameStart(string gameRoomKey, bool reconnect)
        {
            await _mediator.Send(new GameStartRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                Reconnect = reconnect
            });
        }

        [Authorize]
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

        [Authorize]
        // TODO 3/1/2025
        public async Task MovePiece(
            string gameRoomKey, BaseMoveInfo oldMove, BaseMoveInfo newMove
            , Capture capture, Castle castle
        )
        {
            await _mediator.Send(new MovePieceRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                
                OldMove = oldMove,
                NewMove = newMove,
                Capture = capture,
                Castle = castle
            });
        }
        
        [Authorize]
        public async Task Resign(string gameRoomKey)
        {
            await _mediator.Send(new ResignRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
            });
        }

        [Authorize]
        public async Task RequestADraw(string gameRoomKey)
        {
            await _mediator.Send(new RequestADrawRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
            });
        }

        [Authorize]
        public async Task DrawAgree(string gameRoomKey, bool agreeOnDraw)
        {
            await _mediator.Send(new DrawAgreeRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                AgreeOnDraw = agreeOnDraw
            });
        }

        [Authorize]
        public async Task SetPromotionPreference(string gameRoomKey, PawnPromotionPreference preference)
        {
            await _mediator.Send(new SetPromotionPreferenceRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                UserPreference = preference
            });
        }

        [Authorize]
        public async Task GetHasAGameInProgress()
        {
            await _mediator.Send(new HasAGameInProgressRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
            });
        }

        /*
        TODO AS OF 2/24/2025 8:04PM
        - Checkmate and Stalemate
        */
        [Authorize]
        public async Task Checkmate()
        {
            await _mediator.Send(new CheckmateRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
            });
        }

        [Authorize]
        public async Task Stalemate()
        {
            await _mediator.Send(new StalemateRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
            });
        }

        [Authorize]
        public async Task UserDisconnectedFromGame()
        {
            await _mediator.Send(new UserDisconnectedFromGameRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
            });
        }

        #endregion

        #region Connection
        [AllowAnonymous]
        public async Task GetConnectionId(){
            await Clients.Caller.SendAsync(RoomMethods.onGetUserConnectionId, Context.ConnectionId);
        }

        [AllowAnonymous]
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            await _mediator.Send(new ConnectRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });
        }

        [AllowAnonymous]
        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            await _mediator.Send(new DisconnectRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name
            });

            await base.OnDisconnectedAsync(ex);
        }
        #endregion
    }
}
