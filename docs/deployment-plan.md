# 🚀 Deployment Plan — India News Briefing

> **Frontend + API → Vercel** · **Data Pipeline → n8n Cloud / Self-hosted**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Pre-Deployment Checklist](#2-pre-deployment-checklist)
3. [Phase 1 — Deploy on Vercel](#3-phase-1--deploy-on-vercel)
4. [Phase 2 — n8n Pipeline Integration](#4-phase-2--n8n-pipeline-integration)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Post-Deployment Verification](#6-post-deployment-verification)
7. [Monitoring & Maintenance](#7-monitoring--maintenance)
8. [Cost Estimate](#8-cost-estimate)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Architecture Overview

The application uses a **unified deployment** — both the Next.js frontend and the API routes run on **Vercel** as a single project. Data from the n8n pipeline is stored in **Vercel Blob Storage**.

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
│                          │   Vercel     │◀─────────────┘        │
│                          │  Next.js 15  │                       │
│                          │  ┌────────┐  │                       │
│                          │  │  API   │  │                       │
│                          │  │ Routes │  │                       │
│                          │  └───┬────┘  │                       │
│                          │      │       │                       │
│                          │  ┌───▼────┐  │                       │
│                          │  │ Vercel │  │                       │
│                          │  │  Blob  │  │                       │
│                          │  └────────┘  │                       │
│                          └──────┬───────┘                       │
│                                 │                               │
│                                 ▼                               │
│                            End User                             │
└──────────────────────────────────────────────────────────────────┘
```

### Key Benefits

| Before (2-service) | After (unified) |
|---------------------|------------------|
| Backend on Railway + Frontend on Vercel | Everything on Vercel |
| CORS configuration needed | No CORS — same origin |
| Proxy rewrites in `next.config.ts` | Native API routes |
| Railway volume for persistence | Vercel Blob (free 250MB) |
| ~$29–44/mo | ~$24/mo (n8n only) |

---

## 2. Pre-Deployment Checklist

### 2.1 Accounts Required

| Service | Purpose | Sign-up |
|---------|---------|---------|
| **Vercel** | Frontend + API hosting | [vercel.com](https://vercel.com) |
| **GitHub** | Source control & CI/CD | [github.com](https://github.com) |
| **n8n Cloud** (or self-hosted) | Workflow automation | [n8n.io](https://n8n.io) |
| **Google AI Studio** | Gemini API key | [aistudio.google.com](https://aistudio.google.com) |

> [!NOTE]
> **Railway is no longer required.** The backend API has been merged into Next.js API routes.

### 2.2 Repository Structure

```bash
AI_AGENT_AUTOMATION/
├── frontend/              # Vercel deploys from here
│   ├── package.json
│   ├── next.config.ts
│   ├── app/
│   │   ├── api/           # ← Merged API routes
│   │   │   ├── summary/
│   │   │   │   ├── route.ts        # POST (receive from n8n)
│   │   │   │   ├── latest/
│   │   │   │   │   └── route.ts    # GET latest summary
│   │   │   │   └── history/
│   │   │   │       └── route.ts    # GET summary history
│   │   │   └── health/
│   │   │       └── route.ts        # GET health check
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   └── lib/
│       ├── storage.ts     # Vercel Blob storage service
│       ├── auth.ts        # API key authentication
│       ├── validator.ts   # Payload validation
│       ├── types.ts
│       └── utils.ts
└── n8n/
    └── workflows/news-pipeline.json
```

### 2.3 Generate a Strong API Key

```bash
# Generate a secure API key (use this for both Vercel and n8n)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this key — you will use it as `API_KEY` in Vercel and `API_KEY` in n8n.

---

## 3. Phase 1 — Deploy on Vercel

### 3.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select `AI_AGENT_AUTOMATION`
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Next.js — no build overrides needed

### 3.2 Configure Build Settings

Vercel should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x |

### 3.3 Set Environment Variables

In the Vercel dashboard → **Settings** → **Environment Variables**, add:

```env
API_KEY=<your-generated-secure-key>
BLOB_READ_WRITE_TOKEN=<auto-generated-by-vercel-blob-store>
MAX_HISTORY=168
```

### 3.4 Create Vercel Blob Store

1. In the Vercel dashboard → your project → **Storage** tab
2. Click **"Create Database"** → select **Blob**
3. Name it (e.g., `news-summaries`)
4. Click **Connect**

> [!IMPORTANT]
> Vercel will automatically inject the `BLOB_READ_WRITE_TOKEN` environment variable when you connect the Blob store. You don't need to set it manually.

### 3.5 Deploy

Push your code to GitHub — Vercel will auto-deploy.

```bash
git add .
git commit -m "Merge API into Next.js, add Vercel Blob storage"
git push origin main
```

### 3.6 Verify Deployment

After deployment, Vercel provides a URL like:
```
https://india-news-briefing.vercel.app
```

Test the API:
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Expected response:
# {"status":"ok","timestamp":"...","latestSummaryTimestamp":null}
```

---

## 4. Phase 2 — n8n Pipeline Integration

The n8n workflow (`n8n/workflows/news-pipeline.json`) scrapes 5 Indian news sources, uses Gemini AI to categorize and summarize, then POSTs the result directly to the Vercel app.

### 4.1 Choose n8n Hosting

| Option | Cost | Recommendation |
|--------|------|----------------|
| **n8n Cloud** | From $24/mo | ✅ Easiest. Managed hosting, no setup. |
| **Self-hosted on VPS** | ~$5/mo | Full control, more DevOps work. |

### 4.2 Import the Workflow

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Upload `n8n/workflows/news-pipeline.json`

### 4.3 Configure n8n Variables

In n8n → **Settings** → **Variables**, create:

| Variable Name | Value |
|---------------|-------|
| `Gemini_API_Key` | Your Google AI Studio API key |
| `VERCEL_APP_URL` | `https://your-app.vercel.app` |
| `API_KEY` | The same `API_KEY` set in Vercel env vars |

> [!CAUTION]
> The `API_KEY` in n8n **must exactly match** the `API_KEY` in Vercel. The API route validates incoming POST requests via the `X-API-Key` header.

### 4.4 Workflow Node Configuration

The workflow has 14 nodes. The final **"Publish Summary"** node sends:
- **URL**: `{{$vars.VERCEL_APP_URL}}/api/summary`
- **Header**: `X-API-Key: {{$vars.API_KEY}}`
- **Body**: The formatted JSON payload with categories, summaries, and metadata

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
                                                        (POST to Vercel)
```

### 4.5 Test the Pipeline

1. Open the workflow in n8n
2. Click **"Test Workflow"** (uses the Manual Trigger)
3. Verify each node executes successfully
4. Check that the API received the data:
   ```bash
   curl https://your-app.vercel.app/api/summary/latest
   ```
5. Refresh the Vercel frontend — you should see live news data

### 4.6 Activate Scheduled Execution

Once tested, **activate** the workflow in n8n. The Schedule Trigger runs every **1 hour** automatically.

---

## 5. Environment Variables Reference

### Vercel (Frontend + API)

| Variable | Value | Description |
|----------|-------|-------------|
| `API_KEY` | `<secure-key>` | Authenticates n8n POST requests |
| `BLOB_READ_WRITE_TOKEN` | `<auto-set>` | Vercel Blob access token (auto-injected by Blob Store) |
| `MAX_HISTORY` | `168` | Hours of archive retention (7 days) |

### n8n

| Variable | Value | Description |
|----------|-------|-------------|
| `Gemini_API_Key` | `<google-ai-key>` | Google Gemini API key for AI processing |
| `VERCEL_APP_URL` | `https://your-app.vercel.app` | Where to POST summaries |
| `API_KEY` | `<secure-key>` | Must match Vercel's `API_KEY` |

---

## 6. Post-Deployment Verification

### 6.1 Verification Checklist

```
[ ] Vercel deployment is live and accessible
[ ] Health check returns {"status":"ok"}
[ ] Vercel Blob Store is connected
[ ] n8n pipeline executes successfully (manual trigger)
[ ] Data flows end-to-end: n8n → Vercel API → Blob → Frontend
[ ] Scheduled trigger fires every hour
[ ] Frontend displays live categorized news
[ ] Theme toggle (dark/light) works
[ ] Category filter navigation works
[ ] "Updated X ago" text updates correctly
[ ] Error state shows when no data available
[ ] Auto-refresh (15 min interval) works on frontend
```

### 6.2 End-to-End Test Commands

```bash
# 1. Check health
curl https://your-app.vercel.app/api/health

# 2. Check latest summary exists
curl https://your-app.vercel.app/api/summary/latest

# 3. Check summary history
curl "https://your-app.vercel.app/api/summary/history?limit=5"

# 4. Simulate n8n POST (test authentication)
curl -X POST https://your-app.vercel.app/api/summary \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <your-api-key>" \
  -d '{"timestamp":"2026-08-01T00:00:00Z","categories":[{"name":"Test","summaryPoints":["Test point"],"sources":[]}]}'

# 5. Verify frontend serves the page
curl -I https://your-app.vercel.app
```

---

## 7. Monitoring & Maintenance

### 7.1 Vercel Monitoring

- **Logs**: Vercel dashboard → **Logs** (real-time serverless function logs)
- **Analytics**: Vercel dashboard → **Analytics** (Web Vitals)
- **Function Logs**: Vercel dashboard → **Logs** → filter by `/api/*`
- **Deployment Previews**: Every PR creates a preview deployment
- **Blob Storage Usage**: Vercel dashboard → **Storage** → your Blob store

### 7.2 n8n Monitoring

- **Execution History**: n8n → Executions tab shows all past runs
- **Error Handling**: The workflow includes an Error Trigger → Log Error node
- **Alerts**: Configure n8n notifications (email/Slack) for failed executions

### 7.3 Recommended Uptime Monitoring

Set up a free uptime monitor (e.g., UptimeRobot, Better Stack) for:
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app`

---

## 8. Cost Estimate

| Service | Tier | Estimated Monthly Cost |
|---------|------|----------------------|
| **Vercel** (Frontend + API) | Hobby (free) | **$0** |
| **Vercel Blob** (250MB free) | Free tier | **$0** |
| **n8n Cloud** | Starter | $24/mo |
| **Google Gemini API** | Free tier (1500 req/day) | **$0** (for low volume) |
| | | |
| **Total (MVP)** | | **~$24/mo** |

> [!TIP]
> **Compared to the previous 2-service architecture**, eliminating Railway saves **$5–20/mo**. Self-hosting n8n on a VPS (~$5/mo) can further reduce costs to **~$5/mo total**.

---

## 9. Troubleshooting

### n8n Pipeline Fails at "Publish Summary"

**Symptom**: 401 Unauthorized from the API.

**Fix**: Verify the `API_KEY` n8n variable matches the Vercel `API_KEY` environment variable exactly. Check for trailing whitespace.

---

### Frontend Shows "No summary available yet"

**Possible causes**:
1. n8n pipeline hasn't run yet → Trigger it manually
2. Vercel Blob Store not connected → Check **Storage** tab in Vercel dashboard
3. `BLOB_READ_WRITE_TOKEN` missing → Re-connect the Blob store
4. API route error → Check Vercel function logs

---

### Vercel Blob Storage Issues

**Symptom**: API routes return 500 errors.

**Fix**:
1. Ensure the Blob Store is connected in Vercel dashboard → **Storage**
2. Check that `BLOB_READ_WRITE_TOKEN` is set in environment variables
3. Verify the token is available in both Production and Preview environments

---

### Gemini API Rate Limit

**Symptom**: n8n "AI Categorization API" or "AI Summarization API" fails.

**Fix**: The workflow has retry logic (3 retries, 5s wait). If still failing:
- Check your Gemini API quota at [aistudio.google.com](https://aistudio.google.com)
- Consider upgrading to a paid tier or using Gemini 2.5 Flash instead of Flash Lite

---

### Vercel Build Fails

**Symptom**: Deployment error during build.

**Fix**:
1. Ensure `Root Directory` is set to `frontend` (not the repo root)
2. Check that `package.json` has `@vercel/blob` in dependencies
3. Run `npm run build` locally to reproduce and debug

---

## Deployment Sequence Summary

```
Step 1:  Push code to GitHub
Step 2:  Import project on Vercel (set root = frontend)
Step 3:  Create Vercel Blob Store & connect it
Step 4:  Set API_KEY environment variable on Vercel
Step 5:  Deploy (automatic on push)
Step 6:  Note down Vercel public URL
Step 7:  Import & configure n8n workflow
Step 8:  Set VERCEL_APP_URL and API_KEY in n8n variables
Step 9:  Test pipeline manually
Step 10: Activate n8n schedule
Step 11: Verify end-to-end data flow ✅
```
