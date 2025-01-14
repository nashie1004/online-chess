using Microsoft.AspNetCore.Identity;

namespace online_chess.Server.Models.Entities
{
    public class User : IdentityUser<long>
    {
        public DateTime CreateDate { get; set; } = DateTime.Now;
    }
}
