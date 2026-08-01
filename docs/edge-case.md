# Edge Cases & Corner Cases

This document outlines the potential edge cases and corner cases across the AI News Summarizer Agent system and provides handling strategies for each.

---

## 1. News Scraping & Parsing (n8n Pipeline)

| Edge Case | Impact | Handling Strategy |
|-----------|--------|-------------------|
| **Website blocks scraping (Bot protection/403)** | Zero articles fetched from that source. | Use rotating User-Agents. If persistent, implement a retry mechanism with backoff or fallback to RSS feeds if available. Log warning and continue pipeline with other sources. |
| **Website DOM structure changes** | Scraper extracts zero or malformed articles. | Create an alert if `articles.length === 0` for a specific source. Use robust selectors (e.g., semantic tags) instead of brittle class names. |
| **Paywalled or truncated articles** | Snippet is too short for AI to summarize. | Discard articles where the snippet is less than a minimum character threshold (e.g., 50 characters). |
| **Missing publish dates** | Cannot sort by recency or identify old news. | Fallback to scraper execution time as the default `publishedAt` value. |
| **Timeout during fetch** | Pipeline stalls or crashes. | Set strict HTTP request timeouts (e.g., 30s) in the n8n HTTP Request node and catch the error to proceed to the next source. |

## 2. Data Processing & Deduplication

| Edge Case | Impact | Handling Strategy |
|-----------|--------|-------------------|
| **Same news story, drastically different titles** | Duplicates bypass the title-matching deduplicator. | In Phase 3, prompt the AI to group highly similar stories or implement a similarity check on the `snippet` text as well. |
| **Non-English articles (e.g., Hindi) accidentally fetched** | AI may summarize in mixed languages or fail. | Add a language detection check (or prompt the AI to ignore non-English text). |
| **Zero articles after deduplication** | Pipeline has no data to process. | Add a conditional node: If `articles.length === 0`, skip AI processing and do not update the backend. Log as "No new articles found". |

## 3. AI Categorization & Summarization

| Edge Case | Impact | Handling Strategy |
|-----------|--------|-------------------|
| **LLM returns malformed JSON** | Pipeline crashes at the Output Formatter node. | Implement a validation function node. If `JSON.parse()` fails, trigger an automatic retry with a stricter system prompt (up to 3 times). |
| **LLM assigns an unknown category** | Frontend breaks or displays an unmapped category. | Validate the output against a hardcoded list of allowed categories. Map unknown categories to a fallback category like "Other" or "Miscellaneous". |
| **LLM hallucinates facts** | Misinformation published on the website. | Use low temperature (e.g., `0.1` to `0.3`). Explicitly instruct the model: "Use ONLY information from the provided articles. Do NOT invent facts." |
| **Token limit exceeded** | API returns a 4xx error; summarization fails. | Truncate the input `snippet` for each article to a maximum length (e.g., 400 chars) before sending it to the AI. Ensure total payload size stays within context window limits. |
| **AI Provider API Outage or Rate Limit (429)** | Pipeline fails completely. | Use exponential backoff for retries. If the primary provider (e.g., OpenAI) is down, configure a fallback node to use an alternative provider (e.g., Google Gemini). |

## 4. Backend API & Storage

| Edge Case | Impact | Handling Strategy |
|-----------|--------|-------------------|
| **Concurrent writes to `latest.json`** | File corruption; frontend reads invalid JSON. | Implement atomic writes: write to a `.tmp` file first, then `fs.renameSync` to replace `latest.json`. |
| **Disk fills up with archived summaries** | Server crashes or cannot save new summaries. | Implement a cleanup cron job in the backend that deletes JSON files older than 7 days on every new write operation. |
| **Unauthorized POST request** | Malicious actor overwrites the news summary. | Require a strong `X-API-Key` header on the POST route. Reject any request without it (401 Unauthorized). |
| **Payload exceeds size limits** | API rejects the payload with 413 Payload Too Large. | Set a reasonable JSON body parser limit (e.g., `2MB`). Ensure n8n limits the number of articles processed. |

## 5. Frontend Presentation

| Edge Case | Impact | Handling Strategy |
|-----------|--------|-------------------|
| **Backend API is down** | Website shows a blank page. | Display a graceful error state: "Unable to fetch the latest news at this time." Provide a manual "Retry" button. |
| **A category has no articles in the current hour** | Empty space on the website. | Dynamically render category cards based on the JSON payload. If a category is missing, simply do not render a card for it. |
| **User leaves the tab open for days** | Stale news displayed. | Implement `setInterval` to auto-fetch new data every 15 minutes. Show a subtle "Refreshing..." indicator. |
| **Extremely long summaries or titles** | UI layout breaks or overflows. | Use CSS techniques like `line-clamp` or `text-overflow: ellipsis` and ensure flexible grid constraints. |

---

> [!IMPORTANT]
> The overriding principle for handling these edge cases is **Graceful Degradation**. If a single source fails, the pipeline should continue with the others. If the backend cannot be updated, the frontend should gracefully show the last known good state.
