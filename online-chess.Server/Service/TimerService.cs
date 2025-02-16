using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class TimerService
{
    private readonly ConcurrentDictionary<Guid, (double, double)> _timer = new();

    public void InitializeTimer(Guid gameRoomKey, (double, double) playerTimers)
    {
        _timer.TryAdd(gameRoomKey, playerTimers);
    }

    public bool UpdateTimer(Guid gameRoomKey, (double, double) playerTimers){
        return _timer.TryUpdate(gameRoomKey, playerTimers, GetTimer(gameRoomKey));
    }
    
    public bool RemoveTimer(Guid gameRoomKey){
        return _timer.TryRemove(gameRoomKey, out (double, double) _);
    }

    public (double, double) GetTimer(Guid gameRoomKey){
        _timer.TryGetValue(gameRoomKey, out (double, double) timer);
        return timer;
    } 
}
