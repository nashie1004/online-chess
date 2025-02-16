using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class LogInTrackerService
    {
        private static ConcurrentDictionary<string, DateTime> _authenticatedUsers = new();

        public LogInTrackerService()
        {
            
        }

        public bool Add(string identityUserName)
        {
            return _authenticatedUsers.TryAdd(identityUserName, DateTime.Now);
        }

        public bool Remove(string identityUserName)
        {
            return _authenticatedUsers.TryRemove(identityUserName, out DateTime res);
        }

        public bool AlreadyExists(string identityUserName) 
        {
            return _authenticatedUsers.TryGetValue(identityUserName, out DateTime signInTime);
        }

    }
}
