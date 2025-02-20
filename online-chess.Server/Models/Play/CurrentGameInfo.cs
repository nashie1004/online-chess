using online_chess.Server.Constants;

namespace online_chess.Server.Models.Play
{
    public record CurrentGameInfo
    {
        public Guid GameRoomKey { get; set; }
        public BaseMoveInfo LastMoveInfo { get; set; }
        public string? LastCapture { get; set; }
        public int MoveCount { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinedByUserInfo { get; set; }
        public GameType GameType { get; set; }
        public List<BaseMoveInfo> PiecesCoordinatesInitial { get; set; }
        public (BaseMoveInfo, BaseMoveInfo) BothKingCoords { get; set; }
    }
}
