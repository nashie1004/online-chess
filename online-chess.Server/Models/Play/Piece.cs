using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class Piece : BaseCoordinates
    {
        public Pieces PieceType { get; set; }
    }
}
