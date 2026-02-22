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
    <div className="shrink-0 min-h-[3rem] border-b border-pedra/10 bg-batina/60 backdrop-blur-sm">
      <div
        className="flex items-center justify-start gap-2 overflow-x-auto overflow-y-hidden px-3 py-2"
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
