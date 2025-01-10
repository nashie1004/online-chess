namespace online_chess.Server.Common
{
    public class BaseRequest
    {
        public BaseRequest()
        {
            
        }
    }
    
    public class BaseGameRequest 
    {
        public string UserConnectionId { get; set; }
    }

    public class BaseRequestList
    {
        public BaseRequestList()
        {
            PageSize = 15;
            PageNumber = 1;
            SortBy = string.Empty;
            Filters = new List<string>();
        }

        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public string? SortBy { get; set; }
        public object? Filters { get; set; }
    }
}
