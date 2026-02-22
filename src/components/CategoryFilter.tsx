"use client";

import type { FilterCategory } from "@/data/quotes-pool";

/** 6 temas: Todos, Patrística, Escolástica, Mística, Liturgia, Escritura */
const CATEGORIES: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "patristic", label: "Patrística" },
  { value: "scholastic", label: "Escolástica" },
  { value: "mystic", label: "Mística" },
  { value: "liturgy", label: "Liturgia" },
  { value: "scripture", label: "Escritura" },
];

export interface CategoryFilterProps {
  value: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex shrink-0 flex-col border-b border-pedra/10 bg-batina/80 backdrop-blur-sm min-h-[3.5rem]">
      <div
        className="flex min-h-[3rem] flex-wrap items-center justify-center gap-2 px-3 py-2 md:gap-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map(({ value: v, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`min-h-[2.75rem] shrink-0 rounded-full border px-3 py-2 font-cormorant text-xs font-medium transition whitespace-nowrap touch-manipulation ${
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
    </div>
  );
}
