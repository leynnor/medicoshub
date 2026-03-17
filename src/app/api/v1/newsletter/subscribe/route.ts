import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Mock: just echo back success
  return NextResponse.json({
    id: crypto.randomUUID(),
    email: body.email,
    message: "Inscrição realizada com sucesso!",
  });
}
