using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Constants;
using online_chess.Server.Enums;
using online_chess.Server.Features.Game.Commands.GameStart;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Play;
using online_chess.Server.Persistence;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameRoomService
    {
        private static ConcurrentDictionary<Guid, GameRoom> _gameRoomIds = new();
        private readonly TimerService _timerService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly UserConnectionService _userConnectionService;
        private readonly ILogger<GameRoomService> _logger;

        public GameRoomService(
            TimerService timerService
            , IHubContext<GameHub> hubContext
            , UserConnectionService userConnectionService
            , ILogger<GameRoomService> logger
            )
        {
            _timerService = timerService;
            _hubContext = hubContext;
            _userConnectionService = userConnectionService;
            _logger = logger;
        }

        public void Add(Guid roomIdKey, GameRoom GameRoom)
        {
            _gameRoomIds.TryAdd(roomIdKey, GameRoom);
        }

        public GameRoom? Remove(Guid key)
        {
            _gameRoomIds.TryRemove(key, out GameRoom? value);
            return value;
        }

        public KeyValuePair<Guid, GameRoom>[] GetAll()
        {
            return _gameRoomIds.ToArray();
        }

        public GameRoom? GetOne(Guid key)
        {
            _gameRoomIds.TryGetValue(key, out GameRoom? value);
            return value;
        }
        
        public GameRoom? GetOne(string keyString)
        {
            if (!Guid.TryParse(keyString, out Guid key))
            {
                return null;
            }

            _gameRoomIds.TryGetValue(key, out GameRoom? value);
            return value;
        }

        public ConcurrentDictionary<Guid, GameRoom> GetDictionary()
        {
            return _gameRoomIds;
        }

        public ConcurrentDictionary<Guid, GameRoom> GetPaginatedDictionary(int pageNumber = 1, int pageSize = 10)
        {
            var paginatedDict = _gameRoomIds
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToDictionary(pair => pair.Key, pair => pair.Value)
            ;

            return new ConcurrentDictionary<Guid, GameRoom>(paginatedDict);
        }

        public GameRoom? GetRoomByEitherPlayer(string playerIdentityName)
        {
            var room = _gameRoomIds.FirstOrDefault(i => i.Value.CreatedByUserInfo.UserName == playerIdentityName || i.Value.JoinByUserInfo.UserName == playerIdentityName);

            if (room.Value != null){
                return room.Value;
            }

            return null;
        }

        public CurrentGameInfo StartNewGame(GameRoom gameRoom, GameStartRequest request)
        {
            if (
                gameRoom.GameStartedAt != DateTimeOffset.MinValue && 
                (gameRoom.GamePlayStatus == GamePlayStatus.CreatorDisconnected || gameRoom.GamePlayStatus == GamePlayStatus.JoinerDisconnected)
            )
            {
                return ReconnectToGame(gameRoom, request); // initialize game only once
            }

            _logger.LogInformation("Starting New Game, key: {key}, {creator} vs {joiner}"
                , gameRoom.GameKey, gameRoom.CreatedByUserInfo.UserName, gameRoom.JoinByUserInfo.UserName);

            TimeSpan initialTime;

            switch (gameRoom.GameType)
            {
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

            gameRoom.GameStartedAt = DateTimeOffset.UtcNow;
            gameRoom.GamePlayStatus = GamePlayStatus.Ongoing;
            gameRoom.ChatMessages = new List<Chat>()
            {
                new Chat()
                {
                    CreateDate = DateTimeOffset.UtcNow
                    , CreatedByUser = "server"
                    , Message = $"{gameRoom.CreatedByUserInfo.UserName} has joined the game."
                }
                ,new Chat()
                {
                    CreateDate = DateTimeOffset.UtcNow
                    , CreatedByUser = "server"
                    , Message = $"{gameRoom.JoinByUserInfo.UserName} has joined the game."
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

        public CurrentGameInfo ReconnectToGame(GameRoom onGoingGameRoom, GameStartRequest request)
        {
            _logger.LogInformation("Reconnect Game, key: {key}, {creator} vs {joiner}"
                , onGoingGameRoom.GameKey, onGoingGameRoom.CreatedByUserInfo.UserName, onGoingGameRoom.JoinByUserInfo.UserName);

            onGoingGameRoom.GamePlayStatus = GamePlayStatus.Ongoing;

            onGoingGameRoom.ChatMessages.Add(new Chat()
            {
                CreateDate = DateTimeOffset.UtcNow
                ,CreatedByUser = "server"
                ,Message = $"{request.IdentityUserName} reconnected."
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

        public async Task EndGame(IServiceScope scope, GameRoom room, EndGameStatus finalGameStatus)
        {
            var identityDbContext = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var mainDbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            // var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<GameHub>>();

            var creator = await identityDbContext.FindByNameAsync(room.CreatedByUserInfo.UserName);
            var joiner = await identityDbContext.FindByNameAsync(room.JoinByUserInfo.UserName);

            if (creator == null || joiner == null) return;

            _logger.LogInformation("End Game, key: {key}, {creator} vs {joiner}"
                , room.GameKey, room.CreatedByUserInfo.UserName, room.JoinByUserInfo.UserName);


            long winnerPlayerId = 0;
            string finalMessage = string.Empty;
            bool isDraw = false;

            switch(finalGameStatus)
            {
                case EndGameStatus.CreatorIsCheckmated:
                    finalMessage = $"{joiner.UserName} won by checkmating {creator.UserName}.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.CreatorResigned:
                    finalMessage = $"{joiner.UserName} won. {creator.UserName} resigned.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.CreatorTimeIsUp:
                    finalMessage = $"{joiner.UserName} won. {creator.UserName} ran out of time.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerIsCheckmated:
                    finalMessage = $"{creator.UserName} won by checkmating {joiner.UserName}.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerResigned:
                    finalMessage = $"{creator.UserName} won. {joiner.UserName} resigned.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerTimeIsUp:
                    finalMessage = $"{creator.UserName} won. {joiner.UserName} ran out of time.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.DrawByAgreement:
                    finalMessage = "Draw by agreement.";
                    isDraw = true;
                    break;
                case EndGameStatus.DrawByStalemate:
                    finalMessage = "Draw by stalemate";
                    isDraw = true;
                    break;
                case EndGameStatus.DrawBothPlayerDisconnected:
                    finalMessage = "Draw by both player being disconnected.";
                isDraw = true;
                    break;
                case EndGameStatus.DrawBy50MoveRule:
                    finalMessage = "Draw by 50 move rule.";
                    isDraw = true;
                    break;
                case EndGameStatus.DrawByThreeFoldRepetition:
                    finalMessage = "Draw by threefold repetition.";
                    isDraw = true;
                    break;
                default:
                    break;
            }

            await mainDbContext.GameHistories.AddAsync(new GameHistory(){
                GameStartDate = room.GameStartedAt
                , GameEndDate = DateTimeOffset.UtcNow

                , PlayerOneId = creator.Id
                , PlayerOneColor = room.CreatedByUserInfo.Color
                , PlayerTwoId = joiner.Id
                , PlayerTwoColor = room.CreatedByUserInfo.Color == Color.White ? Color.Black : Color.White
                    
                , WinnerPlayerId = winnerPlayerId
                , IsDraw = isDraw
                , GameType = room.GameType
                , Remarks = finalMessage
            });

            // simple ELO Rating
            if (!isDraw){
                creator.Elo = winnerPlayerId == creator.Id ? creator.Elo + 1 : creator.Elo - 1;
                joiner.Elo = winnerPlayerId == joiner.Id ? joiner.Elo + 1 : joiner.Elo - 1;

                await identityDbContext.UpdateAsync(creator);
                await identityDbContext.UpdateAsync(joiner);
            }

            await mainDbContext.SaveChangesAsync();

            room.ChatMessages.Add(new Chat(){
                CreateDate = DateTimeOffset.UtcNow,
                CreatedByUser = "server",
                Message = finalMessage
            });

            await _hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onReceiveMessages, room.ChatMessages);
            
            await _hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onGameOver, new
            {
                finalMessage
                ,finalGameStatus
                ,creatorIdentityName = creator.UserName
            });

            room.TimerId?.Dispose();

            // if one or both player disconnected and they have a resume game notification
            // remove that
            string? creatorConnectionId = _userConnectionService.GetConnectionId(creator.UserName ?? string.Empty);
            string? joinerConnectionId = _userConnectionService.GetConnectionId(joiner.UserName ?? string.Empty);

            await _hubContext.Clients.Client(creatorConnectionId ?? "").SendAsync(RoomMethods.onHasAGameInProgress, null);
            await _hubContext.Clients.Client(joinerConnectionId ?? "").SendAsync(RoomMethods.onHasAGameInProgress, null);

            Remove(room.GameKey);
            _timerService.RemoveTimer(room.GameKey);
        }

    }
}
