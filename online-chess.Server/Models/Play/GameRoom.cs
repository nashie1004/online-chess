using online_chess.Server.Models.Lobby;

namespace online_chess.Server.Models
{
    // For Play Page
    // the actual chess game state
    public class GameRoom : GameQueue
    {
        public TimeSpan CreatedByUserTime { get; set; }
        public TimeSpan JoinByUserTime { get; set; }
        public bool CreatedByUsersTurn { get; set; }

    }
}
