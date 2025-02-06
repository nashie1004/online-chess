using MediatR;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Play;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.AddMessageToRoom
{
    public class AddMessageToRoomHandler : IRequestHandler<AddMessageToRoomRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;

        public AddMessageToRoomHandler(IHubContext<GameHub> hubContext, GameRoomService gameRoomService)
        {
            _hubContext = hubContext;
            _gameRoomService = gameRoomService;
        }

        public async Task<Unit> Handle(AddMessageToRoomRequest request, CancellationToken cancellationToken)
        {
            var msgList = new List<Chat>(){
                new Models.Play.Chat(){
                CreateDate = DateTime.Now,
                CreatedByUser = request.IdentityUserName,
                Message = request.Message
            }
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, msgList);

            return Unit.Value;
        }
    }
}
