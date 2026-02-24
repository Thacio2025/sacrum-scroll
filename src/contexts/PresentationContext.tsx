"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

// Wake Lock simples para tentar manter a tela ligada em modo apresentação / tela cheia
let screenWakeLock: any | null = null;

export async function ensureScreenWakeLock() {
  try {
    if (typeof navigator === "undefined") return;
    const nav = navigator as any;
    if (!nav.wakeLock?.request) return;
    if (screenWakeLock) return;
    const lock = await nav.wakeLock.request("screen");
    screenWakeLock = lock;
    lock.addEventListener?.("release", () => {
      screenWakeLock = null;
    });
  } catch {
    // Falha silenciosa: dispositivo/navegador pode não suportar ou negar o lock
  }
}

export async function releaseScreenWakeLock() {
  try {
    if (!screenWakeLock) return;
    await screenWakeLock.release?.();
  } catch {
    // ignore
  } finally {
    screenWakeLock = null;
  }
}

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
        document.documentElement.requestFullscreen?.()
          .then(() => {
            void ensureScreenWakeLock();
          })
          .catch(() => {});
      } else if (!next && typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen?.();
        void releaseScreenWakeLock();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPresentationMode(false);
        void releaseScreenWakeLock();
      }
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
