namespace online_chess.Server.Models.Play
{
    public class KingInfo : BaseMoveInfo
    {
        public bool IsInCheck { get; set; }
        public bool IsCheckmate { get; set; }
        public bool IsInStalemate { get; set; }
        public List<BaseMoveInfo> CheckedBy { get; set; }
    }
}
