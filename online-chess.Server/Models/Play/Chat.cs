namespace online_chess.Server.Models.Play
{
    public class Chat{
        public Chat()
        {
            
        }

        public string CreatedByUser { get; set; }
        public DateTimeOffset CreateDate { get; set; } = DateTimeOffset.UtcNow;
        public string Message { get; set; }
    }
}