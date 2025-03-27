using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using System.Security.Claims;

namespace online_chess.Server.Service.FileStorageService
{
    public class S3FileStorageService //: IFileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly IServiceProvider _serviceProvider;
        private readonly List<string> _validFormats = new List<string>() { ".jpg", ".jpeg", ".png", ".gif", ".svg" };

        public S3FileStorageService(
            IAmazonS3 s3Client
            , IConfiguration configuration
            , IServiceProvider serviceProvider
        )
        {
            _s3Client = s3Client;
            _bucketName = configuration["S3:BucketName"] ?? "your-s3-bucket";
            _serviceProvider = serviceProvider;
        }

        public async Task<(bool success, string errorMessage, string key)> SaveFile(IFormFile file)
        {
            try
            {
                if (file == null || file.Length <= 0)
                {
                    return (false, "File is empty", string.Empty);
                }

                if (file.Length > (5 * 1024 * 1024))
                {
                    return (false, "Max file size is 5mb", string.Empty);
                }

                string fileExtension = Path.GetExtension(file.FileName);

                if (
                    string.IsNullOrEmpty(fileExtension)
                    || !_validFormats.Contains(fileExtension.ToLower())
                    )
                {
                    return (false, "Valid file formats are " + string.Join(',', _validFormats), string.Empty);
                }

                var newGuid = Guid.NewGuid().ToString();
                var key = $"profile-images/{newGuid}";
                using var stream = file.OpenReadStream();

                var objectRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    Metadata =
                    {
                        ["fileName"] = file.FileName
                    }
                };

                var response = await _s3Client.PutObjectAsync(objectRequest);

                if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                {
                    return (false, $"Unable to upload file in S3.", string.Empty);
                }

                using (var scope = _serviceProvider.CreateScope())
                {
                    var identityDbContext = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                    var accessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
                    var userId = accessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

                    var userToUpdate = await identityDbContext.FindByIdAsync(userId);

                    if (userToUpdate == null)
                    {
                        await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
                        {
                            BucketName = _bucketName,
                            Key = key
                        });

                        return (false, "No user found to save the profile image in.", string.Empty);
                    }

                    userToUpdate.ProfileImageUrl = key;

                    await identityDbContext.UpdateAsync(userToUpdate);

                    return (true, string.Empty, key);
                }
            }
            catch (Exception e)
            {
                return (false, e.Message, string.Empty);
            }
        }

        /**
         * Returns true if delete is successful
         */
        public async Task<bool> RemoveFile(string key)
        {
            var res = await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            });

            return res.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }

        public async Task<(bool exists, Stream? content, string contentType)> GetFile(string key)
        {
            try
            {
                var objectRequest = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                var response = await _s3Client.GetObjectAsync(objectRequest);

                if (response == null)
                {
                    return (false, null, string.Empty);
                }

                return (true, response.ResponseStream, response.Headers.ContentType);
            }
            catch (Exception e)
            {
                return (false, null, string.Empty);
            }
        }
    }
}
