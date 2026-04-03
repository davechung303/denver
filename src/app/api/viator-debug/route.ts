import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.VIATOR_API_KEY;

  const res = await fetch("https://api.viator.com/partner/search/freetext", {
    method: "POST",
    headers: {
      "exp-api-key": apiKey!,
      "Accept-Language": "en-US",
      "Content-Type": "application/json",
      Accept: "application/json;version=2.0",
    },
    body: JSON.stringify({
      searchTerm: "Denver food tour",
      searchTypes: [{ searchType: "PRODUCTS", pagination: { offset: 0, limit: 3 } }],
      currency: "USD",
      language: "en",
    }),
    cache: "no-store",
  });

  const text = await res.text();
  return NextResponse.json({
    status: res.status,
    keyPresent: !!apiKey,
    keyPrefix: apiKey?.slice(0, 8) ?? "missing",
    body: text.slice(0, 2000),
  });
}
