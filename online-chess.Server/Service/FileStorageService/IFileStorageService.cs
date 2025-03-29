namespace online_chess.Server.Service.FileStorageService
{
    public interface IFileStorageService
    {
        Task<(bool Success, string ErrorMessage, string Key)> SaveFile(IFormFile file);
        Task<bool> RemoveFile(string key);
        Task<(bool Exists, Stream? Content, string ContentType)> GetFile(string key);
    }
}
