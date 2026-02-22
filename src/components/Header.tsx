"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Monitor, Home, ChevronDown } from "lucide-react";
import { usePresentation } from "@/contexts/PresentationContext";
import { useCategory } from "@/contexts/CategoryContext";
import type { FilterCategory } from "@/data/quotes-pool";

const SITE_URL = "https://www.thaciosiqueira.com.br";
const INSTAGRAM = "https://www.instagram.com/professor_thacio";
const WHATSAPP_NUMBER = "5561996449753";
const DIRECAO_MENSAGEM = "Gostaria de saber mais sobre a Mentoria Filosófica e Teológica com o professor Thácio.";
const DIRECAO_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DIRECAO_MENSAGEM)}`;

const CATEGORIES: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "patristic", label: "Patrística" },
  { value: "scholastic", label: "Escolástica" },
  { value: "mystic", label: "Mística" },
  { value: "liturgy", label: "Liturgia" },
  { value: "scripture", label: "Escritura" },
];

export function Header() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { presentationMode, togglePresentationMode } = usePresentation();
  const { selectedCategory, setSelectedCategory } = useCategory();

  useEffect(() => {
    if (!categoriesOpen) return;
    const close = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) setCategoriesOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [categoriesOpen]);

  useEffect(() => {
    setFullscreenSupported(typeof document.documentElement.requestFullscreen === "function");
  }, []);

  useEffect(() => {
    if (!fullscreenSupported) return;
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [fullscreenSupported]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <header className="safe-top fixed left-0 right-0 top-0 z-20 border-b border-white/5 bg-batina/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 py-2">
        {/* Primeira linha: botões à esquerda, título ao centro, tela cheia à direita — sempre por cima */}
        <div className="relative z-10 flex min-h-[2.5rem] w-full items-center justify-between px-3">
          <div ref={categoriesRef} className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={togglePresentationMode}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-pedra/30 bg-batina/80 text-pedra transition hover:border-pedra/50 hover:bg-pedra/10 hover:text-pedra"
              aria-label={presentationMode ? "Sair do modo apresentação" : "Modo apresentação (só imagem e frase)"}
              title={presentationMode ? "Sair do modo apresentação" : "Modo apresentação — ideal para TV ou celular"}
            >
              <Monitor className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setCategoriesOpen((o) => !o)}
              className="flex h-9 min-w-[3.5rem] items-center gap-1.5 rounded-md border-2 border-liturgico bg-liturgico/25 px-3 py-1.5 font-cormorant text-sm font-semibold text-liturgico shadow-sm transition hover:bg-liturgico/40"
              aria-expanded={categoriesOpen}
              aria-haspopup="listbox"
              aria-label={categoriesOpen ? "Fechar categorias" : "Abrir categorias (Home)"}
              title="Categorias do feed"
            >
              <Home className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="hidden sm:inline">Home</span>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} strokeWidth={2} />
            </button>
            {categoriesOpen && (
              <div
                role="listbox"
                className="absolute left-0 top-full z-50 mt-1 min-w-[10rem] max-h-[min(50vh,18rem)] overflow-y-auto rounded-lg border border-pedra/20 bg-batina shadow-xl"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {CATEGORIES.map(({ value: v, label }) => (
                  <button
                    key={v}
                    type="button"
                    role="option"
                    aria-selected={selectedCategory === v}
                    onClick={() => {
                      setSelectedCategory(v);
                      setCategoriesOpen(false);
                    }}
                    className={`flex w-full items-center justify-center border-b border-pedra/10 px-4 py-3 font-cormorant text-sm font-medium transition last:border-b-0 ${
                      selectedCategory === v ? "bg-liturgico/20 text-liturgico" : "text-pedra/90 hover:bg-pedra/10 hover:text-pedra"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h1 className="font-cinzel text-lg font-medium tracking-wide text-liturgico">
            SacrumScroll
          </h1>
          {fullscreenSupported ? (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-pedra/30 bg-batina/80 text-pedra transition hover:border-pedra/50 hover:bg-pedra/10 hover:text-pedra"
              aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Maximize2 className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
        {/* Segunda linha: links — com padding para não cobrir os botões da primeira linha */}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 px-16 text-center">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs text-pedra/90 hover:text-pedra"
          >
            @professor_thacio
          </a>
          <span className="text-pedra/40">·</span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs text-pedra/90 hover:text-pedra"
          >
            thaciosiqueira.com.br
          </a>
          <span className="text-pedra/50">·</span>
          <a
            href={DIRECAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs italic text-liturgico hover:text-liturgico/90"
          >
            Direção espiritual
          </a>
        </div>
      </div>
    </header>
  );
}
