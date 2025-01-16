using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class BaseMoveInfo
    {
        public int X { get; set; }
        public int Y { get; set; }
        public Pieces PieceName { get; set; }
        public string PieceUniqueName { get; set; }
    }
}
