using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace online_chess.Server.Models.DTOs;

[NotMapped]
public class LeaderboardList
{
    public int Rank { get; set; }
    public string UserName { get; set; }
    public int Wins { get; set; }
    public int Loses { get; set; }
    public int Draws { get; set; }
    public DateTime SinceDate { get; set; }
    public DateTime LastGameDate { get; set; }   
    public int Elo { get; set; }
}
