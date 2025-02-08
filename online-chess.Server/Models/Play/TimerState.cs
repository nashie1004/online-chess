using System;

namespace online_chess.Server.Models.Play;

public class TimerState
{
    public bool CreatorsTurn { get; set; }
    public GameRoom GameRoom { get; set; }
    public IServiceScope? ServiceScope { get; set; }
}
