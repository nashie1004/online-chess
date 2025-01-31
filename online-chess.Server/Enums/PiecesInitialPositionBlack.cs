using online_chess.Server.Models.Play;

namespace online_chess.Server.Enums
{
    // White's perspective
    public class PiecesInitialPositionBlack
    {
        public static readonly BaseMoveInfo bRook1 = new BaseMoveInfo()
        {
            X = 0, Y = 0, Name = Pieces.bRook, UniqueName = "bRook-0-0"
        };
        public static readonly BaseMoveInfo bKnight1 = new BaseMoveInfo()
        {
            X = 1, Y = 0, Name = Pieces.bKnight, UniqueName = "bKnight-1-0"
        };
        public static readonly BaseMoveInfo bBishop1 = new BaseMoveInfo()
        {
            X = 2, Y = 0, Name = Pieces.bBishop, UniqueName = "bBishop-2-0"
        };
        public static readonly BaseMoveInfo bQueen = new BaseMoveInfo()
        {
            X = 3, Y = 0, Name = Pieces.bQueen, UniqueName = "bQueen-3-0"
        };
        public static readonly BaseMoveInfo bKing = new BaseMoveInfo()
        {
            X = 4, Y = 0, Name = Pieces.bKing, UniqueName = "bKing-4-0"
        };
        public static readonly BaseMoveInfo bBishop2 = new BaseMoveInfo()
        {
            X = 5, Y = 0, Name = Pieces.bBishop, UniqueName = "bBishop-5-0"
        };
        public static readonly BaseMoveInfo bKnight2 = new BaseMoveInfo()
        {
            X = 6, Y = 0, Name = Pieces.bKnight, UniqueName = "bKnight-6-0"
        };
        public static readonly BaseMoveInfo bRook2 = new BaseMoveInfo()
        {
            X = 7, Y = 0, Name = Pieces.bRook, UniqueName = "bRook-7-0"
        };

        // Pawns

        public static readonly BaseMoveInfo bPawn1 = new BaseMoveInfo()
        {
            X = 0, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-0-1"
        };
        public static readonly BaseMoveInfo bPawn2 = new BaseMoveInfo()
        {
            X = 1, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-1-1"
        };
        public static readonly BaseMoveInfo bPawn3 = new BaseMoveInfo()
        {
            X = 2, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-2-1"
        };
        public static readonly BaseMoveInfo bPawn4 = new BaseMoveInfo()
        {
            X = 3, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-3-1"
        };
        public static readonly BaseMoveInfo bPawn5 = new BaseMoveInfo()
        {
            X = 4, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-4-1"
        };
        public static readonly BaseMoveInfo bPawn6 = new BaseMoveInfo()
        {
            X = 5, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-5-1"
        };
        public static readonly BaseMoveInfo bPawn7 = new BaseMoveInfo()
        {
            X = 6, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-6-1"
        };
        public static readonly BaseMoveInfo bPawn8 = new BaseMoveInfo()
        {
            X = 7, Y = 1, Name = Pieces.bPawn, UniqueName = "bPawn-7-1"
        };
    }
}
