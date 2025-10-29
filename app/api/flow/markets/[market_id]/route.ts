import { NextRequest, NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend-url";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ market_id: string }> },
) {
  const { market_id } = await params;
  const url = `${BACKEND_URL}/flow/markets/${market_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Flow market" },
      { status: 500 },
    );
  }
}
