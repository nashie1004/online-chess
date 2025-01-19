using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class BaseMoveInfo
    {
        public int X { get; set; }
        public int Y { get; set; }
        public Pieces Name { get; set; }
        public string UniqueName { get; set; }
    }
}
