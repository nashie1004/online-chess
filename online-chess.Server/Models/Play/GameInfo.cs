namespace online_chess.Server.Models.Play
{
    public class GameInfo
    {
        public List<string> MoveHistory { get; set; }
        public List<string> CaptureHistory { get; set; }
        public int PlayerInfo { get; set; }
        public int BothKingState { get; set; }
    }
}
