import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string; market_id: string }> },
) {
  const { address, market_id } = await params;
  const url = `${BACKEND_URL}/api/flow/users/${address}/markets/${market_id}/bets`;

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
      { error: "Failed to fetch Flow user market bets" },
      { status: 500 },
    );
  }
}
