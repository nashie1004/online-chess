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
        public string?[][] Board { get; set; }
        public DateTime GameStartedAt { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
        public List<MoveHistory> MoveHistory { get; set; }
        public List<CaptureHistory> CaptureHistory { get; set; }
        public List<Play.Chat> ChatMessages { get; set; }
    }
}
