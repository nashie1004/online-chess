namespace online_chess.Server.Models.Play
{
    public class MoveHistory
    {
        public List<Move> White { get; set; } = new List<Move>();
        public List<Move> Black { get; set; } = new List<Move>();
    }

    public class Move
    {
        public BaseMoveInfo Old { get; set; }
        public BaseMoveInfo New { get; set; }
    }
}
