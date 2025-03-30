using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class TimerService
{
    private readonly ConcurrentDictionary<Guid, (double, double)> _timer = new();
    private readonly ILogger<TimerService> _logger;
    
    public TimerService(
        ILogger<TimerService> logger
    )
    {
        _logger = logger;
    }

    public void InitializeTimer(Guid gameRoomKey, (double, double) playerTimers)
    {
        _logger.LogInformation("New timer {key}", gameRoomKey);
        _timer.TryAdd(gameRoomKey, playerTimers);
    }

    public bool UpdateTimer(Guid gameRoomKey, (double, double) playerTimers){
        return _timer.TryUpdate(gameRoomKey, playerTimers, GetTimer(gameRoomKey));
    }
    
    public bool RemoveTimer(Guid gameRoomKey){
        _logger.LogInformation("Remove timer {key}", gameRoomKey);
        return _timer.TryRemove(gameRoomKey, out (double, double) _);
    }

    public (double, double) GetTimer(Guid gameRoomKey){
        _timer.TryGetValue(gameRoomKey, out (double, double) timer);
        return timer;
    } 
}
