﻿using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class PlayerInfo
    {
        public string UserName { get; set; }
        public bool IsPlayersTurnToMove { get; set; }
        public double TimeLeft { get; set; }
        public DateTime LastMoveDate { get; set; }
        public bool IsColorWhite { get; set; }
        public bool KingInCheck { get; set; }
        public bool KingInCheckMate { get; set; }
        public bool KingInStaleMate { get; set; }
        public PawnPromotionPreference PawnPromotionPreference { get; set; }
    }
}
