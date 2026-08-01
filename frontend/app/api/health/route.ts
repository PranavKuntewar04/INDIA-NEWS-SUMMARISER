import { NextResponse } from "next/server";
import { getLatestSummary } from "@/lib/storage";

/**
 * GET /api/health
 *
 * Returns service health status and latest summary timestamp.
 */
export async function GET() {
  let latestSummaryTimestamp: string | null = null;

  try {
    const latest = await getLatestSummary();
    if (latest?.timestamp) {
      latestSummaryTimestamp = latest.timestamp;
    }
  } catch {
    // Ignore — health check should still succeed
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    latestSummaryTimestamp,
  });
}
