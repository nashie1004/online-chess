using online_chess.Server.Models.Lobby;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace online_chess.Server.Service
{
    public class LogInTackerService
    {
        private static ConcurrentDictionary<string, DateTime> _authenticatedUsers = new();

        public LogInTackerService()
        {
            
        }

        public void Add(string identityUserName)
        {
            _authenticatedUsers.TryAdd(identityUserName, DateTime.Now);
        }

        public bool Remove(string identityUserName)
        {
            return _authenticatedUsers.TryRemove(identityUserName, out DateTime res);
        }

        public bool AlreadyExists(string identityUserName) 
        {
            var exists = _authenticatedUsers.TryGetValue(identityUserName, out DateTime signInTime);
            return exists;
        }

    }
}
