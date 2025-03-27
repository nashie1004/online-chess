using MediatR;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageHandler : IRequestHandler<GetProfileImageRequest, GetProfileImageResponse>
    {
        //private readonly IFileStorageService _fileStorageService;
        private readonly S3FileStorageService _s3FileStorageService;

        public GetProfileImageHandler(
            //IFileStorageService fileStorageService
            S3FileStorageService s3FileStorageService
            )
        {
            //_fileStorageService = fileStorageService;
            _s3FileStorageService = s3FileStorageService;
        }

        public async Task<GetProfileImageResponse> Handle(GetProfileImageRequest request, CancellationToken cancellationToken)
        {
            var retVal = new GetProfileImageResponse();

            try
            {
                //var result = await _fileStorageService.GetFile(request.FileName);
                var result = await _s3FileStorageService.GetFile(request.FileName);

                if (!result.exists || result.content == null)
                {
                    retVal.NotFound = true;
                    return retVal;
                }

                retVal.Content = result.content;
                retVal.ContentMimeType = result.contentType;
            }
            catch (Exception ex) 
            {
                retVal.NotFound = true;
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
