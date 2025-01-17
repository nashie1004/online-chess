using online_chess.Server.Models;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameRoomService
    {
        private static ConcurrentDictionary<Guid, GameRoom> _gameRoomIds = new ConcurrentDictionary<Guid, GameRoom>();

        public GameRoomService()
        {

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
    }
}
