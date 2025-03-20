namespace online_chess.Server.Service.FileStorageService
{
    public class S3FileStorageService //: IFileStorageService
    {
        // TODO add settings here: bucket name, region, access key, secret key
        private readonly string _bucketName;

        public S3FileStorageService()
        {

        }

        public bool SaveFile(byte[] content, string fileName)
        {
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
