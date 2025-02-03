using online_chess.Server.Enums;
using online_chess.Server.Models.Lobby;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Models
{
    /*
     * For Page Page
     * - the server will handle these states for the game and chessboard 
     */
    public class GameRoom : GameQueue
    {
        public DateTime GameStartedAt { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
        public List<Play.Chat> ChatMessages { get; set; }

        public List<BaseMoveInfo> PiecesCoords { get; set; }
        public (BaseMoveInfo, BaseMoveInfo) BothKingCoords { get; set; }
        public MoveHistory MoveHistory { get; set; }
        public List<BaseMoveInfo> CaptureHistory { get; set; }
       

        public GameRoom()
        {
            PiecesCoords = new List<BaseMoveInfo>()
            {
                PiecesInitialPositionBlack.bRook1, PiecesInitialPositionBlack.bKnight1
                ,PiecesInitialPositionBlack.bBishop1, PiecesInitialPositionBlack.bQueen
                ,PiecesInitialPositionBlack.bKing, PiecesInitialPositionBlack.bBishop2
                ,PiecesInitialPositionBlack.bKnight2, PiecesInitialPositionBlack.bRook2
                ,PiecesInitialPositionBlack.bPawn1, PiecesInitialPositionBlack.bPawn2
                ,PiecesInitialPositionBlack.bPawn3, PiecesInitialPositionBlack.bPawn4
                ,PiecesInitialPositionBlack.bPawn5, PiecesInitialPositionBlack.bPawn6
                ,PiecesInitialPositionBlack.bPawn7, PiecesInitialPositionBlack.bPawn8

                ,PiecesInitialPositionWhite.wRook1, PiecesInitialPositionWhite.wKnight1
                ,PiecesInitialPositionWhite.wBishop1, PiecesInitialPositionWhite.wQueen
                ,PiecesInitialPositionWhite.wKing, PiecesInitialPositionWhite.wBishop2
                ,PiecesInitialPositionWhite.wKnight2, PiecesInitialPositionWhite.wRook2
                ,PiecesInitialPositionWhite.wPawn1, PiecesInitialPositionWhite.wPawn2
                ,PiecesInitialPositionWhite.wPawn3, PiecesInitialPositionWhite.wPawn4
                ,PiecesInitialPositionWhite.wPawn5, PiecesInitialPositionWhite.wPawn6
                ,PiecesInitialPositionWhite.wPawn7, PiecesInitialPositionWhite.wPawn8
            };

            BothKingCoords = (PiecesInitialPositionWhite.wKing, PiecesInitialPositionBlack.bKing);
            MoveHistory = new MoveHistory();
            CaptureHistory = new List<BaseMoveInfo>();
        }

        
        public BaseMoveInfo? UpdatePieceCoords(Move whitesOrientationMoveInfo, bool hasCapture, bool pieceMovedIsWhite)
        {
            BaseMoveInfo? capture = null;

            var piece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.Old.X && i.Y == whitesOrientationMoveInfo.Old.Y);
            if (piece == null) return capture;

            // check if tile is capturable
            // TODO PIECE CAPTURE
            // the coords saved on PiecesCoords is on white's orientation
            var capturePiece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.New.X && i.Y == whitesOrientationMoveInfo.New.Y);
            if (hasCapture && capturePiece != null)
            {
                capture = capturePiece;
                
                CaptureHistory.Add(capturePiece);
                
                PiecesCoords.RemoveAll(i => i.X == capturePiece.X && i.Y == capturePiece.Y);
            }

            // update coords
            piece.X = whitesOrientationMoveInfo.New.X;
            piece.Y = whitesOrientationMoveInfo.New.Y;

            return capture;
        }

        public void RemoveRoomInfo(){
        }
    }
}
