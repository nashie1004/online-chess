using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using online_chess.Server;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
using online_chess.Server.Models.Play;
using online_chess.Server.Persistence;
using online_chess.Server.Service;
using online_chess.Server.Service.FileStorageService;

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
//builder.Services.AddAutoMapper(typeof(Mapper));
var dataSource = DBCreatorHelper.CreateSQLiteDB();
builder.Services.AddDbContext<MainDbContext>(opt => opt.UseSqlite($"Data Source={dataSource}"));
builder.Services.AddDbContext<UserIdentityDbContext>(opt => opt.UseSqlite($"Data Source={dataSource}"));
builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<UserIdentityDbContext>()
    .AddDefaultTokenProviders();
builder.Services.ConfigureApplicationCookie(cfg => {
    cfg.ExpireTimeSpan = TimeSpan.FromHours(3);
    cfg.SlidingExpiration = true;
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<GameQueueService>();
builder.Services.AddSingleton<GameRoomService>();
builder.Services.AddSingleton<UserConnectionService>();
builder.Services.AddSingleton<TimerService>();
builder.Services.AddSingleton<LogInTrackerService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
//builder.Services.AddAWS
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var allowedOrigins = builder.Configuration["AllowedOrigins"];

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ReactApp", policy => policy
    .WithOrigins(allowedOrigins)
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
});

var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
app.UseSwagger(); // Generates the Swagger JSON endpoint
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; 
});
//}

app.UseCors("ReactApp");

using (var scope = app.Services.CreateScope())
{
    var mainCtx = scope.ServiceProvider.GetRequiredService<MainDbContext>();
    var identityCtx = scope.ServiceProvider.GetRequiredService<UserIdentityDbContext>();
        
    mainCtx.Database.Migrate();
    identityCtx.Database.Migrate();
}

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.UseDefaultFiles();

// Serve static files for your frontend (if any)
app.UseStaticFiles();
app.MapFallbackToFile("/index.html");

app.MapHub<GameHub>("/hub");

app.Run();
