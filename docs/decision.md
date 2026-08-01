# Key Technical Decisions (ADR)

This document captures the major architectural and technical decisions made for the **AI News Summarizer Agent for India** project, providing the context and rationale behind each choice.

---

## 1. Automation Engine: n8n Cloud

**Context:** The system requires a reliable orchestrator to schedule tasks, scrape websites, process data, and interact with AI APIs.
**Decision:** Use **n8n Cloud** rather than a self-hosted Dockerized instance.
**Rationale:** 
- Reduces infrastructure maintenance and overhead.
- Provides a secure, managed environment for storing credentials (like AI API keys).
- Offloads the workflow execution from the main application server, improving the system's overall reliability.
**Consequences:** 
- Relies on external managed infrastructure.
- Requires ensuring that the Cloud instance can communicate with the backend API.

## 2. Artificial Intelligence Model: Google Gemini

**Context:** The scraped news articles need to be accurately categorized and summarized. The model needs to consistently output structured JSON.
**Decision:** Use **Google Gemini** as the primary LLM provider.
**Rationale:** 
- Highly capable of understanding complex contexts and adhering to strict JSON output schemas.
- Offers a great balance of speed, high context windows, and cost-effectiveness compared to alternatives like OpenAI GPT-4o.
**Consequences:** 
- The system is dependent on Google's API uptime and rate limits. Prompt tuning specifically caters to Gemini's behavior.

## 3. Backend API Stack: Node.js & Express

**Context:** We need a bridge between the n8n data pipeline (writer) and the frontend website (reader) to ensure the frontend isn't directly exposed to the n8n instance.
**Decision:** Build a lightweight REST API using **Node.js and Express**.
**Rationale:**
- Node.js is excellent for I/O bound tasks and quick JSON manipulation.
- Acts as a reliable "single source of truth".
- Allows us to implement API rate limiting, API key authentication, and schema validation independent of the scraping engine.
**Consequences:** 
- Introduces an extra component to deploy and monitor, but significantly improves system modularity and security.

## 4. Frontend Framework: Next.js

**Context:** The final news briefing must be displayed to users in a fast, responsive, and SEO-friendly manner.
**Decision:** Build the frontend using **Next.js** and React.
**Rationale:**
- Provides a robust component-based architecture for building UI.
- Offers built-in optimization for routing, images, and fonts.
- Easily supports Server-Side Rendering (SSR) or Static Site Generation (SSG) if we decide to optimize loading times further in the future.
- Tailwind CSS (default with Next.js) accelerates styling.
**Consequences:** 
- Requires a Node.js runtime for the frontend (or static export). Slightly steeper learning curve compared to plain HTML/CSS.

## 5. Data Storage Strategy: File-based JSON with Atomic Writes

**Context:** The backend needs to store the hourly summaries.
**Decision:** Use a **file-based JSON storage** system (`latest.json` and timestamped archives) instead of a traditional relational or NoSQL database.
**Rationale:**
- **Simplicity:** The MVP doesn't require complex queries or relationships. We simply write and read a single JSON payload.
- **Portability:** Data can be easily backed up or migrated.
- **Atomic Writes:** Implemented via writing to a `.tmp` file and renaming it, ensuring the frontend never reads a partially written file.
**Consequences:** 
- Not suitable for horizontal scaling of the backend (requires a shared volume). 
- Will require migration to SQLite, PostgreSQL, or Supabase if query requirements become complex.

## 6. Parsing Strategy: Custom JS Functions (Cheerio)

**Context:** The system needs to extract titles, links, and snippets from 5 different Indian news websites.
**Decision:** Use **custom JavaScript parsers** inside n8n function nodes rather than generic scraping tools.
**Rationale:**
- News websites have highly variable DOM structures that change frequently.
- Custom parsers give us granular control over what text is extracted (e.g., avoiding ads and navigation bars) to feed clean data to the AI.
**Consequences:** 
- Requires manual maintenance. If a news site updates its UI, the corresponding parser must be updated.
