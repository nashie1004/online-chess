var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register Swagger/OpenAPI services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "My API",
        Version = "v1"
    });

});

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
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Serve static files for your frontend (if any)
app.MapFallbackToFile("/index.html");

app.Run();
