"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuoteCard } from "./QuoteCard";
import { PauseStation } from "./PauseStation";
import { BufferPause } from "./BufferPause";
import { WelcomeCard } from "./WelcomeCard";
import { getLiturgicalSeason } from "@/lib/liturgical-season";
import type { QuoteCard as QuoteCardType } from "@/types/content";
import { getQuoteAtIndex, POOL_SIZE } from "@/data/quotes-pool";

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

type FeedItem = "welcome" | "buffer" | "pause" | QuoteCardType;

const CARDS_BEFORE_BUFFER = 5; // após 5 cards, pausa de 15s para carregar imagens
const STORAGE_KEY = "sacrumscroll-position";
const REPORTED_STORAGE_KEY = "sacrumscroll-reported";
const LIKES_STORAGE_KEY = "sacrumscroll-likes";

/** Seed novo a cada abertura do app, para variar as imagens do feed. */
function getSessionSeed(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadReportedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(REPORTED_STORAGE_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function loadLikedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function buildFeedItems(page: number): FeedItem[] {
  const items: FeedItem[] = ["welcome"];
  const total = (page + 1) * (CARDS_BEFORE_PAUSE + 1);
  let quoteIndex = 0;
  let cardsInBlock = 0;
  for (let i = 0; i < total; i++) {
    if ((i + 1) % (CARDS_BEFORE_PAUSE + 1) === 0) {
      items.push("pause");
      cardsInBlock = 0;
    } else {
      if (cardsInBlock === CARDS_BEFORE_BUFFER) {
        items.push("buffer");
      }
      items.push(getQuoteAtIndex(quoteIndex));
      quoteIndex++;
      cardsInBlock++;
    }
  }
  return items;
}

export function Feed() {
  const [page, setPage] = useState(0);
  const [restoreScrollIndex, setRestoreScrollIndex] = useState<number | null>(null);
  const [cardsWithImages, setCardsWithImages] = useState<Record<string, string | null>>({});
  const [cardsImageLoading, setCardsImageLoading] = useState<Record<string, boolean>>({});
  const [cardsImageReady, setCardsImageReady] = useState<Record<string, boolean>>({});
  const [reportedCardIds, setReportedCardIds] = useState<Set<string>>(() => new Set());
  const [likedCardIds, setLikedCardIds] = useState<Set<string>>(() => new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accentColor = getAccentColor();
  /** Seed fixo por sessão: a cada vez que o usuário entra no app, as imagens mudam. */
  const sessionSeedRef = useRef<string>(getSessionSeed());

  const handleReportImage = useCallback(
    (cardId: string, imageUrl: string | null | undefined, author: string) => {
      setReportedCardIds((prev) => {
        const next = new Set(prev);
        next.add(cardId);
        try {
          localStorage.setItem(REPORTED_STORAGE_KEY, JSON.stringify([...next]));
        } catch {}
        return next;
      });
      fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, imageUrl: imageUrl ?? undefined, author }),
      }).catch(() => {});
    },
    []
  );

  const handleLike = useCallback((cardId: string) => {
    setLikedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      try {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const items = useMemo(() => buildFeedItems(page), [page]);

  // Restaurar posição, denúncias e curtidas ao reabrir o app
  useEffect(() => {
    if (typeof window === "undefined") return;
    setReportedCardIds(loadReportedIds());
    setLikedCardIds(loadLikedIds());
    const saved = localStorage.getItem(STORAGE_KEY);
    const idx = saved ? parseInt(saved, 10) : -1;
    if (idx > 0) {
      const neededPage = Math.max(0, Math.ceil(idx / 8) - 1);
      setPage(neededPage);
      setRestoreScrollIndex(idx);
    }
  }, []);

  // Scroll para a posição salva após os itens estarem renderizados
  useEffect(() => {
    const el = scrollRef.current;
    if (restoreScrollIndex == null || !el || items.length === 0) return;
    const targetIndex = Math.min(restoreScrollIndex, items.length - 1);
    const vh = window.innerHeight;
    const targetTop = targetIndex * vh;
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ top: targetTop, behavior: "auto" });
      setRestoreScrollIndex(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [items.length, restoreScrollIndex]);

  const handleImageLoad = useCallback((cardId: string) => {
    setCardsImageReady((prev) => ({ ...prev, [cardId]: true }));
  }, []);

  const checkAndRevertScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !items.length) return;
    const vh = window.innerHeight;
    const scrollTop = el.scrollTop;
    const index = Math.round(scrollTop / vh);
    const item = items[Math.min(index, items.length - 1)];
    if (!item || item === "welcome" || item === "buffer" || item === "pause") return;
    const card = item as QuoteCardType;
    const stillLoadingApi = cardsImageLoading[card.id];
    const hasImageUrl = cardsWithImages[card.id] != null && cardsWithImages[card.id] !== "";
    const imageLoadedInDom = cardsImageReady[card.id];
    const notReady = stillLoadingApi || (hasImageUrl && !imageLoadedInDom);
    if (notReady) {
      const prevIndex = Math.max(0, index - 1);
      el.scrollTo({ top: prevIndex * vh, behavior: "smooth" });
    }
  }, [items, cardsWithImages, cardsImageReady, cardsImageLoading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        checkAndRevertScroll();
        const vh = window.innerHeight;
        const index = Math.round(el.scrollTop / vh);
        if (index >= 0) localStorage.setItem(STORAGE_KEY, String(index));
      }, 180);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [checkAndRevertScroll]);

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
    const quoteCards = items.filter(
    (x): x is QuoteCardType => x !== "pause" && x !== "welcome" && x !== "buffer"
  );
    quoteCards.forEach((card) => {
      if (fetchedIds.current.has(card.id)) return;
      fetchedIds.current.add(card.id);
      setCardsImageLoading((prev) => ({ ...prev, [card.id]: true }));
      fetch(`/api/art?seed=${sessionSeedRef.current}-${card.id}&author=${encodeURIComponent(card.author)}&category=${card.category}`)
        .then((r) => {
          if (!r.ok) {
            console.error(`[Feed] API retornou erro ${r.status} para card ${card.id}`);
            throw new Error(`API error: ${r.status}`);
          }
          return r.json();
        })
        .then((data: { imageUrl?: string | null }) => {
          console.log(`[Feed] Card ${card.id} (${card.author}): imagem recebida`, data.imageUrl ? "SIM" : "NÃO");
          setCardsWithImages((prev) => ({ ...prev, [card.id]: data.imageUrl ?? null }));
          setCardsImageLoading((prev) => ({ ...prev, [card.id]: false }));
          if (!data.imageUrl) {
            setCardsImageReady((prev) => ({ ...prev, [card.id]: true }));
          }
        })
        .catch((error) => {
          console.error(`[Feed] Erro ao buscar imagem para card ${card.id} (${card.author}):`, error);
          setCardsWithImages((prev) => ({ ...prev, [card.id]: null }));
          setCardsImageLoading((prev) => ({ ...prev, [card.id]: false }));
          setCardsImageReady((prev) => ({ ...prev, [card.id]: true }));
        });
    });
  }, [items]);

  return (
    <div ref={scrollRef} className="snap-container h-screen overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) =>
          item === "welcome" ? (
            <WelcomeCard key="welcome" />
          ) : item === "buffer" ? (
            <BufferPause key={`buffer-${index}`} />
          ) : item === "pause" ? (
            <PauseStation key={`pause-${index}`} />
          ) : (
            <QuoteCard
              key={`${item.id}-${index}`}
              card={{
                ...item,
                imageUrl: reportedCardIds.has(item.id)
                  ? undefined
                  : (cardsWithImages[item.id] ?? undefined),
              }}
              index={index}
              accentColor={accentColor}
              imageLoading={reportedCardIds.has(item.id) ? false : (cardsImageLoading[item.id] ?? false)}
              onImageLoad={() => handleImageLoad(item.id)}
              onReportImage={() =>
                handleReportImage(item.id, cardsWithImages[item.id] ?? undefined, item.author)
              }
              isLiked={likedCardIds.has(item.id)}
              onLike={() => handleLike(item.id)}
            />
          )
        )}
      </AnimatePresence>
      <div id="feed-sentinel" className="h-1 w-full" aria-hidden />
    </div>
  );
}
