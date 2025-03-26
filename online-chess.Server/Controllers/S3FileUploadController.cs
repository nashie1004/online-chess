using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace online_chess.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class S3FileUploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3FileUploadController(
            IAmazonS3 s3Client
            ,IConfiguration configuration
            )
        {
            _s3Client = s3Client;
            _bucketName = configuration["S3:BucketName"] ?? "your-s3-bucket";
        }


        [HttpPost]
        [Route("upload")]
        //[RequestSizeLimit(2 * 1024 * 1024)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                if (file == null || file.Length <= 0)
                {
                    return BadRequest("File is empty");
                }

                var key = Guid.NewGuid().ToString();
                using var stream = file.OpenReadStream();

                var objectRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = $"profile-images/{key}",
                    InputStream = stream,
                    ContentType = file.ContentType,
                    Metadata = 
                    {
                        ["fileName"] = file.FileName
                    }
                };

                var response = await _s3Client.PutObjectAsync(objectRequest);

                if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(key);
                }

                return StatusCode(500, "Unable to upload file");
            } 
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpGet]
        [Route("get-file")]
        public async Task<IActionResult> GetFile([FromQuery] string key)
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
                    return NotFound();
                }

                //return Ok(response);
                return File(response.ResponseStream, response.Headers.ContentType);
            } 
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("delete-file")]
        public async Task<IActionResult> DeleteFile([FromBody] string fileName)
        {
            //
            //var response = await _s3Client.delete(_bucketName, fileName);

            return Ok();
        }
    }
}
