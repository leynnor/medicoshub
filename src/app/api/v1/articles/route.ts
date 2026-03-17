import { NextRequest, NextResponse } from "next/server";
import { MOCK_ARTICLES } from "../_mock_data";
import { searchPubMed } from "@/lib/pubmed";
import { searchScielo } from "@/lib/scielo";

export const runtime = "nodejs";
export const revalidate = 3600; // revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get("specialty") || undefined;
  const source    = searchParams.get("source") || undefined;
  const q         = searchParams.get("q") || undefined;
  const days      = parseInt(searchParams.get("days") || "90");
  const page      = parseInt(searchParams.get("page") || "1");
  const limit     = parseInt(searchParams.get("limit") || "12");

  try {
    // Fetch from real sources in parallel
    const [pubmedArticles, scieloArticles] = await Promise.allSettled([
      (source === "scielo") ? Promise.resolve([]) : searchPubMed({ specialty, q, limit, days }),
      (source === "pubmed") ? Promise.resolve([]) : searchScielo({ specialty, q, limit: 6 }),
    ]);

    const pubmed  = pubmedArticles.status  === "fulfilled" ? pubmedArticles.value  : [];
    const scielo  = scieloArticles.status  === "fulfilled" ? scieloArticles.value  : [];

    let articles = [
      ...pubmed.map(a => ({ ...a, specialty: specialty || null })),
      ...scielo.map(a => ({ ...a, specialty: specialty || null })),
    ];

    // Fallback to mock if both APIs fail (e.g. local dev without internet)
    if (articles.length === 0) {
      let mock = [...MOCK_ARTICLES];
      if (specialty) mock = mock.filter(a => a.specialty === specialty);
      if (source)    mock = mock.filter(a => a.source === source);
      if (q) {
        const lq = q.toLowerCase();
        mock = mock.filter(a =>
          a.title.toLowerCase().includes(lq) ||
          (a.summary_pt?.toLowerCase().includes(lq)) ||
          a.journal.toLowerCase().includes(lq)
        );
      }
      articles = mock;
    }

    // Deduplicate by DOI
    const seen = new Set<string>();
    articles = articles.filter(a => {
      const key = a.doi || a.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by relevance
    articles.sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0));

    const total  = articles.length;
    const start  = (page - 1) * limit;
    const items  = articles.slice(start, start + limit);

    return NextResponse.json({ items, total, page, limit, has_more: start + limit < total });
  } catch {
    // Full fallback
    return NextResponse.json({ items: MOCK_ARTICLES.slice(0, limit), total: MOCK_ARTICLES.length, page: 1, limit, has_more: false });
  }
}
