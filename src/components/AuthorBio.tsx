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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-bio-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-pedra/20 bg-batina p-6 shadow-xl -translate-x-1/2 -translate-y-1/2"
            style={{
              maxWidth: "min(28rem, calc(100vw - 2rem))",
              maxHeight: "calc(100dvh - 2rem)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-pedra/10 pb-3">
              <h2 id="author-bio-title" className="font-cinzel text-xl font-medium tracking-wide text-liturgico">
                {author}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded p-1 text-pedra/70 transition hover:bg-white/10 hover:text-pedra"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <p
                className="font-cormorant text-xs text-pedra/80"
                style={{ fontVariant: "small-caps" }}
              >
                {CATEGORY_LABELS[category]}
                {century && ` · ${century}`}
              </p>
              {bio ? (
                <p className="mt-4 font-garamond text-sm leading-relaxed text-pedra">
                  {bio}
                </p>
              ) : (
                <p className="mt-4 font-garamond text-sm italic text-pedra/70">
                  Biografia em preparação.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
