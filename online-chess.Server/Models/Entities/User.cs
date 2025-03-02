using Microsoft.AspNetCore.Identity;

namespace online_chess.Server.Models.Entities
{
    public class User : IdentityUser<long>
    {
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public string? ProfileImageUrl { get; set; }
        public int Elo { get; set; }
    }
}
