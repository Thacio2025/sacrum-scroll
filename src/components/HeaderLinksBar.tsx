"use client";

const SITE_URL = "https://www.thaciosiqueira.com.br";
const INSTAGRAM = "https://www.instagram.com/professor_thacio";
const WHATSAPP_NUMBER = "5561996449753";
const DIRECAO_MENSAGEM = "Gostaria de saber mais sobre a Mentoria Filosófica e Teológica com o professor Thácio.";
const DIRECAO_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DIRECAO_MENSAGEM)}`;

export function HeaderLinksBar() {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-white/5 bg-batina px-4 py-1.5 text-center">
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="font-garamond text-xs text-pedra/90 hover:text-pedra"
      >
        @professor_thacio
      </a>
      <span className="text-pedra/50">·</span>
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-garamond text-xs text-pedra/90 hover:text-pedra"
      >
        thaciosiqueira.com.br
      </a>
      <span className="text-pedra/50">·</span>
      <a
        href={DIRECAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-garamond text-xs italic text-liturgico hover:text-liturgico/90"
      >
        Direção espiritual
      </a>
    </div>
  );
}
