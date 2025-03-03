using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using online_chess.Server.Enums;
using online_chess.Server.Hubs;
using online_chess.Server.Models.Entities;
using online_chess.Server.Service;

namespace online_chess.Server.Features.Game.Commands.SetPromotionPreference
{
    public class SetPromotionPreferenceHandler : IRequestHandler<SetPromotionPreferenceRequest, Unit>
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly GameRoomService _gameRoomService;
        private readonly UserConnectionService _authenticatedUserService;
        private readonly UserManager<User> _userManager;

        public SetPromotionPreferenceHandler(
            IHubContext<GameHub> hubContext
            , GameRoomService gameRoomService
            , UserConnectionService authenticatedUserService
            , UserManager<User> userManager
            )
        {
            _hubContext = hubContext;
            _authenticatedUserService = authenticatedUserService;
            _gameRoomService = gameRoomService;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(SetPromotionPreferenceRequest request, CancellationToken ct)
        {
            var room = _gameRoomService.GetOne(request.GameRoomKeyString);

            if (room == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            // retrieve ids
            var creator = await _userManager.FindByNameAsync(room.CreatedByUserId);
            var joiner = await _userManager.FindByNameAsync(room.JoinedByUserId);

            if (creator == null || joiner == null)
            {
                await _hubContext.Clients.Client(request.UserConnectionId).SendAsync(RoomMethods.onGenericError, "404 Room Not Found");
                return Unit.Value;
            }

            var playerInfoToUpdate = (request.IdentityUserName == room.CreatedByUserId)
                ? room.CreatedByUserInfo : room.JoinByUserInfo;

            playerInfoToUpdate.PawnPromotionPreference = request.UserPreference;

            var retVal = new
            {
                playerName = playerInfoToUpdate.UserName,
                preference = playerInfoToUpdate.PawnPromotionPreference
            };

            await _hubContext.Clients.Group(request.GameRoomKeyString)
                .SendAsync(RoomMethods.onSetPromotionPreference, retVal);

            return Unit.Value;
        }
    }
}
