
using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Features.Game.Commands.JoinRoom;

namespace online_chess.Server.Hubs
{
    public class GameHub : Hub
    {
        private readonly IMediator _mediator;
        public GameHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task JoinRoom(string msg){
            //var retVal = await _mediator.Send(new JoinRoomRequest());
            await Clients.All.SendAsync("TestClientResponse", $"New connect: ${DateTime.Now}");

        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("User conneted");
            await Clients.All.SendAsync("connected", $"{Context.ConnectionId} joined");
        }


    }
}
