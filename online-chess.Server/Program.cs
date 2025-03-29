using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using online_chess.Server;
using online_chess.Server.Hubs;
using online_chess.Server.Models;
using online_chess.Server.Models.Entities;
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
    cfg.Cookie.HttpOnly = true;
    cfg.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
//builder.Services.AddAuthentication().AddGoogle()
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<GameQueueService>();
builder.Services.AddSingleton<GameRoomService>();
builder.Services.AddSingleton<UserConnectionService>();
builder.Services.AddSingleton<TimerService>();
builder.Services.AddSingleton<LogInTrackerService>();

// if you dont want to use S3, use LocalFileStorageService
//builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
builder.Services.AddSingleton<IFileStorageService, S3FileStorageService>();

builder.Services.AddResponseCaching();

// Set up AWS
var awsOptions = builder.Configuration.GetAWSOptions();
awsOptions.Credentials = new BasicAWSCredentials(
    builder.Configuration["AWS:AccessKeyId"], 
    builder.Configuration["AWS:SecretAccessKey"]
);
awsOptions.Region = Amazon.RegionEndpoint.APSoutheast2;

builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonS3>();

//builder.Services.AddSingleton<IAmazonS3>(opt =>
//{
//    var config = new AmazonS3Config()
//    {
//        RegionEndpoint = Amazon.RegionEndpoint.APSoutheast2
//    };
//    return new AmazonS3Client(config);
//});


//builder.Services.Configure<FormOptions>(opt => {
//    opt.MultipartBodyLengthLimit = 2 * 1024 * 1024; // 2mb
//});
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ReactApp", policy => policy
    .WithOrigins(builder.Configuration["AllowedOrigins"])
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
});

var app = builder.Build();

bool.TryParse(builder.Configuration["UseNGINX"], out bool useNGINX);

// if we will use NGINX, handle reverse proxy 
if (useNGINX){
    app.UseForwardedHeaders(new ForwardedHeadersOptions(){
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto       
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); 
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Online-Chess V1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseCors("ReactApp");

// auto run migrations and update sqlite db
using (var scope = app.Services.CreateScope())
{
    var mainCtx = scope.ServiceProvider.GetRequiredService<MainDbContext>();
    var identityCtx = scope.ServiceProvider.GetRequiredService<UserIdentityDbContext>();
        
    mainCtx.Database.Migrate();
    identityCtx.Database.Migrate();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.MapControllers();

app.UseDefaultFiles();

app.UseStaticFiles();
app.MapFallbackToFile("/index.html");

app.MapHub<GameHub>("/hub");

app.Run();
