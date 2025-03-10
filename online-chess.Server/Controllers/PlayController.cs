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

        public PlayController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("get-image")]
        public async Task<IActionResult> GetImage([FromQuery] GetProfileImageRequest req)
        {
            var result = await _mediator.Send(req);
            if (result.NotFound) return NotFound();
            return File(result.ImgInBytes, result.MimeType, result.FileName);
        }


    }
}
