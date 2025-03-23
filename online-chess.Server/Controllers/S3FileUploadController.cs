using Amazon.S3;
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
            , string bucketName
            )
        {
            _s3Client = s3Client;
            _bucketName = bucketName;
        }


        [HttpPost]
        [Route("upload")]
        [RequestSizeLimit(2 * 1024 * 1024)]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length <= 0)
            {
                return BadRequest("File is empty");
            }

            //_s3Client.

            return Ok();
        }


        [HttpGet]
        [Route("get-file")]
        public async Task<IActionResult> GetFile([FromQuery] string fileName)
        {
            //_s3Client.dow
            return Ok();
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
