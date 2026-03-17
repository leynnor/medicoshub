import { NextRequest, NextResponse } from "next/server";
import { MOCK_ARTICLES } from "../../_mock_data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6");

  const featured = [...MOCK_ARTICLES]
    .filter((a) => (a.relevance_score ?? 0) >= 9)
    .sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))
    .slice(0, limit);

  return NextResponse.json(featured);
}
