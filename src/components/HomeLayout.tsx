"use client";

import { usePresentation } from "@/contexts/PresentationContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { Header } from "./Header";
import { HeaderLinksBar } from "./HeaderLinksBar";
import { LiturgicalBanner } from "./LiturgicalBanner";
import { Feed } from "./Feed";
import { MusicPlayer } from "./MusicPlayer";
import { X } from "lucide-react";

const INSTAGRAM = "https://www.instagram.com/professor_thacio";

export function HomeLayout() {
  const { presentationMode, setPresentationMode } = usePresentation();

  return (
    <CategoryProvider>
    <>
      <main className={`relative flex h-screen-feed flex-col overflow-hidden ${!presentationMode ? "pt-[calc(3.75rem+env(safe-area-inset-top,0px))]" : ""}`}>
        {!presentationMode && <Header />}
        {!presentationMode && <HeaderLinksBar />}
        {!presentationMode && <LiturgicalBanner />}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Feed />
        </div>
        {!presentationMode && <MusicPlayer />}
      </main>

      {/* Modo apresentação: assinatura fixa + botão Sair */}
      {presentationMode && (
        <>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed left-1/2 z-40 -translate-x-1/2 font-garamond text-sm text-pedra/80 hover:text-liturgico transition"
            style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0))" }}
            aria-label="@professor_thacio no Instagram"
          >
            @professor_thacio
          </a>
          <button
            type="button"
            onClick={() => setPresentationMode(false)}
            className="fixed right-4 z-40 flex items-center gap-2 rounded border border-pedra/30 bg-batina/80 px-3 py-2 font-garamond text-xs text-pedra/90 backdrop-blur-sm transition hover:border-pedra/50 hover:bg-batina hover:text-pedra"
            style={{ top: "calc(1rem + env(safe-area-inset-top, 0))" }}
            aria-label="Sair do modo apresentação"
            title="Sair do modo apresentação"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            Sair
          </button>
        </>
      )}
    </>
    </CategoryProvider>
  );
}
