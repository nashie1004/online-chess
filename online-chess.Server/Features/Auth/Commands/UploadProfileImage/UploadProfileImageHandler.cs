using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageHandler : IRequestHandler<UploadProfileImageRequest, UploadProfileImageResponse>
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly UserManager<User> _userManager;

        public UploadProfileImageHandler(IFileStorageService fileStorageService, UserManager<User> userManager)
        {
            _fileStorageService = fileStorageService;
            _userManager = userManager;
        }

        public async Task<UploadProfileImageResponse> Handle(UploadProfileImageRequest request, CancellationToken cancellationToken)
        {
            var retVal = new UploadProfileImageResponse();
            
            try
            {
                var user = await _userManager.FindByNameAsync(request.IdentityUserName);
                if (user == null)
                {
                    retVal.ValidationErrors.Add("User not found");
                    return retVal;
                }

                var result = await _fileStorageService.SaveFile(request.ProfileImageFile);

                if (!result.success)
                {
                    retVal.ValidationErrors.Add(result.fileNameOrErrorMsg);
                    return retVal;
                }

                user.ProfileImageUrl = result.fileNameOrErrorMsg;
                await _userManager.UpdateAsync(user);

                retVal.ProfileImageUrl = result.fileNameOrErrorMsg;
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
