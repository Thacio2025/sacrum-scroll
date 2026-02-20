"use client";

const SITE_URL = "https://www.thaciosiqueira.com.br";
const INSTAGRAM = "https://www.instagram.com/professor_thacio";
const WHATSAPP_NUMBER = "5561996449753";
const DIRECAO_MENSAGEM = "Gostaria de saber mais sobre direção espiritual profissional";
const DIRECAO_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DIRECAO_MENSAGEM)}`;

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/5 bg-batina/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-1 py-2">
        <h1 className="font-cinzel text-lg font-medium tracking-wide text-liturgico">
          SacrumScroll
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs text-pedra/70 hover:text-pedra"
          >
            @professor_thacio
          </a>
          <span className="text-pedra/40">·</span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs text-pedra/70 hover:text-pedra"
          >
            thaciosiqueira.com.br
          </a>
          <span className="text-pedra/40">·</span>
          <a
            href={DIRECAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-garamond text-xs italic text-liturgico/90 hover:text-liturgico"
          >
            Direção espiritual
          </a>
        </div>
      </div>
    </header>
  );
}
