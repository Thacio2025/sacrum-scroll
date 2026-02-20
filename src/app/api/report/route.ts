import { NextResponse } from "next/server";

/**
 * Recebe denúncias de imagem inapropriada.
 * Por enquanto só retorna 200; depois você pode conectar a um banco ou fila de moderação.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      cardId?: string;
      imageUrl?: string;
      author?: string;
    };
    const { cardId, imageUrl, author } = body;

    // Aqui você pode: salvar em banco, enviar e-mail, webhook, etc.
    if (process.env.NODE_ENV === "development") {
      console.info("[Report]", { cardId, imageUrl, author });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
