using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Hubs;
using online_chess.Server.Service;
using online_chess.Server.Enums;
using online_chess.Server.Models.Play;
using online_chess.Server.Constants;
using online_chess.Server.Models;

namespace online_chess.Server.Features.Game.Commands.GameStart
{
    public class GameStartHandler : IRequestHandler<GameStartRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly UserConnectionService _authenticatedUserService;
        private readonly TimerService _timerService;
        private readonly ILogger<GameStartHandler> _logger;

        public GameStartHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
            , UserConnectionService authenticatedUserService
            , TimerService timerService
            , ILogger<GameStartHandler> logger
            )
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
            _authenticatedUserService = authenticatedUserService;
            _timerService = timerService;
            _logger = logger;
        }

        public async Task<Unit> Handle(GameStartRequest request, CancellationToken cancellationToken)
        {
            var gameRoom = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (gameRoom == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            if (request.IdentityUserName != gameRoom.CreatedByUserId && request.IdentityUserName != gameRoom.JoinedByUserId)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            var player1 = _authenticatedUserService.GetConnectionId(gameRoom.CreatedByUserId);
            var player2 = _authenticatedUserService.GetConnectionId(gameRoom.JoinedByUserId);

            if (string.IsNullOrEmpty(player1) || string.IsNullOrEmpty(player2))
            {
                return Unit.Value;
            }

            /* New Game */
            if (!request.Reconnect)
            {
                var baseGameInfo = StartNewGame(gameRoom, request, player1, player2);

                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onInitializeGameInfo, baseGameInfo);
            } 
            /* Player Reconnects */
            else
            {
                var currentGameInfo = ReconnectToGame(gameRoom, request, player1, player2);

                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onInitializeGameInfo, currentGameInfo);
            }

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, gameRoom.ChatMessages);

            return Unit.Value;
        }
    
        public CurrentGameInfo StartNewGame(GameRoom gameRoom, GameStartRequest request, string player1Connection, string player2Connection)
        {
            TimeSpan initialTime; 

            switch(gameRoom.GameType){
                case GameType.Classical:
                    initialTime = TimeSpan.FromMinutes(60);
                    break;
                case GameType.Blitz3Mins:
                    initialTime = TimeSpan.FromMinutes(3);
                    break;
                case GameType.Blitz5Mins:
                    initialTime = TimeSpan.FromMinutes(5);
                    break;
                case GameType.Rapid10Mins:
                    initialTime = TimeSpan.FromMinutes(10);
                    break;
                case GameType.Rapid25Mins:
                    initialTime = TimeSpan.FromMinutes(25);
                    break;
                default:
                    initialTime = TimeSpan.FromMinutes(60);
                    break;
            }

            _timerService.InitializeTimer(gameRoom.GameKey, 
                (initialTime.TotalSeconds, initialTime.TotalSeconds)
            );

            gameRoom.GameStartedAt = DateTime.Now;
            gameRoom.GamePlayStatus = GamePlayStatus.Ongoing;
            gameRoom.CreatedByUserInfo = new PlayerInfo(){
                UserName = gameRoom.CreatedByUserId
                , IsPlayersTurnToMove = gameRoom.CreatedByUserColor == Color.White
                , IsColorWhite = gameRoom.CreatedByUserColor == Color.White
            };
            gameRoom.JoinByUserInfo = new PlayerInfo(){
                UserName = gameRoom.JoinedByUserId
                , IsPlayersTurnToMove = gameRoom.CreatedByUserColor != Color.White
                , IsColorWhite = gameRoom.CreatedByUserColor != Color.White
            };
            gameRoom.ChatMessages = new List<Chat>()
            {
                new Chat()
                {
                    CreateDate = DateTime.Now
                    , CreatedByUser = gameRoom.CreatedByUserId
                    , Message = $"{gameRoom.CreatedByUserId} has joined the game."
                }
                ,new Chat()
                {
                    CreateDate = DateTime.Now
                    , CreatedByUser = gameRoom.JoinedByUserId
                    , Message = $"{gameRoom.JoinedByUserId} has joined the game."
                }
            };

            var baseGameInfo = new CurrentGameInfo()
            {
                GameRoomKey = gameRoom.GameKey,
                MoveCountSinceLastCapture = 0,
                CreatedByUserInfo = gameRoom.CreatedByUserInfo,
                JoinedByUserInfo = gameRoom.JoinByUserInfo,
                GameType = gameRoom.GameType,
                PiecesCoordinatesInitial = gameRoom.PiecesCoords,
                BothKingsState = gameRoom.BothKingsState,
                Reconnect = request.Reconnect,
                WhiteKingHasMoved = false,
                BlackKingHasMoved = false,
                MoveHistory = gameRoom.MoveHistory,
                CaptureHistory = gameRoom.CaptureHistory
            };

            return baseGameInfo;
        }

        public CurrentGameInfo ReconnectToGame(GameRoom onGoingGameRoom, GameStartRequest request, string player1Connection, string player2Connection)
        {
            onGoingGameRoom.GamePlayStatus = GamePlayStatus.Ongoing;

            onGoingGameRoom.ChatMessages.Add(new Chat() {
                CreateDate = DateTime.Now
                , CreatedByUser = "server"
                , Message = $"{request.IdentityUserName} reconnected."
            });

            var initialWhite = new PiecesInitialPositionWhite();
            var initialBlack = new PiecesInitialPositionBlack();

            bool whiteKingHasMoved = (
                onGoingGameRoom.BothKingsState.White.X != initialWhite.wKing.X ||
                onGoingGameRoom.BothKingsState.White.Y != initialWhite.wKing.Y
            );

            bool blackKingHasMoved = (
                onGoingGameRoom.BothKingsState.Black.X != initialBlack.bKing.X ||
                onGoingGameRoom.BothKingsState.Black.Y != initialBlack.bKing.Y
            );

            var currentGameInfo = new CurrentGameInfo()
            {
                GameRoomKey = onGoingGameRoom.GameKey,
                MoveCountSinceLastCapture = onGoingGameRoom.MoveCountSinceLastCapture,
                CreatedByUserInfo = onGoingGameRoom.CreatedByUserInfo,
                JoinedByUserInfo = onGoingGameRoom.JoinByUserInfo,
                GameType = onGoingGameRoom.GameType,
                PiecesCoordinatesInitial = onGoingGameRoom.PiecesCoords,
                BothKingsState = onGoingGameRoom.BothKingsState,
                Reconnect = request.Reconnect,
                WhiteKingHasMoved = whiteKingHasMoved,
                BlackKingHasMoved = blackKingHasMoved,
                MoveHistory = onGoingGameRoom.MoveHistory,
                CaptureHistory = onGoingGameRoom.CaptureHistory
            };

            return currentGameInfo;
        }
    }
}
