using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageResponse : BaseResponse
    {
        public string ProfileImageUrl { get; set; }
        public bool UploadSucess { get; set; }
    }
}
