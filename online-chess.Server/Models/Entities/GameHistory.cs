using online_chess.Server.Constants;
using online_chess.Server.Enums;

namespace online_chess.Server.Models.Entities
{
    public class GameHistory
    {
        public long GameHistoryId { get; set; }
        public DateTimeOffset GameStartDate { get; set; }
        public DateTimeOffset GameEndDate { get; set; }

        public long PlayerOneId { get; set; }
        public Color PlayerOneColor { get; set; }
        public long PlayerTwoId { get; set; }
        public Color PlayerTwoColor { get; set; }

        public long WinnerPlayerId { get; set; }
        public bool IsDraw { get; set; }
        public GameType GameType { get; set; }
        public string Remarks { get; set; }
    }
}
