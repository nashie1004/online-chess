using online_chess.Server.Constants;
using online_chess.Server.Enums;
using System.Reflection.Metadata.Ecma335;

namespace online_chess.Server.Models
{
    public class GameQueue
    {
        public string CreatedByUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public GameType GameType { get; set; }
        public Color CreatedByUserColor { get; set; }
        public string JoinedByUserId { get; set; }
    }
}
