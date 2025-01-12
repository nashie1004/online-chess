using System;

namespace online_chess.Server.Models.DTOs;

public class LeaderboardList
{
    public string UserName { get; set; }
    public int Wins { get; set; }
    public int Loses { get; set; }
    public int Draws { get; set; }
    public DateTime LastGameDate { get; set; }
}
