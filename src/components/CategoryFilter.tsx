"use client";

import { useState, useRef, useEffect } from "react";
import { Home, ChevronDown } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  const currentLabel = CATEGORIES.find((c) => c.value === value)?.label ?? "Home";

  return (
    <div ref={containerRef} className="relative shrink-0 border-b border-pedra/10 bg-batina/80 backdrop-blur-sm">
      <div className="flex items-center justify-center px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[2.75rem] items-center gap-2 rounded-full border border-liturgico/40 bg-liturgico/10 px-4 py-2 font-cormorant text-sm font-medium text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/20"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={open ? "Fechar categorias" : "Abrir categorias"}
          title="Categorias do feed"
        >
          <Home className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="whitespace-nowrap">{currentLabel}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute left-2 right-2 top-full z-30 mt-1 max-h-[min(50vh,18rem)] overflow-y-auto rounded-lg border border-pedra/20 bg-batina shadow-xl"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map(({ value: v, label }) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={value === v}
              onClick={() => {
                onChange(v);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-center border-b border-pedra/10 px-4 py-3 font-cormorant text-sm font-medium transition last:border-b-0 ${
                value === v
                  ? "bg-liturgico/20 text-liturgico"
                  : "text-pedra/90 hover:bg-pedra/10 hover:text-pedra"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
