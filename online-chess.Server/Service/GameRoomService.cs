using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameRoomService
    {
        private static ConcurrentDictionary<Guid, GameRoom> _gameRoomIds = new();
        private readonly TimerService _timerService;

        public GameRoomService(TimerService timerService)
        {
            _timerService = timerService;
        }

        public void Add(Guid roomIdKey, GameRoom GameRoom)
        {
            _gameRoomIds.TryAdd(roomIdKey, GameRoom);
        }

        public GameRoom? Remove(Guid key)
        {
            _gameRoomIds.Remove(key, out GameRoom? value);
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
            var room = _gameRoomIds.FirstOrDefault(i => i.Value.CreatedByUserId == playerIdentityName || i.Value.JoinedByUserId == playerIdentityName);

            if (room.Value != null){
                return room.Value;
            }

            return null;
        }

        public async Task EndGame(IServiceScope scope, GameRoom room, EndGameStatus finalGameStatus)
        {
            var identityDbContext = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var mainDbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<GameHub>>();

            var creator = await identityDbContext.FindByNameAsync(room.CreatedByUserId);
            var joiner = await identityDbContext.FindByNameAsync(room.JoinedByUserId);

            if (creator == null || joiner == null) return;

            long winnerPlayerId = 0;
            string finalMessage = string.Empty;
            bool isDraw = false;

            switch(finalGameStatus)
            {
                case EndGameStatus.CreatorIsCheckmated:
                    finalMessage = $"{joiner.UserName} won by checkmate.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.CreatorResigned:
                    finalMessage = $"{creator.UserName} resigned the game.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.CreatorTimeIsUp:
                    finalMessage = $"{creator.UserName} ran out of time.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerIsCheckmated:
                    finalMessage = $"{creator.UserName} won by checkmate.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerResigned:
                    finalMessage = $"{joiner.UserName} resigned the game.";
                    winnerPlayerId = joiner.Id;
                    break;
                case EndGameStatus.JoinerTimeIsUp:
                    finalMessage = $"{joiner.UserName} ran out of time.";
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
                , GameEndDate = DateTime.Now

                , PlayerOneId = creator.Id
                , PlayerOneColor = room.CreatedByUserColor
                , PlayerTwoId = joiner.Id
                , PlayerTwoColor = room.CreatedByUserColor == Color.White ? Color.Black : Color.White
                    
                , WinnerPlayerId = winnerPlayerId
                , IsDraw = isDraw
                , GameType = room.GameType
                , Remarks = finalMessage
            });

            await mainDbContext.SaveChangesAsync();

            room.ChatMessages.Add(new Models.Play.Chat(){
                CreateDate = DateTime.Now,
                CreatedByUser = "server",
                Message = finalMessage
            });

            await hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onReceiveMessages, room.ChatMessages);
                
            await hubContext.Clients.Group(room.GameKey.ToString()).SendAsync(RoomMethods.onGameOver, finalGameStatus);

            if (room.TimerId != null){
                room.TimerId.Dispose();
            }

            this.Remove(room.GameKey);
            _timerService.RemoveTimer(room.GameKey);
        }

    }
}
