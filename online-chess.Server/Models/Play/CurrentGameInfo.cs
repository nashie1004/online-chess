using online_chess.Server.Constants;

namespace online_chess.Server.Models.Play
{
    public record CurrentGameInfo
    {
        public Guid GameRoomKey { get; set; }
        public int MoveCountSinceLastCapture { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinedByUserInfo { get; set; }
        public GameType GameType { get; set; }
        public List<BaseMoveInfo> PiecesCoordinatesInitial { get; set; }
        public BothKingsState BothKingsState { get; set; }
        public bool Reconnect { get; set; }
        public bool WhiteKingHasMoved { get; set; }
        public bool BlackKingHasMoved { get; set; }
        public MoveHistory MoveHistory { get; set; } // TODO
    }
}
