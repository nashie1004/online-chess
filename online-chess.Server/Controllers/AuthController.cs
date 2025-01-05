﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using online_chess.Server.Features.Auth.Commands.LogIn;
using online_chess.Server.Features.Auth.Commands.LogOut;
using online_chess.Server.Features.Auth.Commands.Register;

namespace online_chess.Server.Controllers
{
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

        [Authorize]
        [HttpPost("isSignedIn")]
        public async Task<IActionResult> IsSignedIn()
        {
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
        {
            return Ok(await _mediator.Send(req));
        }
    }
}
