using online_chess.Server.Enums;
using online_chess.Server.Models.Lobby;
using online_chess.Server.Models.Play;
using System.Text.Json.Serialization;

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
        public Timer? TimerId { get; set; }
        
        // for handling disconnect state
        public List<BaseMoveInfo> PiecesCoords { get; set; }
        public (BaseMoveInfo, BaseMoveInfo) BothKingCoords { get; set; }
        public MoveHistory MoveHistory { get; set; }
        public List<BaseMoveInfo> CaptureHistory { get; set; }

        public GameRoom()
        {
            CreatedByUserInfo = new PlayerInfo();
            JoinByUserInfo = new PlayerInfo();
            ChatMessages = new List<Play.Chat>();

            var black = new PiecesInitialPositionBlack();
            var white = new PiecesInitialPositionWhite();

            PiecesCoords = new List<BaseMoveInfo>()
            {
                black.bRook1, black.bKnight1
                ,black.bBishop1, black.bQueen
                ,black.bKing, black.bBishop2
                ,black.bKnight2, black.bRook2
                ,black.bPawn1, black.bPawn2
                ,black.bPawn3, black.bPawn4
                ,black.bPawn5, black.bPawn6
                ,black.bPawn7, black.bPawn8

                ,white.wRook1, white.wKnight1
                ,white.wBishop1, white.wQueen
                ,white.wKing, white.wBishop2
                ,white.wKnight2, white.wRook2
                ,white.wPawn1, white.wPawn2
                ,white.wPawn3, white.wPawn4
                ,white.wPawn5, white.wPawn6
                ,white.wPawn7, white.wPawn8
            };

            BothKingCoords = (white.wKing, black.bKing);
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
