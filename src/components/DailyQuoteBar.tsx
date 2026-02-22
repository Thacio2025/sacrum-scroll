"use client";

import { useDailyQuote } from "@/hooks/useDailyQuote";

const MAX_TEXT = 80;

export function DailyQuoteBar() {
  const quote = useDailyQuote();
  const truncated =
    quote.text.length > MAX_TEXT ? quote.text.slice(0, MAX_TEXT).trim() + "…" : quote.text;

  return (
    <div
      className="shrink-0 border-b border-pedra/10 bg-batina/40 px-3 py-2.5 font-garamond text-pedra/90 backdrop-blur-sm"
      role="complementary"
      aria-label="Citação do dia"
    >
      <span className="font-cormorant text-sm font-medium text-liturgico/90" style={{ fontVariant: "small-caps" }}>
        Citação do dia
      </span>
      {" · "}
      <span className="text-base italic leading-snug">«{truncated}»</span>
      {" — "}
      <span className="text-sm text-liturgico/90">{quote.author}</span>
    </div>
  );
}
