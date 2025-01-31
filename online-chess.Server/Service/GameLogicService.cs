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
        private static ConcurrentDictionary<Guid, List<CaptureHistory>> _captureHistories = new();

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
            _captureHistories.TryAdd(gameRoomKey, new List<CaptureHistory>());
        }


        public void RemoveAllRoomInfo(Guid gameRoomKey)
        {
            _piecesCoords.TryRemove(gameRoomKey, out List<BaseMoveInfo> piecesCoords);
            _bothKingCoords.TryRemove(gameRoomKey, out (BaseMoveInfo, BaseMoveInfo) bothKingCoords);
            _moveHistories.TryRemove(gameRoomKey, out MoveHistory moveHistory);
            _captureHistories.TryRemove(gameRoomKey, out List<CaptureHistory> captureHistories);
        }
    }
}
