using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageRequest: IRequest<GetProfileImageResponse>
    {
        public string FileName { get; set; }
    }
}
