using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using online_chess.Server.Features.Auth.Commands.Register;
using online_chess.Server.Features.Auth.Queries.GetProfileImage;

namespace online_chess.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PlayController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PlayController> _logger;

        public PlayController(
            IMediator mediator
            , ILogger<PlayController> logger
            )
        {
            _mediator = mediator;
            _logger = logger;   
        }

        [HttpGet("get-image")]
        [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false, VaryByQueryKeys = new string[] { "FileName" })]
        public async Task<IActionResult> GetImage([FromQuery] GetProfileImageRequest req)
        {
            var result = await _mediator.Send(req);
            
            if (result.Content == null || result.NotFound || string.IsNullOrEmpty(result.ContentType))
            {
                return NotFound();
            }

            return File(result.Content, result.ContentType);
        }

        // for testing purposes
        [HttpGet("ping-server")]
        public async Task<IActionResult> PingServer()
        {
            _logger.LogInformation("Ping server okay.");

            return Ok("Ping server okay.");
        }

    }
}
