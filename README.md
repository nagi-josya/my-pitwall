# My Pitwall

My Pitwall is a fan-friendly Formula 1 historical replay tracker built with a .NET backend and Angular frontend.

## Current Shape

- Backend: ASP.NET Core, Clean Architecture folders, OpenF1 adapter, replay contracts, SignalR hub.
- Frontend: Angular standalone components, replay facade, timing tower, Canvas track map shell, driver panel, race events feed.
- Data source: OpenF1 on demand.

## Development

Backend:

```powershell
cd backend
$env:DOTNET_CLI_HOME=(Join-Path (Split-Path (Get-Location) -Parent) '.dotnet-home')
dotnet restore --configfile ..\NuGet.Config
dotnet build --no-restore
dotnet run --project src\MyPitwall.Api\MyPitwall.Api.csproj
```

Frontend:

```powershell
cd frontend\my-pitwall-ui
npm install
npm start
```

The frontend currently expects the backend API at `https://localhost:5170`..
Use Node.js 18 or newer for the Angular app.
