using Microsoft.EntityFrameworkCore;
using online_chess.Server.Models;

namespace online_chess.Server.Persistence
{
    public class MainDbContext : DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options)
        {
        }
        //public DbSet<User> Users { get; set; }
        public DbSet<GameHistory> GameHistories { get; set; }
    }
}
