import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/lib/storage";

/**
 * GET /api/summary/history?limit=N&offset=M
 *
 * Returns a paginated list of archived summary entries.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const history = await getHistory(limit, offset);

    return NextResponse.json({ history, limit, offset });
  } catch (error) {
    console.error("[GET /api/summary/history] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while retrieving history" },
      { status: 500 }
    );
  }
}
