using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class Piece
    {
        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
        public Pieces PieceType { get; set; }
    }
}
