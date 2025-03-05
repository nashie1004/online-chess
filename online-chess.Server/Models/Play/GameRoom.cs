using online_chess.Server.Enums;
using online_chess.Server.Features.Game.Commands.MovePiece;
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
        public int MoveCountSinceLastCapture { get; set; } // For 50 move rule
        public int MoveCountSinceLastPawnMove { get; set; } // For 50 move rule
        public int LastFewMovesAreTheSame { get; set; } // For threefold repetition rule

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

        
        public BaseMoveInfo? MovePiece(Move whitesOrientationMoveInfo, MovePieceRequest request, bool pieceIsWhite, bool isRoomCreator)
        {
            Capture capture = request.Capture;
            Castle castle = request.Castle;
            bool promote = request.Promote;

            CreatedByUserInfo.IsPlayersTurnToMove = !isRoomCreator;
            JoinByUserInfo.IsPlayersTurnToMove = isRoomCreator;

            BaseMoveInfo? returnCapturedPiece = null;

            var piece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.Old.X && i.Y == whitesOrientationMoveInfo.Old.Y);
            if (piece == null) return returnCapturedPiece;

            MoveCountSinceLastCapture++;

            if (!piece.UniqueName.Contains("pawn", StringComparison.OrdinalIgnoreCase)){
                MoveCountSinceLastPawnMove = 0;
            } else {
                MoveCountSinceLastPawnMove++;
            }

            SaveToMoveHistory(pieceIsWhite, whitesOrientationMoveInfo);

            UpdateKingsState(piece, whitesOrientationMoveInfo, pieceIsWhite, request);

            returnCapturedPiece = CaptureMove(whitesOrientationMoveInfo, capture, pieceIsWhite);

            CastleMove(castle, pieceIsWhite);

            var newUniqueName = PromoteMove(piece, promote, whitesOrientationMoveInfo, pieceIsWhite);

            // update piece metadata if promotion move
            if (!string.IsNullOrEmpty(newUniqueName))
            {
                piece.UniqueName = newUniqueName;
                piece.Name = newUniqueName.Split("-")[0];
            }

            // update coords
            piece.X = whitesOrientationMoveInfo.New.X;
            piece.Y = whitesOrientationMoveInfo.New.Y;

            return returnCapturedPiece;
        }

        private void SaveToMoveHistory(bool pieceIsWhite, Move whitesOrientationMoveInfo)
        {
            if (pieceIsWhite){
                MoveHistory.White.Add(whitesOrientationMoveInfo);
                return;
            } 
            
            MoveHistory.Black.Add(whitesOrientationMoveInfo);
        }

        private void UpdateKingsState(BaseMoveInfo piece, Move whitesOrientationMoveInfo, bool pieceIsWhite, MovePieceRequest request)
        {
            if (!pieceIsWhite)
            {
                request.BothKingsState.White.CheckedBy.ForEach(i => {
                    i.X = Math.Abs(i.X - 7);
                    i.Y = Math.Abs(i.Y - 7);
                });
                
                request.BothKingsState.Black.CheckedBy.ForEach(i => {
                    i.X = Math.Abs(i.X - 7);
                    i.Y = Math.Abs(i.Y - 7);
                });
            }

            BothKingsState.White.IsInCheck = request.BothKingsState.White.IsInCheck;
            BothKingsState.White.CheckedBy = request.BothKingsState.White.CheckedBy;
            BothKingsState.White.IsInStalemate = request.BothKingsState.White.IsInStalemate;
            BothKingsState.White.IsCheckmate = request.BothKingsState.White.IsCheckmate;
            
            BothKingsState.Black.IsInCheck = request.BothKingsState.Black.IsInCheck;
            BothKingsState.Black.CheckedBy = request.BothKingsState.Black.CheckedBy;
            BothKingsState.Black.IsInStalemate = request.BothKingsState.Black.IsInStalemate;
            BothKingsState.Black.IsCheckmate = request.BothKingsState.Black.IsCheckmate;

            // this just updates the king position if the piece moved is king
            if (!piece.UniqueName.Contains("king", StringComparison.OrdinalIgnoreCase)) return;
                
            if (pieceIsWhite)
            {
                BothKingsState.White.X = whitesOrientationMoveInfo.New.X;
                BothKingsState.White.Y = whitesOrientationMoveInfo.New.Y;
                return;
            } 

            BothKingsState.Black.X = whitesOrientationMoveInfo.New.X;
            BothKingsState.Black.Y = whitesOrientationMoveInfo.New.Y;
        }

        private BaseMoveInfo? CaptureMove(Move whitesOrientationMoveInfo, Capture capture, bool pieceIsWhite)
        {
            BaseMoveInfo? retVal = null; 
            
            switch(capture){
                case Capture.Normal:
                    var normalCapturedPiece = PiecesCoords.Find(i => i.X == whitesOrientationMoveInfo.New.X && i.Y == whitesOrientationMoveInfo.New.Y);
                    if (normalCapturedPiece == null) break;

                    retVal = normalCapturedPiece;
                    
                    CaptureHistory.Add(normalCapturedPiece);
                    
                    PiecesCoords.RemoveAll(i => i.X == normalCapturedPiece.X && i.Y == normalCapturedPiece.Y);

                    MoveCountSinceLastCapture = 0;

                    break;
                case Capture.EnPassant:
                    Move enemyLatestPawnMove;

                    if (pieceIsWhite){
                        enemyLatestPawnMove = MoveHistory.Black.Last();
                    } else {
                        enemyLatestPawnMove = MoveHistory.White.Last();
                    }

                    if (enemyLatestPawnMove == null) break;

                    var enPassantCapturedPiece = enemyLatestPawnMove.New;

                    if (!enPassantCapturedPiece.UniqueName.Contains("pawn", StringComparison.OrdinalIgnoreCase)) break;

                    retVal = enPassantCapturedPiece;
                    
                    CaptureHistory.Add(enPassantCapturedPiece);
                    
                    PiecesCoords.RemoveAll(i => i.X == enPassantCapturedPiece.X && i.Y == enPassantCapturedPiece.Y);

                    MoveCountSinceLastCapture = 0;

                    break;
                case Capture.None:
                default:
                    break;
            }

            return retVal;
        }
    
        private void CastleMove(Castle castle, bool pieceIsWhite)
        {
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

        }

        private string? PromoteMove(BaseMoveInfo piece, bool promote, Move whitesOrientationMoveInfo, bool pieceIsWhite)
        {
            if (!promote) return null;
            if (!piece.UniqueName.Contains("pawn", StringComparison.OrdinalIgnoreCase)) return null;
            
            string pieceName = string.Empty;
            PlayerInfo playerInfo = pieceIsWhite && CreatedByUserInfo.IsColorWhite 
                ? CreatedByUserInfo : JoinByUserInfo;

            if (pieceIsWhite)
            {
                switch(playerInfo.PawnPromotionPreference){
                    case PawnPromotionPreference.Queen:
                        pieceName = Pieces.wQueen;
                        break;
                    case PawnPromotionPreference.Rook:
                        pieceName = Pieces.wRook;
                        break;
                    case PawnPromotionPreference.Knight:
                        pieceName = Pieces.wKnight;
                        break;
                    case PawnPromotionPreference.Bishop:
                        pieceName = Pieces.wBishop;
                        break;
                }
            }
            else 
            {
                switch(playerInfo.PawnPromotionPreference){
                    case PawnPromotionPreference.Queen:
                        pieceName = Pieces.bQueen;
                        break;
                    case PawnPromotionPreference.Rook:
                        pieceName = Pieces.bRook;
                        break;
                    case PawnPromotionPreference.Knight:
                        pieceName = Pieces.bKnight;
                        break;
                    case PawnPromotionPreference.Bishop:
                        pieceName = Pieces.bBishop;
                        break;
                }
            }

            string retVal = pieceName + "-" + whitesOrientationMoveInfo.New.X + "-" + whitesOrientationMoveInfo.New.Y;
            return retVal;
        }

    }
}
