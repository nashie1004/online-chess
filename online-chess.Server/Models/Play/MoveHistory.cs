namespace online_chess.Server.Models.Play
{
    public class MoveHistory
    {
        public Move White { get; set; }
        public Move Black { get; set; }
    }

    public class Move
    {
        public BaseMoveInfo Old { get; set; }
        public BaseMoveInfo New { get; set; }
    }
}
