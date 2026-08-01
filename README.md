# India News Briefing (AI News Summarizer Agent)

An automated news summarization pipeline that scrapes top Indian news sites, uses Google Gemini AI to categorize and summarize the articles, and serves them via a Next.js frontend.

## Architecture Overview

The system consists of three main components:
1. **Data Pipeline (n8n)**: Scrapes 5 major Indian news sites, parses HTML, deduplicates articles, and uses Gemini AI to categorize and summarize. Finally, it POSTs the data to the backend API.
2. **Backend API (Express.js)**: A REST API that securely receives the generated summaries using API key authentication, stores them, and serves the latest summary to the frontend.
3. **Frontend (Next.js)**: A responsive, modern web application that fetches the latest summary from the backend and displays it to the users.

## Prerequisites

- Node.js (v20+)
- Docker (optional, for containerized deployment)
- n8n (Cloud or self-hosted)
- Google Gemini API Key

## Quick Start Guide

### 1. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file (you can use `.env.example` as a reference) and set your `API_KEY` and `PORT` (default 3001).
Start the backend server:
```bash
npm start
```

### 2. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```
Configure your environment variables (e.g., set `NEXT_PUBLIC_BACKEND_URL` to point to your backend, usually `http://localhost:3001`).
Start the Next.js development server:
```bash
npm run dev
```

### 3. n8n Pipeline Setup
1. Import the workflow from `n8n/workflows/news-pipeline.json` into your n8n instance.
2. Configure your variables (`Gemini_API_Key`, `BACKEND_API_URL`, `API_KEY`) in n8n.
3. Manually trigger the workflow to fetch, summarize, and push the first batch of news to your backend. Once verified, activate the workflow for hourly updates.

## Documentation & Deployment

For a detailed breakdown of the implementation phases, see the [Implementation Plan](docs/implementation-plan.md).

For full deployment instructions (Railway for Backend, Vercel for Frontend, and n8n setup), check out the [Deployment Plan](docs/deployment-plan.md).
