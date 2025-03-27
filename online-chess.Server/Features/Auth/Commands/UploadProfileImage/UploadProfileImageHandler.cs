using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageHandler : IRequestHandler<UploadProfileImageRequest, UploadProfileImageResponse>
    {
        //private readonly IFileStorageService _fileStorageService;
        private readonly S3FileStorageService _s3FileStorageService;
        private readonly UserManager<User> _userManager;

        public UploadProfileImageHandler(
            //IFileStorageService fileStorageService
            UserManager<User> userManager
            , S3FileStorageService s3FileStorageService
            )
        {
            //_fileStorageService = fileStorageService;
            _userManager = userManager;
            _s3FileStorageService = s3FileStorageService;
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

                //if (!string.IsNullOrEmpty(user.ProfileImageUrl))
                //{
                //    var prevImgRemoved = _fileStorageService.RemoveFile(user.ProfileImageUrl);
                //}

                //var result = await _fileStorageService.SaveFile(request.ProfileImageFile);
                var result = await _s3FileStorageService.SaveFile(request.ProfileImageFile);

                if (!result.success)
                {
                    retVal.ValidationErrors.Add(result.errorMessage);
                    return retVal;
                }

                user.ProfileImageUrl = result.key;
                await _userManager.UpdateAsync(user);

                retVal.ProfileImageUrl = result.key;
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
