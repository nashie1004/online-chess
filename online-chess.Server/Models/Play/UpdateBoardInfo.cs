namespace online_chess.Server.Models.Play
{
    public class UpdateBoardInfo
    {
        public Move MoveInfo { get; set; }
        public bool MoveIsWhite { get; set; }
        public bool CreatorColorIsWhite { get; set; }
        public BaseMoveInfo? CapturedPiece { get; set; }
        public Move MoveHistoryLatestMove { get; set; }
        public BothKingsState BothKingsState { get; set; }
    }
}
