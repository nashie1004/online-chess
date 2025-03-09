using MediatR;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageHandler : IRequestHandler<UploadProfileImageRequest, UploadProfileImageResponse>
    {
        private readonly IFileStorageService _fileStorageService;
        public UploadProfileImageHandler(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<UploadProfileImageResponse> Handle(UploadProfileImageRequest request, CancellationToken cancellationToken)
        {
            var retVal = new UploadProfileImageResponse();
            try
            {
                var result = await _fileStorageService.SaveFile(request.ProfileImageFile);

                if (!result.success)
                {
                    retVal.ValidationErrors.Add(result.fileNameOrErrorMsg);
                    return retVal;
                }

                retVal.FileName = result.fileNameOrErrorMsg;
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
