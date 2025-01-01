using Microsoft.AspNetCore.Identity;

namespace online_chess.Server.Models
{
    public class User : IdentityUser<long>
    {
        public DateTime CreateDate { get; set; }
    }
}
