using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Registrar controladores y Swagger/OpenAPI
builder.Services.AddControllers(); // 🔥 Necesario para usar Controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ZK Bio Agent API",
        Version = "v1"
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ZK Bio Agent API v1");
    });
}

// app.UseHttpsRedirection(); // Puedes dejarlo desactivado por ahora

app.UseAuthorization();

// 🔥 Esta línea habilita tus rutas de controladores
app.MapControllers(); 

app.Run();
