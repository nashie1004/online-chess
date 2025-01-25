using Microsoft.EntityFrameworkCore;
using online_chess.Server.Models.DTOs;
using online_chess.Server.Models.Entities;

namespace online_chess.Server.Persistence
{
    public class MainDbContext : DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options)
        {
        }
        //public DbSet<User> Users { get; set; }
        public DbSet<GameHistory> GameHistories { get; set; }
        //public DbSet<GameTypeList> GameTypeLists { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GameTypeList>().HasNoKey();
        }
    }
}
