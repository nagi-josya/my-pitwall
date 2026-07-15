# My Pitwall — AGENTS.md

F1 historical replay tracker: .NET 8 backend + Angular 18 frontend + Cloudflare Pages.

## Quick start

```powershell
# Backend
$env:DOTNET_CLI_HOME=(Join-Path (Split-Path (Get-Location) -Parent) '.dotnet-home')
dotnet restore backend\MyPitwall.sln --configfile NuGet.Config
dotnet build backend\MyPitwall.sln
dotnet run --project backend\src\MyPitwall.Api\MyPitwall.Api.csproj
# Serves on https://localhost:5170

# Frontend
cd frontend\my-pitwall-ui
npm install
npm start   # ng serve on http://localhost:4200
```

## Repo structure

```
backend/
  src/
    MyPitwall.Api/          # HTTP endpoints, SignalR hub (/hubs/replay), startup
    MyPitwall.Application/  # Use cases, replay orchestration, abstractions
    MyPitwall.Contracts/    # API response DTOs, SignalR event models
    MyPitwall.Domain/       # Core business models (Driver, Tyre, Track, Timing, RaceControl)
    MyPitwall.Infrastructure/ # OpenF1 adapter, cache, external DI registration
  tests/
    MyPitwall.Application.Tests/    # stub (no test files yet)
    MyPitwall.Infrastructure.Tests/ # stub (no test files yet)
frontend/
  my-pitwall-ui/
    src/app/
      core/api/     # PitwallApiService — HTTP client
      core/signalr/ # ReplayHubService — SignalR placeholder (BehaviorSubject, no real connection)
      features/     # replay, track-map, timing-tower, driver-panel, race-events, etc.
      shared/       # models, constants
```

Dependency direction: Api → Application ← Infrastructure, Api ↔ Contracts, Application → Domain.

## Backend conventions

- `sealed` classes, file-scoped namespaces, primary constructors, `readonly` fields
- DTOs are `sealed record` with positional params
- JSON property names use `JsonPropertyName` with `snake_case`
- DI via static `Add*()` extension methods in each project's `DependencyInjection.cs`
- `global.json` pins SDK `8.0.422` with `rollForward: latestFeature`
- `ImplicitUsings` and `Nullable` enabled on all csproj

## Frontend conventions

- Standalone components, `ChangeDetectionStrategy.OnPush`, `readonly` constructor injections
- No NgModules; `bootstrapApplication` in `main.ts` with `provideHttpClient()`
- Facade pattern (`ReplayFacade`) centralizes RxJS state; components use `@Input()` / `@Output()`
- RxJS: `BehaviorSubject` → `switchMap` → API call with `catchError(() => of(default))` + `startWith`
- `environment.ts`: `apiBaseUrl: 'http://localhost:5170/api'` — CI overrides via `sed` during deploy
- TypeScript strict mode, `moduleResolution: bundler`, target ES2022, `useDefineForClassFields: false`

## API routes

| Route | Purpose |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/status` | OpenF1 availability check |
| `GET /api/meetings?year=` | List meetings |
| `GET /api/sessions?year=&meetingKey=` | List sessions |
| `POST /api/replays/preview` | Start replay, get opening frame |
| `GET /api/replays/{sessionKey}/drivers/{number}/career` | Driver career |
| `GET /api/standings?sessionKey=` | Championship standings |
| SignalR `/hubs/replay` | `StartReplay` → `ReplayFrameUpdated` event |

CORS allows `http://localhost:4200` and `https://localhost:4200` with credentials. HTTPS redirect only in non-dev.

## Deployment

### Frontend (Cloudflare Workers)

GitHub Actions (`.github/workflows/deploy.yml`):
1. `dotnet restore` + `dotnet publish` backend → `publish/backend`
2. `npm ci` + `sed`-replace `localhost:5170/api` with `$API_BASE_URL` in `environment.ts` + `ng build --configuration production` → `dist/my-pitwall-ui/browser`
3. `wrangler deploy` (v4.107.0) — SPA served via Cloudflare Workers (`src/worker.js`)

### Backend (Belmo.io)

Deploy from GitHub: Belmo detects the `backend/Dockerfile`, builds the .NET 8 container, and serves with auto-HTTPS.

Deploy steps at `deploy/README.md`. Key environment variables:
- `Cors__AllowedOrigins__0` — Frontend Workers URL

CORS origins are read from config (`Cors:AllowedOrigins`), not hardcoded.

Update: push to `main` — Belmo auto-deploys.

## Testing

Test projects exist but are empty — no test framework packages declared, no test files written yet.

## Data architecture

- **OpenF1** primary source (on-demand, no persistence in v1); **Jolpica F1** planned as secondary
- OpenF1 models never leak past Infrastructure; mapped to domain/contract models in Application
- In-memory caching during a replay session via short-lived cache
