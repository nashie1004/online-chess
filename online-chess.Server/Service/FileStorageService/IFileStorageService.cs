namespace online_chess.Server.Service.FileStorageService
{
    public interface IFileStorageService
    {
        Task<(bool success, string fileNameOrErrorMsg)> SaveFile(IFormFile file);
        Task<bool> RemoveFile(string fileName);
        Task<(bool exists, byte[] content, string mimeType)> GetFile(string fileName);
    }
}
