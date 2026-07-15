# My Pitwall — Deployment

## Architecture

```
Browser (Cloudflare Workers)
        │
        ▼  HTTPS
Belmo.io (auto HTTPS, builds from GitHub)
        │
        ▼  HTTP :5170
My Pitwall API (Docker, .NET 8)
        │
        ▼  HTTPS
OpenF1 API (api.openf1.org)
```

## Deploy to Belmo

1. Go to [belmo.io](https://belmo.io) and sign up (no credit card)
2. Click **New service → API**
3. Install the Belmo GitHub App on `nagi-josya/my-pitwall`
4. Set **Root directory** to `backend`
5. Set **Port** to `5170`
6. Add environment variables:

| Variable | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://+:5170` |
| `Cors__AllowedOrigins__0` | `https://my-pitwall.nagendrajosyabhatla.workers.dev` |

7. Click **Deploy**

First build takes ~2-4 minutes. You'll get a `https://my-pitwall--name.belmo.app` URL.

## Update frontend

In the Workers frontend (`frontend/my-pitwall-ui/src/environments/environment.ts`), change `apiBaseUrl` to the Belmo URL.

## Files

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Multi-stage .NET 8 build for Belmo |

## Updating

Push to `main` — Belmo auto-deploys on every push.
