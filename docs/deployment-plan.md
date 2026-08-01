# 🚀 Deployment Plan — India News Briefing

> **Backend → Railway** · **Frontend → Vercel** · **Data Pipeline → n8n Cloud / Self-hosted**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Pre-Deployment Checklist](#2-pre-deployment-checklist)
3. [Phase 1 — Backend on Railway](#3-phase-1--backend-on-railway)
4. [Phase 2 — Frontend on Vercel](#4-phase-2--frontend-on-vercel)
5. [Phase 3 — n8n Pipeline Integration](#5-phase-3--n8n-pipeline-integration)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Verification](#7-post-deployment-verification)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)
9. [Cost Estimate](#9-cost-estimate)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                 │
│                                                                  │
│  ┌─────────┐   scrape    ┌─────────────┐   Gemini API           │
│  │ 5 News  │────────────▶│   n8n Cloud  │──────────────┐        │
│  │ Sources │             │  (Pipeline)  │              │        │
│  └─────────┘             └──────┬───────┘              │        │
│                                 │                      │        │
│                     POST /api/summary          categorize &     │
│                     (X-API-Key auth)           summarize        │
│                                 │                      │        │
│                                 ▼                      │        │
│                          ┌──────────────┐              │        │
│                          │   Railway    │◀─────────────┘        │
│                          │  (Backend)   │                       │
│                          │  Express.js  │                       │
│                          │  Port: 3001  │                       │
│                          └──────┬───────┘                       │
│                                 │                               │
│                      GET /api/summary/latest                    │
│                                 │                               │
│                                 ▼                               │
│                          ┌──────────────┐                       │
│                          │   Vercel     │                       │
│                          │ (Frontend)   │                       │
│                          │  Next.js 15  │                       │
│                          └──────────────┘                       │
│                                 │                               │
│                                 ▼                               │
│                            End User                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Pre-Deployment Checklist

### 2.1 Accounts Required

| Service | Purpose | Sign-up |
|---------|---------|---------|
| **Railway** | Backend hosting | [railway.app](https://railway.app) |
| **Vercel** | Frontend hosting | [vercel.com](https://vercel.com) |
| **GitHub** | Source control & CI/CD | [github.com](https://github.com) |
| **n8n Cloud** (or self-hosted) | Workflow automation | [n8n.io](https://n8n.io) |
| **Google AI Studio** | Gemini API key | [aistudio.google.com](https://aistudio.google.com) |

### 2.2 Repository Preparation

```bash
# Ensure the repo has the following structure pushed to GitHub:
AI_AGENT_AUTOMATION/
├── backend/           # Railway deploys from here
│   ├── package.json
│   ├── src/
│   │   ├── server.js  (entrypoint)
│   │   ├── config.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── data/summaries/
├── frontend/          # Vercel deploys from here
│   ├── package.json
│   ├── next.config.ts
│   ├── app/
│   ├── components/
│   └── lib/
└── n8n/
    └── workflows/news-pipeline.json
```

> [!IMPORTANT]
> Push the entire project to a **single GitHub repository**. Both Railway and Vercel support monorepo deployments by specifying the root directory.

### 2.3 Generate a Strong API Key

```bash
# Generate a secure API key (use this for both backend and n8n)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this key — you will use it as `API_KEY` in Railway and `API_KEY` in n8n.

---

## 3. Phase 1 — Backend on Railway

### 3.1 Create Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub Repo"**
3. Select the `AI_AGENT_AUTOMATION` repository
4. Railway will detect the repo — **set the Root Directory to `backend`**

### 3.2 Configure Build & Start

Railway auto-detects Node.js. Verify these settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Watch Paths** | `backend/**` |

> [!NOTE]
> The backend uses `node src/server.js` as the start command (defined in `package.json`). Railway picks this up automatically.

### 3.3 Set Environment Variables

In the Railway dashboard → **Variables** tab, add:

```env
PORT=3001
API_KEY=<your-generated-secure-key>
DATA_DIR=./data/summaries
CORS_ORIGIN=https://your-app.vercel.app
MAX_HISTORY=168
```

> [!WARNING]
> `CORS_ORIGIN` must match your exact Vercel deployment URL. You'll update this after the Vercel deploy in Phase 2. For initial testing, you can set it to `*` temporarily.

### 3.4 Storage Consideration

The backend currently uses **file-system storage** (`storageService.js` reads/writes JSON to `./data/summaries/`).

**Railway limitation**: Railway uses ephemeral file systems — files are wiped on each redeploy.

**Options (pick one):**

| Option | Effort | Recommendation |
|--------|--------|----------------|
| **A. Railway Volume** | Low | ✅ **Recommended for MVP.** Attach a persistent volume at `/app/data/summaries`. Set `DATA_DIR=/app/data/summaries` in env vars. |
| **B. Migrate to a Database** (e.g., Railway PostgreSQL / MongoDB Atlas) | Medium | Better for production at scale. Requires refactoring `storageService.js`. |
| **C. Use Railway's built-in Redis** | Medium | Good for caching the latest summary. |

#### Option A — Attach Railway Volume (Recommended)

1. In Railway dashboard → your backend service → **Settings** → **Volumes**
2. Click **"New Volume"**
3. Set:
   - **Mount Path**: `/app/data/summaries`
   - **Size**: 1 GB (sufficient for JSON summaries)
4. Update env var: `DATA_DIR=/app/data/summaries`

### 3.5 Verify Railway Deployment

After deployment, Railway provides a public URL like:
```
https://ai-news-summarizer-backend-production-xxxx.up.railway.app
```

Test it:
```bash
# Health check
curl https://<your-railway-url>/api/health

# Expected response:
# {"status":"ok","uptime":...,"timestamp":"...","latestSummaryTimestamp":null}
```

---

## 4. Phase 2 — Frontend on Vercel

### 4.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select `AI_AGENT_AUTOMATION`
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Next.js — no build overrides needed

### 4.2 Configure Build Settings

Vercel should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x |

### 4.3 Update `next.config.ts` for Production

The current `next.config.ts` proxies API calls to `localhost:3001`, which won't work in production. You need to update it to point to the Railway backend URL.

**Replace** the contents of `frontend/next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* API proxy — forward /api/* to the Railway backend */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

### 4.4 Set Environment Variables on Vercel

In the Vercel dashboard → **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_BACKEND_URL=https://<your-railway-url>
```

For example:
```env
NEXT_PUBLIC_BACKEND_URL=https://ai-news-summarizer-backend-production-xxxx.up.railway.app
```

> [!IMPORTANT]
> The `NEXT_PUBLIC_` prefix is needed because Next.js rewrites execute on the server side at build time. This makes the URL available during the build process.

### 4.5 Update Railway CORS Origin

Now that you have the Vercel URL, go back to Railway and update:

```env
CORS_ORIGIN=https://your-project-name.vercel.app
```

### 4.6 Verify Frontend Deployment

After Vercel deploys, visit:
```
https://your-project-name.vercel.app
```

You should see the India News Briefing dashboard. If no n8n pipeline has run yet, you'll see the error state: *"No summary available yet. The n8n pipeline may not have run."*

---

## 5. Phase 3 — n8n Pipeline Integration

The n8n workflow (`n8n/workflows/news-pipeline.json`) is the data engine. It scrapes 5 Indian news sources, uses Gemini AI to categorize and summarize, then POSTs the result to the backend.

### 5.1 Choose n8n Hosting

| Option | Cost | Recommendation |
|--------|------|----------------|
| **n8n Cloud** | From $24/mo | ✅ Easiest. Managed hosting, no setup. |
| **Self-hosted on Railway** | ~$5/mo | Good if you want everything on Railway. |
| **Self-hosted on VPS** | ~$5/mo | Full control, more DevOps work. |

### 5.2 Import the Workflow

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Upload `n8n/workflows/news-pipeline.json`

### 5.3 Configure n8n Variables

In n8n → **Settings** → **Variables**, create:

| Variable Name | Value |
|---------------|-------|
| `Gemini_API_Key` | Your Google AI Studio API key |
| `BACKEND_API_URL` | `https://<your-railway-url>` (e.g., `https://ai-news-summarizer-backend-production-xxxx.up.railway.app`) |
| `API_KEY` | The same `API_KEY` set in Railway env vars |

> [!CAUTION]
> The `API_KEY` in n8n **must exactly match** the `API_KEY` in Railway. The backend validates incoming POST requests via the `X-API-Key` header in `auth.js`.

### 5.4 Workflow Node Configuration

The workflow has 14 nodes. Verify these critical connections:

```
Schedule Trigger (hourly) ──┐
                            ├──▶ Set Sources ──▶ HTTP Request (scrape 5 sites)
Manual Trigger ─────────────┘        │
                                     ▼
                              Parse HTML ──▶ Deduplicate
                                     │
                                     ▼
                    Prepare Categorization Prompt ──▶ AI Categorization API (Gemini)
                                     │
                                     ▼
                           Parse Categories ──▶ Group by Category
                                     │
                                     ▼
                    Prepare Summarization Prompt ──▶ AI Summarization API (Gemini)
                                     │
                                     ▼
                    Parse Summaries & Format Output ──▶ Publish Summary
                                                        (POST to Railway backend)
```

The **"Publish Summary"** node sends:
- **URL**: `{{$vars.BACKEND_API_URL}}/api/summary`
- **Header**: `X-API-Key: {{$vars.API_KEY}}`
- **Body**: The formatted JSON payload with categories, summaries, and metadata

### 5.5 Test the Pipeline

1. Open the workflow in n8n
2. Click **"Test Workflow"** (uses the Manual Trigger)
3. Verify each node executes successfully
4. Check that the backend received the data:
   ```bash
   curl https://<your-railway-url>/api/summary/latest
   ```
5. Refresh the Vercel frontend — you should see live news data

### 5.6 Activate Scheduled Execution

Once tested, **activate** the workflow in n8n. The Schedule Trigger runs every **1 hour** automatically.

---

## 6. Environment Variables Reference

### Backend (Railway)

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3001` | Express server port (Railway auto-assigns, but keep for compatibility) |
| `API_KEY` | `<secure-key>` | Authenticates n8n POST requests |
| `DATA_DIR` | `/app/data/summaries` | Path to persistent volume (if using Railway Volumes) |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Allowed frontend origin |
| `MAX_HISTORY` | `168` | Hours of archive retention (7 days) |

### Frontend (Vercel)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://<railway-url>` | Backend API base URL for rewrites |

### n8n

| Variable | Value | Description |
|----------|-------|-------------|
| `Gemini_API_Key` | `<google-ai-key>` | Google Gemini API key for AI processing |
| `BACKEND_API_URL` | `https://<railway-url>` | Where to POST summaries |
| `API_KEY` | `<secure-key>` | Must match Railway's `API_KEY` |

---

## 7. Post-Deployment Verification

### 7.1 Verification Checklist

```
[ ] Railway backend is live and accessible
[ ] Health check returns {"status":"ok"}
[ ] Vercel frontend loads without errors
[ ] CORS is properly configured (no blocked requests in browser console)
[ ] n8n pipeline executes successfully (manual trigger)
[ ] Data flows end-to-end: n8n → Railway → Vercel
[ ] Scheduled trigger fires every hour
[ ] Frontend displays live categorized news
[ ] Theme toggle (dark/light) works
[ ] Category filter navigation works
[ ] "Updated X ago" text updates correctly
[ ] Error state shows when no data available
[ ] Auto-refresh (15 min interval) works on frontend
```

### 7.2 End-to-End Test Commands

```bash
# 1. Check backend health
curl https://<railway-url>/api/health

# 2. Check latest summary exists
curl https://<railway-url>/api/summary/latest

# 3. Check summary history
curl "https://<railway-url>/api/summary/history?limit=5"

# 4. Simulate n8n POST (test authentication)
curl -X POST https://<railway-url>/api/summary \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <your-api-key>" \
  -d '{"timestamp":"2026-08-01T00:00:00Z","categories":[{"name":"Test","summaryPoints":["Test point"],"sources":[]}]}'

# 5. Verify frontend serves the page
curl -I https://your-app.vercel.app
```

---

## 8. Monitoring & Maintenance

### 8.1 Railway Monitoring

- **Logs**: Railway dashboard → Deployments → View Logs
- **Metrics**: CPU, memory, and network usage in Railway dashboard
- **Alerts**: Set up Railway alerts for deployment failures
- The backend logs structured JSON (via `logger.js`), making it easy to search

### 8.2 Vercel Monitoring

- **Analytics**: Vercel dashboard → Analytics (Web Vitals)
- **Function Logs**: Vercel dashboard → Logs
- **Deployment Previews**: Every PR creates a preview deployment

### 8.3 n8n Monitoring

- **Execution History**: n8n → Executions tab shows all past runs
- **Error Handling**: The workflow includes an Error Trigger → Log Error node
- **Alerts**: Configure n8n notifications (email/Slack) for failed executions

### 8.4 Recommended Uptime Monitoring

Set up a free uptime monitor (e.g., UptimeRobot, Better Stack) for:
- `https://<railway-url>/api/health` (backend)
- `https://your-app.vercel.app` (frontend)

---

## 9. Cost Estimate

| Service | Tier | Estimated Monthly Cost |
|---------|------|----------------------|
| **Railway** (Backend) | Hobby / Pro | $5 – $20/mo |
| **Railway Volume** (1GB) | Included in Pro | Included |
| **Vercel** (Frontend) | Hobby (free) | **$0** |
| **n8n Cloud** | Starter | $24/mo |
| **Google Gemini API** | Free tier (1500 req/day) | **$0** (for low volume) |
| | | |
| **Total (MVP)** | | **~$29 – $44/mo** |

> [!TIP]
> **Budget optimization**: Self-host n8n on Railway itself to reduce costs to ~$10-15/mo total. You can run n8n as a second Railway service within the same project.

---

## 10. Troubleshooting

### CORS Errors

**Symptom**: Browser console shows `Access-Control-Allow-Origin` errors.

**Fix**: Ensure `CORS_ORIGIN` in Railway matches the exact Vercel URL (including `https://`, no trailing slash).

```env
# ✅ Correct
CORS_ORIGIN=https://india-news-briefing.vercel.app

# ❌ Wrong
CORS_ORIGIN=https://india-news-briefing.vercel.app/
CORS_ORIGIN=http://india-news-briefing.vercel.app
```

---

### n8n Pipeline Fails at "Publish Summary"

**Symptom**: 401 Unauthorized from backend.

**Fix**: Verify the `API_KEY` n8n variable matches the Railway `API_KEY` environment variable exactly. Check for trailing whitespace.

---

### Data Not Persisting on Railway Redeploy

**Symptom**: `latest.json` disappears after deploy.

**Fix**: Attach a Railway Volume (see §3.4 Option A). Without a volume, Railway's filesystem is ephemeral.

---

### Frontend Shows "No summary available yet"

**Possible causes**:
1. n8n pipeline hasn't run yet → Trigger it manually
2. `NEXT_PUBLIC_BACKEND_URL` is wrong → Check Vercel env vars
3. Backend rewrites aren't working → Check `next.config.ts`
4. Backend is down → Check Railway logs

---

### Gemini API Rate Limit

**Symptom**: n8n "AI Categorization API" or "AI Summarization API" fails.

**Fix**: The workflow has retry logic (3 retries, 5s wait). If still failing:
- Check your Gemini API quota at [aistudio.google.com](https://aistudio.google.com)
- Consider upgrading to a paid tier or using Gemini 2.5 Flash instead of Flash Lite

---

### Railway Build Fails

**Symptom**: Deployment error during `npm install`.

**Fix**:
1. Ensure `Root Directory` is set to `backend` (not the repo root)
2. Check that `package.json` has no local path dependencies
3. Remove `node_modules` from git (already in `.gitignore`)

---

## Deployment Sequence Summary

```
Step 1:  Push code to GitHub
Step 2:  Deploy backend on Railway (set root = backend)
Step 3:  Configure Railway env vars + attach volume
Step 4:  Note down Railway public URL
Step 5:  Update next.config.ts for production rewrites
Step 6:  Deploy frontend on Vercel (set root = frontend)
Step 7:  Set NEXT_PUBLIC_BACKEND_URL on Vercel
Step 8:  Update Railway CORS_ORIGIN to Vercel URL
Step 9:  Import & configure n8n workflow
Step 10: Test pipeline manually
Step 11: Activate n8n schedule
Step 12: Verify end-to-end data flow ✅
```
