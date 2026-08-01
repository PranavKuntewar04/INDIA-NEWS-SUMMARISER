import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth";
import { validateSummaryPayload } from "@/lib/validator";
import { saveSummary, type SummaryPayload } from "@/lib/storage";

/**
 * POST /api/summary
 *
 * Receives a news summary payload from the n8n pipeline.
 * Protected by X-API-Key authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const authError = authenticateApiKey(request);
    if (authError) return authError;

    // 2. Parse body
    const payload = await request.json();

    // 3. Validate
    const validationError = validateSummaryPayload(payload);
    if (validationError) return validationError;

    // 4. Assign ID if missing
    if (!payload.id) {
      payload.id = `summary-${Date.now()}`;
    }

    // 5. Save
    await saveSummary(payload as SummaryPayload);

    return NextResponse.json(
      { message: "Summary saved successfully", id: payload.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/summary] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while saving summary" },
      { status: 500 }
    );
  }
}
