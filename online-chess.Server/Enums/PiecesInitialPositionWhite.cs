using online_chess.Server.Models.Play;

namespace online_chess.Server.Enums
{
    public class PiecesInitialPositionWhite
    {
        public readonly BaseMoveInfo wRook1 = new BaseMoveInfo()
        {
            X = 0, Y = 7, Name = Pieces.wRook, UniqueName = "wRook-0-7"
        };
        public readonly BaseMoveInfo wKnight1 = new BaseMoveInfo()
        {
            X = 1, Y = 7, Name = Pieces.wKnight, UniqueName = "wKnight-1-7"
        };
        public readonly BaseMoveInfo wBishop1 = new BaseMoveInfo()
        {
            X = 2, Y = 7, Name = Pieces.wBishop, UniqueName = "wBishop-2-7"
        };
        public readonly BaseMoveInfo wQueen = new BaseMoveInfo()
        {
            X = 3, Y = 7, Name = Pieces.wQueen, UniqueName = "wQueen-3-7"
        };
        public readonly BaseMoveInfo wKing = new BaseMoveInfo()
        {
            X = 4, Y = 7, Name = Pieces.wKing, UniqueName = "wKing-4-7"
        };
        public readonly BaseMoveInfo wBishop2 = new BaseMoveInfo()
        {
            X = 5, Y = 7, Name = Pieces.wBishop, UniqueName = "wBishop-5-7"
        };
        public readonly BaseMoveInfo wKnight2 = new BaseMoveInfo()
        {
            X = 6, Y = 7, Name = Pieces.wKnight, UniqueName = "wKnight-6-7"
        };
        public readonly BaseMoveInfo wRook2 = new BaseMoveInfo()
        {
            X = 7, Y = 7, Name = Pieces.wRook, UniqueName = "wRook-7-7"
        };

        // pawns
        public readonly BaseMoveInfo wPawn1 = new BaseMoveInfo()
        {
            X = 0, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-0-6"
        };
        public readonly BaseMoveInfo wPawn2 = new BaseMoveInfo()
        {
            X = 1, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-1-6"
        };
        public readonly BaseMoveInfo wPawn3 = new BaseMoveInfo()
        {
            X = 2, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-2-6"
        };
        public readonly BaseMoveInfo wPawn4 = new BaseMoveInfo()
        {
            X = 3, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-3-6"
        };
        public readonly BaseMoveInfo wPawn5 = new BaseMoveInfo()
        {
            X = 4, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-4-6"
        };
        public readonly BaseMoveInfo wPawn6 = new BaseMoveInfo()
        {
            X = 5, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-5-6"
        };
        public readonly BaseMoveInfo wPawn7 = new BaseMoveInfo()
        {
            X = 6, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-6-6"
        };
        public readonly BaseMoveInfo wPawn8 = new BaseMoveInfo()
        {
            X = 7, Y = 6, Name = Pieces.wPawn, UniqueName = "wPawn-7-6"
        };
    }
}
