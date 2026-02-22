/**
 * Gera imagem do card para compartilhar (1080x1080).
 * Usa um div offscreen com o template; html2canvas captura.
 */

import type { QuoteCard as QuoteCardType } from "@/types/content";

const W = 1080;
const H = 1080;

/** Cria elemento temporário com o layout do card e retorna data URL da imagem. */
export async function getShareCardDataUrl(card: QuoteCardType): Promise<string> {
  const { default: html2canvas } = await import("html2canvas");

  const el = document.createElement("div");
  el.setAttribute("data-share-card", "true");
  el.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${W}px;
    height: ${H}px;
    background: #050505;
    color: #a1a1aa;
    font-family: Georgia, 'EB Garamond', serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 80px 60px 100px;
    box-sizing: border-box;
  `;

  const categoryLabel =
    card.category === "patristic"
      ? "Patrística"
      : card.category === "scholastic"
        ? "Escolástica"
        : card.category === "mystic"
          ? "Mística"
          : card.category === "liturgy"
            ? "Liturgia"
            : "Escritura";

  el.innerHTML = `
    <p style="margin:0 0 24px; font-size:22px; letter-spacing:0.15em; text-transform:uppercase; color:#a1a1aa; opacity:0.9;">
      ${escapeHtml(categoryLabel)}
    </p>
    <blockquote style="margin:0 0 32px; font-size:42px; line-height:1.35; font-style:italic; color:#fff;">
      «${escapeHtml(card.text)}»
    </blockquote>
    <p style="margin:0 0 40px; font-size:28px; font-weight:600; letter-spacing:0.05em; color:#d4af37;">
      — ${escapeHtml(card.author)}${card.source ? ` · ${escapeHtml(card.source)}` : ""}
    </p>
    <p style="margin:0; font-size:20px; letter-spacing:0.2em; color:#d4af37; opacity:0.9;">
      SacrumScroll
    </p>
  `;

  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el, {
      width: W,
      height: H,
      scale: 1,
      useCORS: true,
      backgroundColor: "#050505",
      logging: false,
    });
    return canvas.toDataURL("image/png");
  } finally {
    el.remove();
  }
}

function escapeHtml(s: string): string {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
