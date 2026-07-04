# My Pitwall Architecture Overview

## Purpose

My Pitwall is a fan-friendly Formula 1 race tracker for learning and experimentation. The first version focuses on historical race replays using OpenF1 data. The experience should feel like watching a visual race companion: animated cars on a track map, timing gaps, tyre information, lap progress, and race events.

The project is not intended for commercial use in v1. This keeps the architecture practical while still leaving room for future live data, caching, databases, and richer analytics.

## Product Direction

The first user experience is a historical replay viewer:

- Select a season, meeting, and session.
- Start a replay from historical OpenF1 data.
- Watch cars move around a rich 2D track map.
- Zoom, pan, and optionally follow a selected driver.
- See driver trails, timing gaps, tyre compound, tyre age, lap count, and race control events.
- Control playback speed and replay position.

The UI should be visual and approachable rather than a dense engineering dashboard.

## Data Sources

### Primary Source: OpenF1

OpenF1 is the main data provider for v1. It provides historical F1 data including drivers, sessions, laps, positions, intervals, stints, car locations, weather, pit stops, and race control messages.

OpenF1 data will be fetched on demand in v1. The backend may use short-lived in-memory caching during a replay session, but there will be no persistent local database or blob storage at first.

### Supporting Source: Jolpica F1

Jolpica F1 can be added for calendar, standings, race result, circuit, driver, and constructor reference data. It is useful for historical metadata, but it is not the main source for replay telemetry.

### Future Sources

Future versions may add:

- Persistent replay cache.
- Blob storage for downloaded sessions.
- PostgreSQL for replay metadata and user preferences.
- Redis for distributed caching.
- Live OpenF1 subscription data.

## Key Architectural Decisions

### One Repository

The project will use a single repository with separate backend, frontend, and documentation areas.

This keeps development simple and makes it easy to evolve the frontend/backend contract together.

### Replay First, Live Later

The app will be designed around a replay engine that streams historical data as time-based frames. This gives the frontend a live-like experience while avoiding live data complexity at the start.

Later, a live provider can feed the same pipeline.

### OpenF1 as an Adapter, Not the Domain

OpenF1 response models should not leak deeply into the application. The backend will convert OpenF1 data into My Pitwall domain and contract models.

This keeps the app flexible if OpenF1 changes or another source is added.

### SignalR for Streaming

SignalR will be used to push replay frames from the .NET backend to Angular.

This is a natural fit because the frontend needs frequent updates for car positions, timing gaps, driver state, and race events.

### Canvas for Track Rendering

The track map should use Canvas for v1 because it supports frequent animation, fading trails, zoom, pan, and smooth driver movement efficiently.

Angular will still own the surrounding UI and controls.

## Backend Architecture

The backend will use a lightweight Clean Architecture approach.

```text
backend/
  MyPitwall.sln
  src/
    MyPitwall.Api/
    MyPitwall.Application/
    MyPitwall.Domain/
    MyPitwall.Infrastructure/
    MyPitwall.Contracts/
  tests/
    MyPitwall.Application.Tests/
    MyPitwall.Infrastructure.Tests/
```

### MyPitwall.Api

Responsibilities:

- HTTP endpoints.
- SignalR hubs.
- Request validation.
- CORS setup for Angular.
- Application startup and dependency registration.

Example areas:

```text
MyPitwall.Api/
  Controllers/
  Hubs/
  Middleware/
  Program.cs
```

### MyPitwall.Application

Responsibilities:

- Use cases.
- Replay orchestration.
- Session loading.
- Pitwall state creation.
- Interfaces for external dependencies.

Example areas:

```text
MyPitwall.Application/
  Abstractions/
  Replay/
  Sessions/
  Pitwall/
```

### MyPitwall.Domain

Responsibilities:

- Core business concepts.
- Domain models.
- Derived state rules.

Example areas:

```text
MyPitwall.Domain/
  Drivers/
  Timing/
  Tyres/
  Track/
  RaceControl/
```

Example domain concepts:

- Driver race state.
- Tyre stint state.
- Track position.
- Timing gap.
- Replay timestamp.
- Race event.

### MyPitwall.Infrastructure

Responsibilities:

- OpenF1 API client.
- Jolpica API client later.
- In-memory cache.
- External data mapping.
- Future database/blob integrations.

Example areas:

```text
MyPitwall.Infrastructure/
  OpenF1/
  Jolpica/
  Cache/
```

### MyPitwall.Contracts

Responsibilities:

- API response models.
- SignalR event models.
- Frontend-facing DTOs.

Contracts should be stable and friendly for Angular. They should not expose raw OpenF1 models directly.

## Backend Design Patterns

### Clean Architecture

Used to separate domain logic, application use cases, API delivery, and external data providers.

Why:

- Keeps OpenF1 isolated.
- Makes replay logic testable.
- Makes future storage or live data easier to add.

### Adapter Pattern

Used for OpenF1 and future data sources.

Example:

```csharp
public interface IF1DataProvider
{
    Task<IReadOnlyList<DriverDto>> GetDriversAsync(int sessionKey);
    Task<IReadOnlyList<LocationDto>> GetLocationsAsync(int sessionKey);
    Task<IReadOnlyList<LapDto>> GetLapsAsync(int sessionKey);
    Task<IReadOnlyList<IntervalDto>> GetIntervalsAsync(int sessionKey);
    Task<IReadOnlyList<StintDto>> GetStintsAsync(int sessionKey);
    Task<IReadOnlyList<RaceControlDto>> GetRaceControlAsync(int sessionKey);
}
```

