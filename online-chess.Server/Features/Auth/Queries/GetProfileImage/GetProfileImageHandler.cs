using MediatR;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageHandler : IRequestHandler<GetProfileImageRequest, GetProfileImageResponse>
    {
        private readonly IFileStorageService _fileStorageService;
        public GetProfileImageHandler(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<GetProfileImageResponse> Handle(GetProfileImageRequest request, CancellationToken cancellationToken)
        {
            var retVal = new GetProfileImageResponse();

            try
            {
                var result = await _fileStorageService.GetFile(request.FileName);
                
                if (!result.exists)
                {
                    retVal.NotFound = true;
                    return retVal;
                }

                retVal.NotFound = false;
                retVal.ImgInBytes = result.content;
                retVal.MimeType = result.mimeType;
                retVal.FileName = request.FileName;
            }
            catch (Exception ex) {
                retVal.NotFound = true;
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
