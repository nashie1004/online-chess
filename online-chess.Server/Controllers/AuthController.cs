using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using online_chess.Server.Features.Auth.Commands.Edit;
using online_chess.Server.Features.Auth.Commands.LogIn;
using online_chess.Server.Features.Auth.Commands.LogOut;
using online_chess.Server.Features.Auth.Commands.Register;
using online_chess.Server.Features.Auth.Commands.UploadProfileImage;
using online_chess.Server.Features.Auth.Queries.GetGameHistory;
using online_chess.Server.Features.Auth.Queries.GetPlayerInfo;

namespace online_chess.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

        [HttpGet("is-signed-in")]
        public async Task<IActionResult> IsSignedIn([FromQuery] GetPlayerInfoRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

        [HttpPost("edit")]
        public async Task<IActionResult> EditAccount([FromBody] EditRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

        [HttpPost("upload-image")]
        [RequestSizeLimit(2 * 1024 * 1024)]
        public async Task<IActionResult> UploadProfileImage([FromForm] UploadProfileImageRequest req)
        {
            return Ok(await _mediator.Send(req));
        }

    }
}
