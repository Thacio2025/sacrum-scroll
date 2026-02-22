"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle, PauseCircle } from "lucide-react";
import { QuoteCard } from "./QuoteCard";
import { PauseStation } from "./PauseStation";
import { BufferPause } from "./BufferPause";
import { WelcomeCard } from "./WelcomeCard";
import { AuthorBio } from "./AuthorBio";
import { DailyQuoteBar } from "./DailyQuoteBar";
import { getLiturgicalSeason } from "@/lib/liturgical-season";
import type { QuoteCard as QuoteCardType } from "@/types/content";
import { getFilteredQuoteAtIndex, type FilterCategory } from "@/data/quotes-pool";
import type { ContentCategory } from "@/types/content";
import { usePresentation } from "@/contexts/PresentationContext";
import { useCategory } from "@/contexts/CategoryContext";

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
const AUTO_ADVANCE_INTERVAL_MS = 20000; // 20 segundos por card quando "passar sozinho"
const STORAGE_KEY = "sacrumscroll-position";
const REPORTED_STORAGE_KEY = "sacrumscroll-reported";
const LIKES_STORAGE_KEY = "sacrumscroll-likes";

/** Seed novo a cada abertura do app, para variar as imagens do feed. Nunca persiste em localStorage. */
function getSessionSeed(): string {
  const timePart = Date.now().toString(36);
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 15);
  return `${timePart}-${randomPart}`;
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

function buildFeedItems(page: number, category: FilterCategory): FeedItem[] {
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
      items.push(getFilteredQuoteAtIndex(category, quoteIndex));
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
  const [seedVersion, setSeedVersion] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [passToast, setPassToast] = useState<string | null>(null);
  const [authorBioOpen, setAuthorBioOpen] = useState<{ author: string; category: ContentCategory } | null>(null);
  const { selectedCategory } = useCategory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accentColor = getAccentColor();
  const { presentationMode } = usePresentation();
  /** Seed por visita: novo a cada abertura; em restauração (bfcache) renovamos e refetch. */
  const sessionSeedRef = useRef<string>(getSessionSeed());

  // Quando a página é restaurada do bfcache (ex.: voltou à aba), nova série de imagens
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      sessionSeedRef.current = getSessionSeed();
      fetchedIds.current = new Set();
      setCardsWithImages({});
      setCardsImageLoading({});
      setCardsImageReady({});
      setSeedVersion((v) => v + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // Passar frases sozinho: a cada N segundos avança para o próximo card
  useEffect(() => {
    if (!autoAdvance) {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current);
        autoAdvanceIntervalRef.current = null;
      }
      return;
    }
    const advance = () => {
      const el = scrollRef.current;
      if (!el || typeof window === "undefined") return;
      const vh = window.innerHeight;
      const scrollTop = el.scrollTop;
      const currentIndex = Math.round(scrollTop / vh);
      const maxIndex = Math.max(0, Math.floor(el.scrollHeight / vh) - 1);
      let nextIndex = Math.min(currentIndex + 1, maxIndex);
      // Se estamos no último card visível, carregar mais itens para não travar
      if (nextIndex <= currentIndex && currentIndex >= maxIndex) {
        setPage((p) => p + 1);
        return;
      }
      if (nextIndex > currentIndex) {
        const targetTop = Math.min(nextIndex * vh, el.scrollHeight - vh);
        el.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    };
    autoAdvanceIntervalRef.current = setInterval(advance, AUTO_ADVANCE_INTERVAL_MS);
    return () => {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current);
        autoAdvanceIntervalRef.current = null;
      }
    };
  }, [autoAdvance]);

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
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {
      // vibrate não suportado
    }
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

  const items = useMemo(() => buildFeedItems(page, selectedCategory), [page, selectedCategory]);

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

  // Só salva a posição no localStorage; não reverte o scroll (evita vai-e-volta e piscadas)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
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
  }, []);

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
  }, [items, seedVersion]);

  return (
    <>
      {authorBioOpen && (
        <AuthorBio
          author={authorBioOpen.author}
          category={authorBioOpen.category}
          isOpen={true}
          onClose={() => setAuthorBioOpen(null)}
        />
      )}
      {/* Área do feed: citação do dia → scroll (categorias no botão Home do header) */}
      <div className="flex min-h-0 flex-1 flex-col">
        {!presentationMode && <DailyQuoteBar />}
        <div ref={scrollRef} className="snap-container min-h-0 flex-1 overflow-y-auto h-full">
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
                  onOpenAuthorBio={() => setAuthorBioOpen({ author: item.author, category: item.category })}
                  isPresentationMode={presentationMode}
                />
              )
            )}
          </AnimatePresence>
          <div id="feed-sentinel" className="h-1 w-full" aria-hidden />
        </div>
      </div>

      {/* Botão: passar frases sozinho — oculto no modo apresentação */}
      {!presentationMode && (
      <div className="fixed left-4 z-30 sm:bottom-[9rem]" style={{ bottom: "calc(9rem + env(safe-area-inset-bottom, 0))" }}>
        <button
          type="button"
          onClick={() => {
            setAutoAdvance((on) => !on);
            setPassToast(autoAdvance ? "Parar" : "Passar sozinho");
            setTimeout(() => setPassToast(null), 1500);
          }}
          className={`flex items-center justify-center rounded border p-2 shadow transition ${
            autoAdvance
              ? "border-liturgico/40 bg-liturgico/15 text-liturgico hover:bg-liturgico/25"
              : "border-pedra/20 bg-batina/35 text-pedra/70 hover:border-pedra/40 hover:bg-batina/50 hover:text-pedra"
          }`}
          aria-label={autoAdvance ? "Parar de passar sozinho" : "Passar frases sozinho"}
          title={autoAdvance ? "Parar" : "Passar frases sozinho"}
        >
          {autoAdvance ? (
            <PauseCircle className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <PlayCircle className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
        {passToast && (
          <div
            className="absolute bottom-full left-0 mb-2 rounded-full border border-pedra/20 bg-batina/90 px-3 py-1.5 font-garamond text-xs text-pedra shadow-lg whitespace-nowrap"
            role="status"
            aria-live="polite"
          >
            {passToast}
          </div>
        )}
      </div>
      )}
    </>
  );
}
