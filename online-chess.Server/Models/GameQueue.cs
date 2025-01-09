using online_chess.Server.Constants;
using System.Reflection.Metadata.Ecma335;

namespace online_chess.Server.Models
{
    public class GameQueue
    {
        public string CreatedByUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public GameType GameType { get; set; }
        public string JoinedByUserId { get; set; }
    }
}
