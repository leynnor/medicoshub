/**
 * Cron job — rodado diariamente pelo Vercel às 6h.
 * Invalida o cache das rotas de artigos forçando revalidação.
 */
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function GET() {
  revalidatePath("/api/v1/articles");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
