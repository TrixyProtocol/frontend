import { NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend-url";

export async function GET() {
  const url = `${BACKEND_URL}/stats/platform`;

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
      { error: "Failed to fetch platform stats" },
      { status: 500 },
    );
  }
}
