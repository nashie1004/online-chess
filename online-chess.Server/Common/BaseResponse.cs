namespace online_chess.Server.Common
{
    public class BaseResponse
    {
        public BaseResponse()
        {
            IsSuccess = true;
            RowsAffected = 0;
            SuccessMessage = string.Empty;
            ValidationErrors = new List<string>();
        }

        public bool IsSuccess { get; set; }
        public int RowsAffected { get; set; }
        public string SuccessMessage { get; set; }
        public List<string> ValidationErrors { get; set; }
    }

    public class BaseResponseList<T> : BaseResponse where T : new()
    {
        public BaseResponseList()
        {
            Items = new List<T>();
        }

        public List<T> Items { get; set; }
    }
}
