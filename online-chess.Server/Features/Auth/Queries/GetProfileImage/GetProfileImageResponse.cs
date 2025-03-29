using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageResponse : BaseResponse
    {
        public bool NotFound { get; set; } = false;
        public Stream? Content { get; set; }
        public string ContentType { get; set; }
    }
}
