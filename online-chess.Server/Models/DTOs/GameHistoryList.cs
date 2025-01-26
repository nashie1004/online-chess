using System.ComponentModel.DataAnnotations.Schema;
using online_chess.Server.Constants;
using online_chess.Server.Enums;

namespace online_chess.Server.Models.DTOs
{
    [NotMapped]
    public class GameHistoryList
    {
        public int IndexNo { get; set; }
        public GameHistoryStatus GameStatus { get; set; }
        public bool IsColorWhite { get; set; }
        public GameType GameType { get; set; }
        public string OpponentName { get; set; }
        public DateTime GameDate { get; set; }
    }
}
