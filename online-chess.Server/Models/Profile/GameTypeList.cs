using System.ComponentModel.DataAnnotations.Schema;

namespace online_chess.Server.Models.Profile
{
    [NotMapped]
    public class GameTypeList
    {
        public int Rank { get; set; }
        public string Username { get; set; }
        public int Wins { get; set; }
        public int Loses { get; set; }
        public int Draws { get; set; }
        public DateTime LastGameDate { get; set; }
    }
}