The first implementation will be:

```csharp
public sealed class OpenF1DataProvider : IF1DataProvider
{
}
```

### Replay Engine / State Machine

Used to turn raw historical rows into time-based replay frames.

The replay engine owns:

- Current replay time.
- Playback speed.
- Play/pause state.
- Latest known state per driver.
- Frame creation.
- Event emission.

### Pub/Sub with SignalR

Used to send frames from backend to frontend.

Example event:

```text
ReplayFrameUpdated
```

### Facade Pattern on Frontend

Angular feature facades will hide SignalR, API calls, state streams, and selected driver logic from visual components.

## Replay Data Flow

```text
Angular starts replay
  -> .NET API receives replay request
  -> Application layer loads session data
  -> Infrastructure fetches from OpenF1
  -> Application builds replay timeline
  -> Replay engine starts ticking
  -> SignalR sends replay frames
  -> Angular updates timing tower, track map, driver panel, and events feed
```

## Replay Frame Contract

The backend should stream compact frontend-ready frames.

Example:

```json
{
  "sessionKey": 9158,
  "sessionTime": "00:42:18",
  "lap": 23,
  "drivers": [
    {
      "driverNumber": 4,
      "tla": "NOR",
      "teamName": "McLaren",
      "teamColor": "#FF8000",
      "position": 2,
      "gapToLeader": "+3.2",
      "intervalToCarAhead": "+1.1",
      "currentLap": 23,
      "tyreCompound": "MEDIUM",
      "tyreAge": 12,
      "trackPosition": {
        "x": 4812,
        "y": -1240,
        "z": 0
      },
      "trail": [
        { "x": 4790, "y": -1208 },
        { "x": 4762, "y": -1188 }
      ]
    }
  ],
  "events": [
    {
      "type": "PitStop",
      "driverNumber": 4,
      "message": "NOR pit stop",
      "timestamp": "00:42:15"
    }
  ]
}
```

## Frontend Architecture

The frontend will use Angular with standalone components and feature-based folders.

```text
frontend/
  my-pitwall-ui/
    src/app/
      core/
        api/
        config/
        signalr/
      features/
        replay/
        track-map/
        timing-tower/
        driver-panel/
        race-events/
      shared/
        models/
        pipes/
        ui/
```

### Core

Responsibilities:

- API client setup.
- SignalR connection.
- App configuration.
- Shared interceptors.

### Replay Feature

Responsibilities:

- Session selection.
- Replay playback state.
- Play/pause/speed controls.
- Current replay frame stream.

### Track Map Feature

Responsibilities:

- Canvas rendering.
- Coordinate normalization.
- Zoom and pan.
- Driver markers.
- Driver trails.
- Follow driver mode.

### Timing Tower Feature

Responsibilities:

- Position list.
- Gap to leader.
- Interval to car ahead.
- Driver status.

### Driver Panel Feature

Responsibilities:

- Selected driver details.
- Tyre compound and tyre age.
- Current lap and stint.
- Recent lap information.

### Race Events Feature

Responsibilities:

- Race control messages.
- Pit stops.
- Safety car/yellow flag events.
- Fastest lap events later.

## Frontend Design Patterns

### Facade Pattern

Each major feature can expose a facade service.

Example:

```text
ReplayFacade
TrackMapFacade
TimingTowerFacade
```

Why:

- Keeps components simple.
- Centralizes SignalR and RxJS state handling.
- Makes it easier to add NgRx later if needed.

### Presentational Components

Most components should receive data through inputs and emit user actions through outputs.

Why:

- Easier to test.
- Easier to reuse.
- Easier to keep visual components clean.

## Initial Milestones

### Milestone 1: Architecture and Scaffolding

- Create repo structure.
- Scaffold .NET solution.
- Scaffold Angular app.
- Add initial architecture docs.

### Milestone 2: OpenF1 Session Loader

- Fetch meetings/sessions.
- Fetch drivers for a session.
- Fetch laps, stints, intervals, positions, locations, and race control.
- Map OpenF1 responses into internal models.

### Milestone 3: Replay Engine

- Build replay timeline.
- Implement play, pause, speed.
- Generate replay frames.
- Stream frames through SignalR.

### Milestone 4: Fan-Friendly UI

- Build replay page.
- Build timing tower.
- Build Canvas track map.
- Add zoom and pan.
- Add driver markers and trails.
- Add selected driver panel.

### Milestone 5: Polish and Learning Extensions

- Add event highlighting.
- Add battle focus mode.
- Add driver follow mode.
- Add better track scaling and labels.
- Add optional local replay cache.

## Open Questions

- Which historical race should be used as the first development target?
- Should the first track map use raw OpenF1 coordinates only, or should it be aligned to a circuit outline?
- Should replay speed be controlled from the frontend only, or should the backend own all timing decisions?
- Should tyre age be calculated strictly from OpenF1 stint data, or should the app display unknown states when data is incomplete?
- Should the app eventually support user-created notes or favorite drivers?

## Current Decisions

- Use one repository.
- Use .NET for the backend.
- Use Angular for the frontend.
- Use OpenF1 as the primary v1 data source.
- Start with historical replay mode.
- Fetch data from OpenF1 on demand.
- Avoid persistent storage in v1.
- Use SignalR for replay streaming.
- Use Canvas for the animated track map.
- Make the UI fan-friendly and visual.
