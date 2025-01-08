using online_chess.Server.Models;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameRoomService
    {
        private static ConcurrentDictionary<Guid, GameQueue> _gameRoomIds = new ConcurrentDictionary<Guid, GameQueue>();

        public GameRoomService()
        {
            
        }

        public void Add(GameQueue gameQueue)
        {
            _gameRoomIds.TryAdd(Guid.NewGuid(), gameQueue);
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
    }
}
