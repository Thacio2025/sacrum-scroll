"use client";

import { motion } from "framer-motion";
import type { QuoteCard as QuoteCardType } from "@/types/content";
import { Cross, Flame, BookOpen, Bird } from "lucide-react";

const categoryIcons = {
  patristic: Cross,
  scholastic: BookOpen,
  mystic: Flame,
  liturgy: Bird,
};

export function QuoteCard({
  card,
  index,
  accentColor,
}: {
  card: QuoteCardType;
  index: number;
  accentColor: string;
}) {
  const Icon = categoryIcons[card.category];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative flex min-h-[100vh] w-full flex-col justify-end overflow-hidden rounded-none snap-item"
    >
      {card.imageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${card.imageUrl})` }}
          />
          <div className="art-overlay absolute inset-0" />
        </>
      )}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-16 pt-24">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-center gap-2" style={{ color: accentColor }}>
            <Icon className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-cinzel text-sm uppercase tracking-widest">
              {card.author}
              {card.source && ` · ${card.source}`}
            </span>
          </div>
          <blockquote className="font-garamond text-2xl italic leading-relaxed text-pedra md:text-3xl">
            «{card.text}»
          </blockquote>
        </div>
      </div>
    </motion.article>
  );
}
