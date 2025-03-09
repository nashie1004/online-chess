using MediatR;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageRequest : IRequest<UploadProfileImageResponse>
    {
        public IFormFile ProfileImageFile { get; set; }
    }
}
