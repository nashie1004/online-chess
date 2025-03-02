using online_chess.Server.Enums;
using online_chess.Server.Models.Lobby;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Models
{
    /*
     * For the Page Page
     * - the server will handle these states for the game and chessboard
     * - all coordinates are in white's orientation
     */
    public class GameRoom : GameQueue
    {
        // 1. meta data
        public DateTime GameStartedAt { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
        public List<Chat> ChatMessages { get; set; }
        
        // 2. game data
        public Timer? TimerId { get; set; }
        public List<BaseMoveInfo> PiecesCoords { get; set; }
        public BothKingsState BothKingsState { get; set; }
        public MoveHistory MoveHistory { get; set; }
        public List<BaseMoveInfo> CaptureHistory { get; set; }
        public int MoveCountSinceLastCapture { get; set; } // TODO: For 50 move rule

        public GameRoom()
        {
            CreatedByUserInfo = new PlayerInfo();
            JoinByUserInfo = new PlayerInfo();
            ChatMessages = new List<Chat>();

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
                White = new KingsState()
                {
                    X = white.wKing.X,
                    Y = white.wKing.Y,
                    IsInCheck = false,
                    CheckedBy = new List<BaseMoveInfo>(),
                    IsCheckmate = false,
                    IsInStalemate = false
                },
                Black = new KingsState()
                {
                    X = black.bKing.X,
                    Y = black.bKing.Y,
                    CheckedBy = new List<BaseMoveInfo>(),
                    IsInCheck = false,
                    IsCheckmate = false,
                    IsInStalemate = false
                }
            };

            MoveHistory = new MoveHistory();
            CaptureHistory = new List<BaseMoveInfo>();
            MoveCountSinceLastCapture = 0;
        }

        
        public BaseMoveInfo? UpdatePieceCoords(Move whitesOrientationMoveInfo, Capture capture, Castle castle, bool pieceIsWhite)
        {
            BaseMoveInfo? returnCapturedPiece = null;

            var piece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.Old.X && i.Y == whitesOrientationMoveInfo.Old.Y);
            if (piece == null) return returnCapturedPiece;

            if (pieceIsWhite){
                MoveHistory.White.Add(whitesOrientationMoveInfo);
            } 
            else {
                MoveHistory.Black.Add(whitesOrientationMoveInfo);
            }

            MoveCountSinceLastCapture++;

            // this just updates the king position if the piece moved is king
            if (piece.UniqueName.Contains("king", StringComparison.OrdinalIgnoreCase)){
                
                if (pieceIsWhite)
                {
                    BothKingsState.White.X = whitesOrientationMoveInfo.New.X;
                    BothKingsState.White.Y = whitesOrientationMoveInfo.New.Y;
                } 
                else
                {
                    BothKingsState.Black.X = whitesOrientationMoveInfo.New.X;
                    BothKingsState.Black.Y = whitesOrientationMoveInfo.New.Y;
                }

            }

            // TODO: capture should also handle en passant
            switch(capture){
                case Capture.Normal:
                    var normalCapturedPiece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.New.X && i.Y == whitesOrientationMoveInfo.New.Y);
                    if (normalCapturedPiece == null) break;

                    returnCapturedPiece = normalCapturedPiece;
                    
                    CaptureHistory.Add(normalCapturedPiece);
                    
                    PiecesCoords.RemoveAll(i => i.X == normalCapturedPiece.X && i.Y == normalCapturedPiece.Y);

                    MoveCountSinceLastCapture = 0;

                    break;
                case Capture.EnPassant:
                    break;
                case Capture.None:
                default:
                    break;
            }

            int rookX = -1;
            int rookY = -1;

            switch(castle){
                case Castle.KingSide:
                    if (pieceIsWhite){
                        rookX = 7;
                        rookY = 7;
                    } else {
                        rookX = 7;
                        rookY = 0;
                    }

                    var kingRook = PiecesCoords.Find(i => i.X == rookX && i.Y == rookY);
                    if (kingRook == null) break;

                    kingRook.X = 5;

                    break;
                case Castle.QueenSide:
                    if (pieceIsWhite){
                        rookX = 0;
                        rookY = 7;
                    } else {
                        rookX = 0;
                        rookY = 0;
                    }

                    var queenRook = PiecesCoords.Find(i => i.X == rookX && i.Y == rookY);
                    if (queenRook == null) break;

                    queenRook.X = 3;

                    break;
                case Castle.None:
                default:
                    break;
            }

            // update coords
            piece.X = whitesOrientationMoveInfo.New.X;
            piece.Y = whitesOrientationMoveInfo.New.Y;

            return returnCapturedPiece;
        }

        public void RemoveRoomInfo(){
        }
    }
}
