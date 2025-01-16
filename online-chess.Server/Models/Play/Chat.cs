namespace online_chess.Server.Models.Play
{
    public class Chat{
        public Chat()
        {
            
        }

        public string CreatedByUser { get; set; }
        public DateTime CreateDate { get; set; }
        public string Message { get; set; }
    }
}