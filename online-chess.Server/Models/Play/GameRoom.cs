using online_chess.Server.Models.Lobby;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Models
{
    /*
     * For Page Page
     * - the server will handle these states for the game and chessboard 
     */
    public class GameRoom : GameQueue
    {
        public TimeSpan CreatedByUserTime { get; set; }
        public TimeSpan JoinByUserTime { get; set; }
        public bool CreatedByUsersTurn { get; set; }
        public List<string> MoveHistory { get; set; }
        public List<string> CaptureHistory { get; set; }
        public BothKingsState BothKingsState { get; set; }
        public List<string> ChatMessages { get; set; }
    }
}
