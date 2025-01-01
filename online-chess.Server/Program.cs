using online_chess.Server.DTOs;
using online_chess.Server.Hubs;

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

builder.Services.AddAutoMapper(typeof(Mapper));

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
