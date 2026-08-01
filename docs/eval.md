# Evaluation Criteria (Phase-wise)

This document defines the evaluation criteria (evals) for each phase of the project, ensuring each deliverable meets quality, performance, and reliability standards.

---

## Phase 1: Project Setup & Backend API

**Objective:** A robust, secure REST API capable of storing and serving JSON payload summaries.

| Metric | Evaluation Method | Target / Success Criteria |
|--------|-------------------|---------------------------|
| **Atomic Writes** | Simulate concurrent POST requests. Check file integrity. | No file corruption. `latest.json` always parses as valid JSON. |
| **Authentication** | Send POST requests with valid, invalid, and missing `X-API-Key`. | Valid key returns `201 Created`. Invalid/missing returns `401 Unauthorized`. |
| **Rate Limiting** | Send >100 requests within 15 minutes from the same IP. | Request 101+ should return `429 Too Many Requests`. |
| **Data Retention** | Trigger the cleanup function manually with mock old files. | Files older than 7 days are successfully deleted. |
| **Schema Validation** | Send malformed JSON payloads to the POST endpoint. | API rejects invalid payloads with `400 Bad Request` and descriptive error. |

---

## Phase 2: n8n Pipeline — Fetch & Parse

**Objective:** Reliable fetching, parsing, and deduplication of articles from 5 distinct sources.

| Metric | Evaluation Method | Target / Success Criteria |
|--------|-------------------|---------------------------|
| **Scrape Success Rate** | Run the fetch nodes across all 5 configured sources 10 times. | > 95% success rate. At least 4/5 sources succeed on every run. |
| **Extraction Accuracy** | Manually compare parser JSON output with the live website. | 100% of extracted items have a valid `title` and `url`. No empty elements. |
| **Resilience (Fault Tolerance)** | Intentionally break one source URL (e.g., typo in URL). | Pipeline continues execution and successfully processes the remaining 4 sources. |
| **Deduplication Efficacy** | Feed the deduplication node an array with known duplicate titles. | 100% of exact and substring duplicates are removed. |

---

## Phase 3: AI Categorization & Summarization

**Objective:** High-quality, accurately categorized, and concise summaries generated as valid JSON.

| Metric | Evaluation Method | Target / Success Criteria |
|--------|-------------------|---------------------------|
| **Schema Adherence** | Run the AI nodes 20 times. Parse the output of the LLM. | 100% of runs return structurally valid JSON matching the required schema. |
| **Categorization Accuracy** | Manually review 50 categorized articles. | > 90% of articles are placed in the correct category. |
| **Hallucination Rate** | Compare AI summaries against the input snippets for 20 articles. | 0% hallucination (no facts introduced that were not in the input text). |
| **Token Usage** | Monitor API provider dashboard per run. | Total input + output tokens consistently stay under the estimated budget (e.g., 20k tokens/run). |
| **Latency** | Measure the execution time of the AI nodes in n8n. | AI processing completes in under 60 seconds. |

---

## Phase 4: Frontend Website

**Objective:** A visually polished, responsive, and resilient user interface.

| Metric | Evaluation Method | Target / Success Criteria |
|--------|-------------------|---------------------------|
| **Lighthouse Score** | Run Chrome Lighthouse on `index.html`. | Performance, Accessibility, Best Practices, and SEO all > 90. |
| **Responsiveness** | Test across viewports (375px, 768px, 1024px+). | No horizontal scrolling, grid collapses gracefully to single-column on mobile. |
| **Auto-refresh** | Mock the API to change data, wait 15 minutes (or lower for testing). | DOM updates automatically without a hard page reload. |
| **Error Handling** | Stop the backend server and reload the frontend. | Graceful error UI displayed with a functional "Retry" button. |
| **Dark Mode** | Toggle the theme switcher and refresh the page. | Theme changes immediately and persists across reloads via `localStorage`. |

---

## Phase 5: Polish, Deploy & Monitor

**Objective:** A production-ready, containerized system with end-to-end integration.

| Metric | Evaluation Method | Target / Success Criteria |
|--------|-------------------|---------------------------|
| **Container Startup** | Run `docker compose up --build` on a fresh environment. | All 3 containers (n8n, backend, frontend) start successfully within 30 seconds. |
| **End-to-End Integration** | Manually trigger the n8n pipeline; observe the frontend. | Pipeline completes -> API receives data -> Frontend displays the new summary. |
| **Recovery / Restart** | Run `docker compose restart backend`. | Backend recovers immediately. Frontend gracefully handles the temporary outage and recovers on next poll. |
| **Logging Quality** | Inspect backend logs and n8n execution history. | Logs contain sufficient context (timestamps, status codes) to debug a failure. No sensitive data (API keys) exposed in logs. |

---

> [!TIP]
> **Continuous Evaluation:** After deployment, periodically sample the AI summaries and monitor the n8n execution logs to ensure these evals continue to pass in a live production environment.
