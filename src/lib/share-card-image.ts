/**
 * Gera imagem do card para compartilhar (1080x1080) usando Canvas 2D.
 * Evita html2canvas para ser mais estável em iOS / webviews.
 */

import type { QuoteCard as QuoteCardType } from "@/types/content";

const W = 1080;
const H = 1080;

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

/** Cria um canvas temporário com o layout do card e retorna data URL da imagem. */
export async function getShareCardDataUrl(card: QuoteCardType): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // Fundo
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, W, H);

  // Layout mais centrado
  const paddingX = 120;
  const topY = 180;
  const maxWidth = W - paddingX * 2;
  const centerX = W / 2;

  // Categoria
  const categoryLabel =
    card.category === "patristic"
      ? "PATRÍSTICA"
      : card.category === "scholastic"
        ? "ESCOLÁSTICA"
        : card.category === "mystic"
          ? "MÍSTICA"
          : card.category === "liturgy"
            ? "LITURGIA"
            : "ESCRITURA";

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "22px Georgia, 'EB Garamond', serif";
  ctx.textBaseline = "top";
  ctx.letterSpacing = 0 as any; // TS appeasement; browsers ignoram aqui
  ctx.textAlign = "center";

  let y = topY;
  ctx.fillText(categoryLabel, centerX, y);
  y += 40;

  // Citação
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 42px Georgia, 'EB Garamond', serif";
  const quoteText = `«${card.text}»`;
  y = drawWrappedText(ctx, quoteText, centerX, y, maxWidth, 54);
  y += 32;

  // Autor + fonte
  ctx.fillStyle = "#d4af37";
  ctx.font = "600 28px Georgia, 'EB Garamond', serif";
  const authorLine = `— ${card.author}${card.source ? ` · ${card.source}` : ""}`;
  y = drawWrappedText(ctx, authorLine, centerX, y, maxWidth, 34);
  y += 28;

  // Marca — URL maior e centralizada
  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Georgia, 'EB Garamond', serif";
  ctx.letterSpacing = 0 as any;
  ctx.textAlign = "center";
  const brand = "www.sacrumscroll.com";
  ctx.fillText(brand, centerX, H - 120);

  return canvas.toDataURL("image/png");
}
