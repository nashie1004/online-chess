using online_chess.Server.Constants;

namespace online_chess.Server.Models
{
    public class GameQueue
    {
        public long CreatedByUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public GameType GameType { get; set; }
    }
}
