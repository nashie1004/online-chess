using MediatR;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Queries.GetProfileImage
{
    public class GetProfileImageHandler : IRequestHandler<GetProfileImageRequest, GetProfileImageResponse>
    {
        private readonly IFileStorageService _fileStorageService;

        public GetProfileImageHandler(
            IFileStorageService fileStorageService
            )
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<GetProfileImageResponse> Handle(GetProfileImageRequest request, CancellationToken cancellationToken)
        {
            var retVal = new GetProfileImageResponse();

            try
            {
                var result = await _fileStorageService.GetFile(request.FileName);
                
                retVal.NotFound = !result.Exists;

                if (!result.Exists || result.ContentType == null)
                {
                    return retVal;
                }

                retVal.Content = result.Content;
                retVal.ContentType = result.ContentType;
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
