import { NextResponse } from "next/server";
import { getLatestSummary } from "@/lib/storage";

/**
 * GET /api/summary/latest
 *
 * Returns the most recent news summary.
 */
export async function GET() {
  try {
    const summary = await getLatestSummary();

    if (!summary) {
      return NextResponse.json(
        { error: "No summary available yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("[GET /api/summary/latest] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while retrieving summary" },
      { status: 500 }
    );
  }
}
