namespace online_chess.Server.Models.Play
{
    public class PlayerInfo
    {
        public string UserName { get; set; }
        public bool IsPlayersTurnToMove { get; set; }
        public TimeSpan TimeLeft { get; set; }
        public bool IsColorWhite { get; set; }
        public bool KingInCheck { get; set; }
        public bool KingInCheckMate { get; set; }
        public bool KingInStalemate { get; set; }
    }
}
