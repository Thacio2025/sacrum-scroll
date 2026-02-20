"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuoteCard } from "./QuoteCard";
import { PauseStation } from "./PauseStation";
import { getLiturgicalSeason } from "@/lib/liturgical-season";
import type { QuoteCard as QuoteCardType } from "@/types/content";
import { mockQuotes } from "@/data/mock-quotes";

const CARDS_BEFORE_PAUSE = 7;
const ACCENT_BY_SEASON: Record<string, string> = {
  advent: "#6b21a8",
  lent: "#6b21a8",
  passion: "#b91c1c",
  ordinary: "#166534",
  christmas: "#f8fafc",
  easter: "#f8fafc",
};

function getAccentColor(): string {
  const season = getLiturgicalSeason();
  return ACCENT_BY_SEASON[season] ?? "#d4af37";
}

function buildFeedItems(quotes: QuoteCardType[], page: number): ("pause" | QuoteCardType)[] {
  const items: ("pause" | QuoteCardType)[] = [];
  const total = (page + 1) * (CARDS_BEFORE_PAUSE + 1);
  let quoteIndex = 0;
  for (let i = 0; i < total; i++) {
    if ((i + 1) % (CARDS_BEFORE_PAUSE + 1) === 0) {
      items.push("pause");
    } else {
      items.push(quotes[quoteIndex % quotes.length]!);
      quoteIndex++;
    }
  }
  return items;
}

export function Feed() {
  const [page, setPage] = useState(0);
  const [cardsWithImages, setCardsWithImages] = useState<Record<string, string | null>>({});
  const accentColor = getAccentColor();

  const items = useMemo(() => buildFeedItems(mockQuotes, page), [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[0];
        if (last?.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    const sentinel = document.getElementById("feed-sentinel");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  const fetchedIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    const quoteCards = items.filter((x): x is QuoteCardType => x !== "pause");
    quoteCards.forEach((card) => {
      if (fetchedIds.current.has(card.id)) return;
      fetchedIds.current.add(card.id);
      fetch(`/api/art?seed=${card.id}`)
        .then((r) => r.json())
        .then((data: { imageUrl?: string | null }) =>
          setCardsWithImages((prev) => ({ ...prev, [card.id]: data.imageUrl ?? null }))
        )
        .catch(() =>
          setCardsWithImages((prev) => ({ ...prev, [card.id]: null }))
        );
    });
  }, [items]);

  return (
    <div className="snap-container">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) =>
          item === "pause" ? (
            <PauseStation key={`pause-${index}`} />
          ) : (
            <QuoteCard
              key={`${item.id}-${index}`}
              card={{
                ...item,
                imageUrl: cardsWithImages[item.id] ?? undefined,
              }}
              index={index}
              accentColor={accentColor}
            />
          )
        )}
      </AnimatePresence>
      <div id="feed-sentinel" className="h-1 w-full" aria-hidden />
    </div>
  );
}
