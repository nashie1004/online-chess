namespace online_chess.Server.Models.Play
{
    public class KingsState : BaseMoveInfo
    {
        public bool IsInCheck { get; set; }
        public List<BaseMoveInfo> CheckedBy { get; set; }
        public bool IsCheckmate { get; set; }
        public bool IsInStalemate { get; set; }
    }
}
