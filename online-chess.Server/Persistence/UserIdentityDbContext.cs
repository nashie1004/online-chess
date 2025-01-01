﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using online_chess.Server.Models;

namespace online_chess.Server.Persistence
{
    public class UserIdentityDbContext : IdentityDbContext<User, Role, long>
    {
        public UserIdentityDbContext(DbContextOptions<UserIdentityDbContext> opt) : base(opt)
        {
            
        }
    }
}
