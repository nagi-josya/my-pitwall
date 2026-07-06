using MyPitwall.Api.Hubs;
using MyPitwall.Application;
using MyPitwall.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddApplication();
builder.Services.AddInfrastructure();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AngularDev");

app.UseAuthorization();

app.MapControllers();
app.MapHub<ReplayHub>("/hubs/replay");

app.Run();
