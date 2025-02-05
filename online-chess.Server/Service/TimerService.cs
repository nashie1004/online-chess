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

    public void UpdateTimer(Guid gameRoomKey, (double, double) playerTimers){
        _timer.TryUpdate(gameRoomKey, playerTimers, _timer[gameRoomKey]);
    }
    
    public void RemoveTimer(Guid gameRoomKey){
        _timer.Remove(gameRoomKey, out (double, double) _);
    }

    public (double, double) GetTimer(Guid gameRoomKey){
        _timer.TryGetValue(gameRoomKey, out (double, double) timer);
        return timer;
    } 
}
