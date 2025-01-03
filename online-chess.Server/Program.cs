using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using online_chess.Server.DTOs;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Register Swagger/OpenAPI services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Online-Chess",
        Version = "v1"
    });
});

// services
/*
builder.Services.AddAutoMapper(typeof(Mapper));
builder.Services.AddDbContext<MainDbContext>(opt => opt.UseSqlite("Data Source=app.db"));
builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<UserIdentityDbContext>()
    .AddDefaultTokenProviders();
*/
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));


var app = builder.Build();

// Enable Swagger in the HTTP request pipeline for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Generates the Swagger JSON endpoint
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Optional: serves Swagger UI at the root of the app
    });

    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // allow any origin
        .AllowCredentials()); // allow credentials
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Serve static files for your frontend (if any)
app.MapFallbackToFile("/index.html");

app.MapHub<GameHub>("/hub");

app.Run();
