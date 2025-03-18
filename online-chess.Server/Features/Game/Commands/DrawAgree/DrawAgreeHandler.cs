using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.DrawAgree
{
    public class DrawAgreeHandler : IRequestHandler<DrawAgreeRequest, Unit>
    {
        private readonly GameRoomService _gameRoomService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;

        public DrawAgreeHandler(
            GameRoomService gameRoomService
            , IHubContext<GameHub> hubContext
            , IServiceProvider serviceProvider
            )
        {
            _gameRoomService = gameRoomService;
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
        }

        public async Task<Unit> Handle(DrawAgreeRequest request, CancellationToken cancellationToken)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 - Room Not Found");
                return Unit.Value;
            }

            // other player decline draw
            if (!request.AgreeOnDraw)
            {
                room.ChatMessages.Add(new Models.Play.Chat(){
                    CreateDate = DateTimeOffset.Now,
                    CreatedByUser = "server",
                    Message = $"{request.IdentityUserName} declined the draw."
                });

                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onReceiveMessages, room.ChatMessages);
                
                await _hubContext.Clients.Group(request.GameRoomKeyString).SendAsync(RoomMethods.onDeclineDraw, true);
                
                return Unit.Value;
            }

            await _gameRoomService.EndGame(_serviceProvider.CreateScope(), room, EndGameStatus.DrawByAgreement);

            return Unit.Value;
        }
    }
}
