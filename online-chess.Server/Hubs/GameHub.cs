
using Microsoft.AspNetCore.SignalR;

namespace online_chess.Server.Hubs
{
    public class GameHub : Hub
    {
        public async Task TestMessage(){
            await Clients.All.SendAsync("TestMessage", "hello world");
        }
    }
}
