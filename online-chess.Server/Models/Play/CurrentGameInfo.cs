﻿namespace online_chess.Server.Models.Play
{
    public record CurrentGameInfo
    {
        public Guid GameRoomKey { get; set; }
        public BaseMoveInfo LastMoveInfo { get; set; }
        public string? LastCapture { get; set; }
        public int MoveCount { get; set; }
        public PlayerInfo CreatedByUserInfo { get; set; }
        public PlayerInfo JoinedByUserInfo { get; set; }
    }
}
