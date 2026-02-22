"use client";

import { useEffect, useState } from "react";
import { getLiturgicalSeason } from "@/lib/liturgical-season";
import type { LiturgicalSeason } from "@/types/content";

const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  ordinary: "Tempo Comum",
  advent: "Advento",
  christmas: "Tempo do Natal",
  lent: "Quaresma",
  passion: "Paixão (Semana Santa)",
  easter: "Tempo Pascal",
};

const SEASON_COLORS: Record<LiturgicalSeason, string> = {
  ordinary: "bg-green-800/40 text-green-200 border-green-600/40",
  advent: "bg-purple-900/40 text-purple-200 border-purple-600/40",
  christmas: "bg-slate-100/20 text-slate-200 border-slate-400/40",
  lent: "bg-purple-900/40 text-purple-200 border-purple-600/40",
  passion: "bg-red-900/40 text-red-200 border-red-600/40",
  easter: "bg-slate-100/20 text-slate-200 border-slate-400/40",
};

export function LiturgicalBanner() {
  const [season, setSeason] = useState<LiturgicalSeason>("ordinary");

  useEffect(() => {
    setSeason(getLiturgicalSeason());
  }, []);

  const label = SEASON_LABELS[season];
  const colors = SEASON_COLORS[season];

  return (
    <div
      className={`border-b px-3 py-1.5 text-center font-cormorant text-xs font-medium tracking-wide ${colors}`}
      role="status"
      aria-label={`Tempo litúrgico: ${label}`}
    >
      {label}
    </div>
  );
}
