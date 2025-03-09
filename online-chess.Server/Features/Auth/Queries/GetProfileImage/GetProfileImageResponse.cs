using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageResponse : BaseResponse
    {
        public bool NotFound { get; set; }
        public byte[] ImgInBytes { get; set; }
        public string MimeType { get; set; }
        public string FileName { get; set; }
    }
}
