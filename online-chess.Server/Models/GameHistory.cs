using online_chess.Server.Common;

namespace online_chess.Server.Models
{
    public class GameHistory
    {
        public long GameHistoryId { get; set; }
        public DateTime CreateDate { get; set; }
        public long PlayerOneUserId { get; set; }
        public Color PlayerOneColor { get; set; }
        public long PlayerTwoUserId { get; set; }
        public Color PlayerTwoColor { get; set; }
        public long WinnerUserId { get; set; }
    }
}
