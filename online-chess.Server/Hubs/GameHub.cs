
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
using online_chess.Server.Features.Game.Commands.Resign;
using online_chess.Server.Features.Game.Commands.RequestADraw;
using online_chess.Server.Features.Game.Commands.DrawAgree;
using online_chess.Server.Features.Game.Commands.SetPromotionPreference;
using online_chess.Server.Features.Auth.Commands.Register;
using online_chess.Server.Features.Auth.Commands.LogIn;
using online_chess.Server.Features.Auth.Queries.GetPlayerInfo;
using online_chess.Server.Features.Auth.Commands.LogOut;
using online_chess.Server.Features.Auth.Commands.Edit;
using online_chess.Server.Features.Auth.Queries.GetGameHistory;

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

        #region Auth
        
        [AllowAnonymous]
        public async Task Register(string userName, string password)
        {
            var response = await _mediator.Send(new RegisterRequest(){
                Username = userName
                , Password = password
            });
            await Clients.Caller.SendAsync(RoomMethods.onRegister, response);
        }

        [AllowAnonymous]
        public async Task Login(string userName, string password)
        {
            var response = await _mediator.Send(new LoginRequest(){
                Username = userName
                , Password = password
            });
            await Clients.Caller.SendAsync(RoomMethods.onLogin, response);
        }

        public async Task IsSignedIn()
        {
            var response = await _mediator.Send(new GetPlayerInfoRequest());
            await Clients.Caller.SendAsync(RoomMethods.onIsSignedIn, response);
        }

        public async Task Logout()
        {
            var response = await _mediator.Send(new LogoutRequest());
            await Clients.Caller.SendAsync(RoomMethods.onLogout, response);
        }

        public async Task EditAccount(string oldUsername, string newUsername, string oldPassword, string newPassword)
        {
            var response = await _mediator.Send(new EditRequest(){
                OldUsername = oldUsername
                ,OldPassword = oldPassword
                ,NewUsername = newUsername
                ,NewPassword = newPassword
            });
            await Clients.Caller.SendAsync(RoomMethods.onEditAccount, response);
        }
        
        public async Task GameHistory(int pageSize, int pageNo)
        {
            var response = await _mediator.Send(new GetGameHistoryRequest(){
                PageSize = pageSize
                , PageNumber = pageNo
            });
            await Clients.Caller.SendAsync(RoomMethods.onGetGameHistory, response);
        }

        #endregion

        #region LobbyPage
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
        #endregion

        #region PlayPage
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

        public async Task MovePiece(string gameRoomKey, BaseMoveInfo oldMove, BaseMoveInfo newMove, bool hasCapture)
        {
            await _mediator.Send(new MovePieceRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
                OldMove = oldMove,
                NewMove = newMove,
                HasCapture = hasCapture
            });
        }
        
        public async Task Resign(string gameRoomKey)
        {
            await _mediator.Send(new ResignRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
            });
        }

        public async Task RequestADraw(string gameRoomKey)
        {
            await _mediator.Send(new RequestADrawRequest()
            {
                UserConnectionId = Context.ConnectionId,
                IdentityUserName = Context.User?.Identity?.Name,
                GameRoomKeyString = gameRoomKey,
            });
        }

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

        #endregion

        #region Connection
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
        #endregion
    }
}
