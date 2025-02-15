using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using online_chess.Server.Features.Leaderboard.Queries.GetDefaultLeaderboard;
using online_chess.Server.Features.Leaderboard.Queries.GetGameTypeList;

namespace online_chess.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IMediator _mediator;

        public HomeController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // [AllowAnonymous]
        // [HttpGet("leaderboard")]
        // public async Task<IActionResult> Leaderboard([FromQuery] GetDefaultLeaderboardRequest req)
        // {
        //     return Ok(await _mediator.Send(req));
        // }
        
        // [AllowAnonymous]
        // [HttpGet("gameTypeList")]
        // public async Task<IActionResult> GameTypeList([FromQuery] GetGameTypeListRequest req)
        // {
        //     return Ok(await _mediator.Send(req));
        // }
    }
}
