"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getAuthorCentury, getAuthorBio } from "@/data/authors";
import type { ContentCategory } from "@/types/content";

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  patristic: "Patrística",
  scholastic: "Escolástica",
  mystic: "Mística",
  liturgy: "Liturgia",
  scripture: "Escritura",
};

export interface AuthorBioProps {
  author: string;
  category: ContentCategory;
  isOpen: boolean;
  onClose: () => void;
}

export function AuthorBio({ author, category, isOpen, onClose }: AuthorBioProps) {
  const century = getAuthorCentury(author);
  const bio = getAuthorBio(author);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Toque fora fecha; overlay escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
          />
          {/* Bottom sheet: quase toda a largura, bordas pequenas */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-bio-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed bottom-0 left-2 right-2 z-50 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-2xl border border-pedra/20 border-b-0 bg-batina shadow-2xl sm:left-4 sm:right-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Área rolável: cabeçalho fixo + conteúdo com scroll */}
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Cabeçalho: nome + botão fechar bem visível */}
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-pedra/15 px-5 pb-4 pt-5">
                <h2
                  id="author-bio-title"
                  className="font-cinzel text-xl font-semibold tracking-wide text-liturgico"
                >
                  {author}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg border border-pedra/25 bg-batina/80 p-2 text-pedra/90 transition hover:bg-white/10 hover:text-pedra"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
              {/* Conteúdo com scroll suave */}
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <p
                  className="font-cormorant text-xs font-medium tracking-widest text-pedra/85"
                  style={{ fontVariant: "small-caps" }}
                >
                  {CATEGORY_LABELS[category]}
                  {century && ` · ${century}`}
                </p>
                <div className="mt-5 border-t border-pedra/10 pt-5">
                  {bio ? (
                    <p className="font-garamond text-base leading-loose text-pedra/95">
                      {bio}
                    </p>
                  ) : (
                    <p className="font-garamond text-base italic leading-loose text-pedra/75">
                      Biografia em preparação.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
