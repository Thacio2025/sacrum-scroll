"use client";

import { useEffect } from "react";
import { getLiturgicalSeason } from "@/lib/liturgical-season";

export function LiturgicalTheme({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const season = getLiturgicalSeason();
    document.documentElement.setAttribute("data-season", season);
  }, []);

  return <>{children}</>;
}
