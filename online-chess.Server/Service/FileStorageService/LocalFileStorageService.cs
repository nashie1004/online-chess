
using HeyRed.Mime;

namespace online_chess.Server.Service.FileStorageService
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles/ProfileImages");
        private readonly List<string> _validFormats = new List<string>() { ".jpg", ".jpeg", ".png", ".gif", ".svg" };

        public LocalFileStorageService()
        {
            
        }

        public async Task<(bool Success, string ErrorMessage, string Key)> SaveFile(IFormFile file)
        {
            try
            {
                string fileExtension = Path.GetExtension(file.FileName);

                if (!Directory.Exists(_uploadPath))
                {
                    Directory.CreateDirectory(_uploadPath);
                }

                if (file.Length > (2 * 1024 * 1024))
                {
                    return (false, "Max file size is 2 mb", string.Empty);
                }

                if (
                    string.IsNullOrEmpty(fileExtension) 
                    || !_validFormats.Contains(fileExtension.ToLower())
                    )
                {
                    return (false, "Valid file formats are " + string.Join(',', _validFormats), string.Empty);
                }

                string fileName = Guid.NewGuid().ToString() + fileExtension;

                using (FileStream stream = new FileStream(Path.Combine(_uploadPath, fileName), FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return (true, string.Empty, fileName);
            } 
            catch (Exception e)
            {
                return (false, e.Message, string.Empty);
            }

        }

        public async Task<bool> RemoveFile(string fileName)
        {
            if (fileName == "DefaultProfileImage.jpg") return false;

            string filePath = Path.Combine(_uploadPath, fileName);

            if (!File.Exists(filePath)){
                return false;
            }

            File.Delete(filePath);
            return true;
        }

        public async Task<(bool Exists, Stream? Content, string ContentType)> GetFile(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_uploadPath, fileName);

                if (!File.Exists(filePath))
                {
                    return (false, null, string.Empty);
                }

                //byte[] content = await File.ReadAllBytesAsync(filePath);

                var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                var contentType = MimeTypesMap.GetMimeType(fileName);

                return (true, stream, contentType);
            } 
            catch (Exception e)
            {
                return (false, null, string.Empty);
            }
        }

        private void EncryptFile()
        {
            
        }

        private string GetMimeTypeFromHeader(byte[] fileHeader)
        {
            if (fileHeader.Length < 8)
                return "application/octet-stream"; // Unknown

            // PNG
            if (fileHeader.Take(8).SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }))
                return "image/png";

            // JPG / JPEG
            if (fileHeader.Take(3).SequenceEqual(new byte[] { 255, 216, 255 }))
                return "image/jpeg";

            // GIF
            if (fileHeader.Take(3).SequenceEqual(new byte[] { 71, 73, 70 })) // "GIF"
                return "image/gif";

            // SVG (Checking for XML header)
            string headerString = System.Text.Encoding.UTF8.GetString(fileHeader);
            if (headerString.Contains("<?xml") && headerString.Contains("<svg"))
                return "image/svg+xml";

            return "application/octet-stream"; // Unknown
        }

    }
}
