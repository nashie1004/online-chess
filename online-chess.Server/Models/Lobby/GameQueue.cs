using online_chess.Server.Constants;
using online_chess.Server.Enums;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Models.Lobby
{
    // For Lobby Page
    public class GameQueue
    {
        public Guid GameKey { get; set; }
        public DateTime CreateDate { get; set; }
        public GameType GameType { get; set; }
        public GamePlayStatus GamePlayStatus { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
    }
}
