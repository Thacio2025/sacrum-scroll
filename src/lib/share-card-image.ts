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

  const paddingX = 80;
  const topY = 120;
  const maxWidth = W - paddingX * 2;

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

  let y = topY;
  ctx.fillText(categoryLabel, paddingX, y);
  y += 40;

  // Citação
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 42px Georgia, 'EB Garamond', serif";
  const quoteText = `«${card.text}»`;
  y = drawWrappedText(ctx, quoteText, paddingX, y, maxWidth, 54);
  y += 32;

  // Autor + fonte
  ctx.fillStyle = "#d4af37";
  ctx.font = "600 28px Georgia, 'EB Garamond', serif";
  const authorLine = `— ${card.author}${card.source ? ` · ${card.source}` : ""}`;
  y = drawWrappedText(ctx, authorLine, paddingX, y, maxWidth, 34);
  y += 28;

  // Marca
  ctx.fillStyle = "#d4af37";
  ctx.font = "20px Georgia, 'EB Garamond', serif";
  ctx.letterSpacing = 0 as any;
  const brand = "SACRUMSCROLL";
  const brandWidth = ctx.measureText(brand).width;
  ctx.fillText(brand, W - paddingX - brandWidth, H - 100);

  return canvas.toDataURL("image/png");
}
