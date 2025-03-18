using Microsoft.AspNetCore.Identity;

namespace online_chess.Server.Models.Entities
{
    public class User : IdentityUser<long>
    {
        public DateTimeOffset CreateDate { get; set; } = DateTimeOffset.UtcNow;
        public string? ProfileImageUrl { get; set; }
        public int Elo { get; set; }
    }
}
