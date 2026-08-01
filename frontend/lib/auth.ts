import { NextRequest, NextResponse } from "next/server";

/**
 * Validate the X-API-Key header against the API_KEY environment variable.
 * Returns a NextResponse with 401 if invalid, or null if valid.
 */
export function authenticateApiKey(
  request: NextRequest
): NextResponse | null {
  const apiKey = request.headers.get("X-API-Key") || request.headers.get("x-api-key");
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    console.error("[auth] API_KEY environment variable is not set");
    return NextResponse.json(
      { error: "Server misconfiguration: API_KEY not set" },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    console.warn("[auth] Unauthorized access attempt");
    return NextResponse.json(
      { error: "Unauthorized: Invalid API Key" },
      { status: 401 }
    );
  }

  return null; // Auth passed
}
