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
        // 1. misc game info
        public DateTime GameStartedAt { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
        public List<Play.Chat> ChatMessages { get; set; }

        // 2. The server will hold these main chess game state
        public Timer? TimerId { get; set; }
        public List<BaseMoveInfo> PiecesCoords { get; set; }
        public BothKingsState BothKingsState { get; set; }
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

            BothKingsState = new BothKingsState()
            {
                WhiteKing = new KingInfo()
                {
                    X = white.wKing.X,
                    Y = white.wKing.Y,
                    IsInCheck = false,
                    IsCheckmate = false,
                    IsInStalemate = false,
                    CheckedBy = Enumerable.Empty<BaseMoveInfo>().ToList()
                },

                BlackKing = new KingInfo()
                {
                    X = black.bKing.X,
                    Y = black.bKing.Y,
                    IsInCheck = false,
                    IsCheckmate = false,
                    IsInStalemate = false,
                    CheckedBy = Enumerable.Empty<BaseMoveInfo>().ToList()
                },
            };

            MoveHistory = new MoveHistory();
            CaptureHistory = new List<BaseMoveInfo>();
        }

        
        public BaseMoveInfo? UpdatePieceCoords(Move whitesOrientationMoveInfo, bool hasCapture, bool pieceMovedIsWhite)
        {
            BaseMoveInfo? capture = null;

            var piece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.Old.X && i.Y == whitesOrientationMoveInfo.Old.Y);
            if (piece == null) return capture;

            // this just updates the king position if the piece moved is king
            if (piece.UniqueName.Contains("king", StringComparison.OrdinalIgnoreCase)){
                
                if (piece.UniqueName[0] == 'w')
                {
                    this.BothKingsState.WhiteKing.X = whitesOrientationMoveInfo.New.X;
                    this.BothKingsState.WhiteKing.Y = whitesOrientationMoveInfo.New.Y;
                } 
                else
                {
                    this.BothKingsState.BlackKing.X = whitesOrientationMoveInfo.New.X;
                    this.BothKingsState.BlackKing.Y = whitesOrientationMoveInfo.New.Y;
                }

            }

            // check if tile is capturable
            // TODO PIECE CAPTURE
            // the coords saved on PiecesCoords is on white's orientation
            // capture should also handle en passant
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
