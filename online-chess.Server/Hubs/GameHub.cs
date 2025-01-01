
using Microsoft.AspNetCore.SignalR;

namespace online_chess.Server.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendMessage(string msg){
            await Clients.All.SendAsync("ReceiveMessage", "hello world");
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("User conneted");
            await Clients.All.SendAsync("connected", $"{Context.ConnectionId} joined");
        }
    }
}
