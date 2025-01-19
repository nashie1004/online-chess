using online_chess.Server.Constants;
using online_chess.Server.Enums;
using System.Reflection.Metadata.Ecma335;

namespace online_chess.Server.Models.Lobby
{
    // For Lobby Page
    public class GameQueue
    {
        public Guid GameKey { get; set; }
        public string CreatedByUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public GameType GameType { get; set; }
        public Color CreatedByUserColor { get; set; }
        public string JoinedByUserId { get; set; }
        public GamePlayStatus GamePlayStatus { get; set; }
    }
}
