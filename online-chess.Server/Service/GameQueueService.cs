using online_chess.Server.Models.Lobby;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameQueueService
    {
        private static ConcurrentDictionary<Guid, GameQueue> _gameRoomIds = new ConcurrentDictionary<Guid, GameQueue>();

        public GameQueueService()
        {
            
        }

        public void Add(Guid roomIdKey, GameQueue gameQueue)
        {
            _gameRoomIds.TryAdd(roomIdKey, gameQueue);
        }

        public GameQueue? Remove(Guid key)
        {
            _gameRoomIds.Remove(key, out GameQueue? value);
            return value;
        }

        public KeyValuePair<Guid, GameQueue>[] GetAll()
        {
            return _gameRoomIds.ToArray();
        }

        public GameQueue? GetOne(Guid key)
        {
            _gameRoomIds.TryGetValue(key, out GameQueue? value);
            return value;
        }
        
        public GameQueue? GetOne(string keyString)
        {
            if (!Guid.TryParse(keyString, out Guid key))
            {
                return null;
            }

            _gameRoomIds.TryGetValue(key, out GameQueue? value);
            return value;
        }

        public ConcurrentDictionary<Guid, GameQueue> GetDictionary()
        {
            return _gameRoomIds;
        }
        
        public ConcurrentDictionary<Guid, GameQueue> GetPaginatedDictionary(int pageNumber = 1, int pageSize = 10)
        {
            var paginatedDict =_gameRoomIds
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToDictionary(pair => pair.Key, pair => pair.Value)
            ;

            return new ConcurrentDictionary<Guid, GameQueue>(paginatedDict);
        }
    }
}
