using online_chess.Server.Enums;
using online_chess.Server.Models.Play;
using System.Collections.Concurrent;

namespace online_chess.Server.Service
{
    public class GameLogicService
    {
        private static ConcurrentDictionary<Guid, List<BaseMoveInfo>> _piecesCoords = new();
        private static ConcurrentDictionary<Guid, (BaseMoveInfo, BaseMoveInfo)> _bothKingCoords = new();
        private static ConcurrentDictionary<Guid, MoveHistory> _moveHistories = new();
        private static ConcurrentDictionary<Guid, List<BaseMoveInfo>> _captureHistories = new();

        public GameLogicService()
        {
            
        }

        public void InitializeGameLogic(Guid gameRoomKey)
        {
            _piecesCoords.TryAdd(gameRoomKey, new List<BaseMoveInfo>()
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
            });

            _bothKingCoords.TryAdd(gameRoomKey, (
                PiecesInitialPositionWhite.wKing, PiecesInitialPositionBlack.bKing
            ));

            _moveHistories.TryAdd(gameRoomKey, new MoveHistory());
            _captureHistories.TryAdd(gameRoomKey, new List<BaseMoveInfo>());
        }

        public void KingMoved(Guid gameRoomKey, BaseMoveInfo kingPiece)
        {
            //if (kingPiece.Name[0] == "w")
            //{

            //}
        }

        public MoveHistory? GetMoveHistory(Guid gameRoomKey){
            _moveHistories.TryGetValue(gameRoomKey, out MoveHistory? moveHistory);
            return moveHistory;
        }

        public BaseMoveInfo? UpdatePieceCoords(Guid gameRoomKey, Move moveInfo, bool hasCapture)
        {
            BaseMoveInfo? capture = null;

            _piecesCoords.TryGetValue(gameRoomKey, out List<BaseMoveInfo>? piecesCoords);
            if (piecesCoords == null) return capture;

            var piece = piecesCoords.Find(i => i.X == moveInfo.Old.X && i.Y == moveInfo.Old.Y);
            if (piece == null) return capture;

            // check if tile is capturable
            // TODO PIECE CAPTURE
            var capturePiece = piecesCoords.Find(i => i.X == moveInfo.New.X && i.Y == moveInfo.New.Y);
            if (hasCapture && capturePiece != null)
            {
                capture = capturePiece;
                
                _captureHistories.TryGetValue(gameRoomKey, out List<BaseMoveInfo>? captureHistory);
                captureHistory?.Add(capturePiece);
                
                piecesCoords.RemoveAll(i => i.X == capturePiece.X && i.Y == capturePiece.Y);
            }

            // update coords
            piece.X = moveInfo.New.X;
            piece.Y = moveInfo.New.Y;

            return capture;
        }

        public bool PieceCapture(Guid gameRoomKey, BaseMoveInfo capturedPiece)
        {
            var ok = false;
            _captureHistories.TryGetValue(gameRoomKey, out List<BaseMoveInfo>? captureHistories);
            if (captureHistories != null){
                captureHistories.Add(capturedPiece);
                ok = true;
            }
            return ok;
        }

        public List<BaseMoveInfo>? GetCaptureHistory(Guid gameRoomKey){
            _captureHistories.TryGetValue(gameRoomKey, out List<BaseMoveInfo>? captureHistories);
            return captureHistories;
        }

        public void RemoveRoomInfo(Guid gameRoomKey)
        {
            _piecesCoords.TryRemove(gameRoomKey, out List<BaseMoveInfo>? piecesCoords);
            _bothKingCoords.TryRemove(gameRoomKey, out (BaseMoveInfo, BaseMoveInfo) bothKingCoords);
            _moveHistories.TryRemove(gameRoomKey, out MoveHistory? moveHistory);
            _captureHistories.TryRemove(gameRoomKey, out List<BaseMoveInfo>? captureHistories);
        }
    }
}
