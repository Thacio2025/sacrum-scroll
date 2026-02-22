"use client";

import type { ContentCategory } from "@/types/content";

const CATEGORIES: { value: ContentCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "patristic", label: "Patrística" },
  { value: "scholastic", label: "Escolástica" },
  { value: "mystic", label: "Mística" },
  { value: "liturgy", label: "Liturgia" },
  { value: "scripture", label: "Escritura" },
];

export interface CategoryFilterProps {
  value: ContentCategory | "all";
  onChange: (category: ContentCategory | "all") => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-pedra/10 bg-batina/60 px-3 py-2 backdrop-blur-sm">
      {CATEGORIES.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-full border px-3 py-1.5 font-cormorant text-xs font-medium transition ${
            value === v
              ? "border-liturgico/60 bg-liturgico/20 text-liturgico"
              : "border-pedra/20 bg-batina/40 text-pedra/80 hover:border-pedra/40 hover:text-pedra"
          }`}
          aria-pressed={value === v}
          aria-label={`Filtrar: ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
