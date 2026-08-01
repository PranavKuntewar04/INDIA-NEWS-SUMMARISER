import { NextResponse } from "next/server";

/**
 * Validate an incoming summary payload.
 * Returns a NextResponse with 400 if invalid, or null if valid.
 */
export function validateSummaryPayload(
  payload: unknown
): NextResponse | null {
  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { error: "Payload is missing" },
      { status: 400 }
    );
  }

  const body = payload as Record<string, unknown>;

  const requiredFields = ["timestamp", "categories"] as const;
  for (const field of requiredFields) {
    if (!body[field]) {
      console.warn(`[validator] Validation failed: missing ${field}`);
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  if (!Array.isArray(body.categories)) {
    return NextResponse.json(
      { error: '"categories" must be an array' },
      { status: 400 }
    );
  }

  return null; // Validation passed
}
