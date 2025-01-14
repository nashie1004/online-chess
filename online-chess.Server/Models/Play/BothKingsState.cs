namespace online_chess.Server.Models.Play
{
    public class BothKingsState
    {
        public bool WhiteKingInCheck { get; set; }
        public bool WhiteKingInCheckMate { get; set; }
        public bool WhiteKingInStaleMate { get; set; }

        public bool BlackKingInCheck { get; set; }
        public bool BlackKingInCheckMate { get; set; }
        public bool BlackKingInStaleMate { get; set; }
    }
}
