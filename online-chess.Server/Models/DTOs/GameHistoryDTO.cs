using System;
using online_chess.Server.Enums;

namespace online_chess.Server.Models.DTOs;

public class GameHistoryDTO
{
    public GameStatus GameStatus { get; set; }
    public bool IsColorWhite { get; set; }
    public string OpponentName { get; set; }
    public DateTime CreateDate { get; set; }
}
