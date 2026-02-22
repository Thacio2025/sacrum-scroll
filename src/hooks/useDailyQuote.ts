"use client";

import { useMemo } from "react";
import { getLiturgicalSeason } from "@/lib/liturgical-season";
import { getFilteredQuoteAtIndex } from "@/data/quotes-pool";
import type { ContentCategory, QuoteCard } from "@/types/content";

/** Mapeia tempo litúrgico para categoria prioritária (opcional). */
const SEASON_CATEGORY: Record<string, ContentCategory> = {
  advent: "patristic",
  lent: "patristic",
  passion: "liturgy",
  christmas: "liturgy",
  easter: "liturgy",
  ordinary: "patristic",
};

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Retorna a citação do dia com base na data e no tempo litúrgico.
 * Usa dia do ano como seed para manter a mesma citação durante o dia.
 */
export function useDailyQuote(): QuoteCard {
  return useMemo(() => {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const season = getLiturgicalSeason(today);
    const category = SEASON_CATEGORY[season] ?? "patristic";
    return getFilteredQuoteAtIndex(category, dayOfYear);
  }, []);
}
