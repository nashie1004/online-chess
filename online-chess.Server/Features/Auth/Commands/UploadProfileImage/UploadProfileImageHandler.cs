using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Commands.UploadProfileImage
{
    public class UploadProfileImageHandler : IRequestHandler<UploadProfileImageRequest, UploadProfileImageResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly IFileStorageService _fileStorageService;

        public UploadProfileImageHandler(
            UserManager<User> userManager
            , IFileStorageService fileStorageService
            )
        {
            _userManager = userManager;
            _fileStorageService = fileStorageService;
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

                var result = await _fileStorageService.SaveFile(request.ProfileImageFile);

                if (!result.Success)
                {
                    retVal.ValidationErrors.Add(result.ErrorMessage);
                    return retVal;
                }

                user.ProfileImageUrl = result.Key;
                await _userManager.UpdateAsync(user);

                retVal.ProfileImageUrl = result.Key;
            }
            catch (Exception ex)
            {
                retVal.ValidationErrors.Add(ex.Message);
            }

            return retVal;
        }
    }
}
