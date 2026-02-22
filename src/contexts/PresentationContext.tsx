"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface PresentationContextValue {
  presentationMode: boolean;
  setPresentationMode: (value: boolean) => void;
  togglePresentationMode: () => void;
}

const PresentationContext = createContext<PresentationContextValue | null>(null);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false);

  const togglePresentationMode = useCallback(() => {
    setPresentationMode((prev) => {
      const next = !prev;
      if (next && typeof document !== "undefined" && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else if (!next && typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setPresentationMode(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresentationMode(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const value: PresentationContextValue = {
    presentationMode,
    setPresentationMode,
    togglePresentationMode,
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation(): PresentationContextValue {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error("usePresentation must be used within PresentationProvider");
  return ctx;
}
