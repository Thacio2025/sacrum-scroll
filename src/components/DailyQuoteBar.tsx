"use client";

import { useDailyQuote } from "@/hooks/useDailyQuote";

const MAX_TEXT = 80;

export function DailyQuoteBar() {
  const quote = useDailyQuote();
  const truncated =
    quote.text.length > MAX_TEXT ? quote.text.slice(0, MAX_TEXT).trim() + "…" : quote.text;

  return (
    <div
      className="shrink-0 border-b border-pedra/10 bg-batina/40 px-3 py-2 font-garamond text-xs text-pedra/90 backdrop-blur-sm"
      role="complementary"
      aria-label="Citação do dia"
    >
      <span className="font-cormorant font-medium text-liturgico/90" style={{ fontVariant: "small-caps" }}>
        Citação do dia
      </span>
      {" · "}
      <span className="italic">«{truncated}»</span>
      {" — "}
      <span className="text-liturgico/90">{quote.author}</span>
    </div>
  );
}
