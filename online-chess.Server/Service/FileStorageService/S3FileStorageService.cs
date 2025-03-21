using Amazon.S3;

namespace online_chess.Server.Service.FileStorageService
{
    public class S3FileStorageService //: IFileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _region;

        public S3FileStorageService(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWSS3:BucketName"] ?? string.Empty;
            _region = configuration["AWSS3:Region"] ?? string.Empty;
        }

        public bool SaveFile(byte[] content, string fileName)
        {
            /*
            _s3Client.AbortMultipartUploadAsync(new AbortMultipartUploadRequest
            {
                BucketName = _bucketName,
                Key = fileName
            });
            */
            throw new NotImplementedException();
        }

        public bool RemoveFile(string fileName)
        {
            throw new NotImplementedException();
        }

        public string GetFile(string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
