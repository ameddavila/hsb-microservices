using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using zk_sync_service.Services; // Si llegas a usar servicios inyectados

var builder = WebApplication.CreateBuilder(args);

// ✅ Mostrar mensajes de consola (Console.WriteLine)
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// ✅ Agrega controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ZK Sync Service API",
        Version = "v1",
        Description = "Microservicio para sincronizar huellas y rostros ZKTeco"
    });
});

var app = builder.Build();

// ✅ Mostrar Swagger solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZK Sync API v1");
        c.RoutePrefix = string.Empty; // 👉 Swagger en http://localhost:5101/
    });
}

// Middleware opcional
// app.UseHttpsRedirection();

app.UseAuthorization();

// ✅ Rutas de controladores
app.MapControllers();

// 🚀 Ejecutar
app.Run();
