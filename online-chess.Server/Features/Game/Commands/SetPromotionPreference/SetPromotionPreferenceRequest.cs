using MediatR;
using online_chess.Server.Common;
using online_chess.Server.Enums;

namespace online_chess.Server.Features.Game.Commands.SetPromotionPreference
{
    public class SetPromotionPreferenceRequest : BaseGameRequest, IRequest<Unit>
    {
        public PawnPromotionPreference UserPreference { get; set; }
    }
}
