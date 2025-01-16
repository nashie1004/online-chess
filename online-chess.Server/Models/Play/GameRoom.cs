﻿using online_chess.Server.Models.Lobby;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Models
{
    /*
     * For Page Page
     * - the server will handle these states for the game and chessboard 
     */
    public class GameRoom : GameQueue
    {
        public DateTime GameStartedAt { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinByUserInfo { get; set; }
        public List<string> MoveHistory { get; set; }
        public List<string> CaptureHistory { get; set; }
        public List<Models.Play.Chat> ChatMessages { get; set; }
    }
}
