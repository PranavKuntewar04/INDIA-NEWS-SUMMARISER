import { put, list, del, head } from "@vercel/blob";
import type { ListBlobResult } from "@vercel/blob";

/** Blob path constants */
const LATEST_KEY = "summaries/latest.json";
const ARCHIVE_PREFIX = "summaries/archive/";

/** Maximum archive retention in hours (default 7 days) */
const MAX_HISTORY_HOURS = parseInt(process.env.MAX_HISTORY || "168", 10);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SummaryPayload {
  id?: string;
  timestamp: string;
  generatedAt?: string;
  sourcesUsed?: string[];
  totalArticlesProcessed?: number;
  totalArticlesAfterDedup?: number;
  categories: Array<{
    name: string;
    icon?: string;
    articleCount?: number;
    summaryPoints: string[];
    sources: Array<{ title: string; url: string; source: string }>;
  }>;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

export async function saveSummary(payload: SummaryPayload): Promise<void> {
  const data = JSON.stringify(payload, null, 2);
  const id = payload.id || Date.now().toString();

  // Write latest.json (overwrite)
  await put(LATEST_KEY, data, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  // Write archive copy
  await put(`${ARCHIVE_PREFIX}${id}.json`, data, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  // Fire-and-forget cleanup
  cleanupOldArchives().catch(() => {});
}

// ---------------------------------------------------------------------------
// Read latest
// ---------------------------------------------------------------------------

export async function getLatestSummary(): Promise<SummaryPayload | null> {
  try {
    const blob = await head(LATEST_KEY);
    if (!blob) return null;

    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;

    return (await res.json()) as SummaryPayload;
  } catch {
    // Blob not found
    return null;
  }
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export interface HistoryEntry {
  file: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export async function getHistory(
  limit = 10,
  offset = 0
): Promise<HistoryEntry[]> {
  const result: ListBlobResult = await list({ prefix: ARCHIVE_PREFIX });

  // Sort newest first
  const sorted = result.blobs
    .filter((b) => b.pathname.endsWith(".json"))
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

  return sorted.slice(offset, offset + limit).map((b) => ({
    file: b.pathname.replace(ARCHIVE_PREFIX, ""),
    size: b.size,
    uploadedAt: new Date(b.uploadedAt).toISOString(),
    url: b.url,
  }));
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

async function cleanupOldArchives(): Promise<void> {
  const maxAgeMs = MAX_HISTORY_HOURS * 60 * 60 * 1000;
  const now = Date.now();

  const result: ListBlobResult = await list({ prefix: ARCHIVE_PREFIX });

  const toDelete = result.blobs.filter((b) => {
    const uploadedMs = new Date(b.uploadedAt).getTime();
    return now - uploadedMs > maxAgeMs;
  });

  if (toDelete.length > 0) {
    await Promise.all(toDelete.map((b) => del(b.url)));
    console.log(`[storage] Cleaned up ${toDelete.length} old archive blobs`);
  }
}
