"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BookOpen, BookMarked } from "lucide-react";

const CONVERSION_CARD_BASE =
  "snap-item relative flex min-h-full w-full flex-col items-center justify-center overflow-hidden rounded-none border border-liturgico/20 bg-batina/95 px-4 py-8 sm:px-6 sm:py-10";

/** Tag pequena no canto superior para distinguir dos cards de citação */
function ConversionTag() {
  return (
    <span
      className="absolute right-4 top-4 rounded border border-liturgico/30 bg-liturgico/10 px-2 py-0.5 font-cormorant text-[10px] font-medium uppercase tracking-wider text-liturgico/90"
      style={{ fontVariant: "small-caps" }}
    >
      Para você
    </span>
  );
}

/** Botão CTA dourado, igual ao Quero Mentoria: min 48px altura para toque */
function ConversionCta({
  href,
  children,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 flex min-h-[48px] min-w-[48px] items-center justify-center rounded border border-liturgico/40 bg-liturgico/15 px-5 py-3 font-garamond text-sm font-medium text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/25 sm:min-h-[48px] sm:px-6 sm:py-3"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

/** CARD 1 — Captura de Lista WhatsApp (a cada 12 citações) */
export function WhatsAppCard() {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={CONVERSION_CARD_BASE}
    >
      <ConversionTag />
      <Bell className="mb-4 h-12 w-12 shrink-0 text-liturgico/90 sm:h-14 sm:w-14" strokeWidth={1.25} />
      <h2 className="font-cinzel text-center text-xl font-semibold tracking-wide text-liturgico sm:text-2xl">
        Receba citações diárias no WhatsApp
      </h2>
      <p className="mt-2 max-w-md text-center font-garamond text-sm leading-relaxed text-pedra/90 sm:text-base">
        Entre no grupo de partilha da Tradição Católica. Gratuito, sem spam.
      </p>
      <ConversionCta href="https://chat.whatsapp.com/C29NnKMbSbHBnLMiXhitvB?mode=gi_t" ariaLabel="Entrar no grupo WhatsApp">
        Entrar no Grupo
      </ConversionCta>
    </motion.section>
  );
}

const DISCOVERY_VERSIONS = [
  {
    title: "A Tradição Católica em quadrinhos",
    subtitle:
      "Conheça o Thacinho — o gibi mensal que explica os ensinamentos dos Padres do Deserto de forma simples e visual.",
    cta: "Ler o Gibi #1 (grátis)",
    href: "https://online.fliphtml5.com/ssztx/bxoe/",
  },
  {
    title: "A Tradição Católica em quadrinhos",
    subtitle:
      "O Thacinho está de volta. Mais uma aventura espiritual com os Padres do Deserto — em formato gibi, direto ao ponto.",
    cta: "Ler o Gibi #2 (grátis)",
    href: "https://online.fliphtml5.com/ssztx/Thacinho-2/",
  },
  {
    title: "A Tradição Católica em quadrinhos",
    subtitle:
      "Espiritualidade, humor e sabedoria milenar. O Thacinho #3 está disponível gratuitamente.",
    cta: "Ler o Gibi #3 (grátis)",
    href: "https://online.fliphtml5.com/ssztx/Thacinho-3/",
  },
  {
    title: "Mais de 60 ebooks e cursos",
    subtitle:
      "Tomismo, espiritualidade, filosofia e muito mais. Explore a biblioteca completa do Professor Thácio.",
    cta: "Ver Biblioteca Completa",
    href: "https://www.thaciosiqueira.com.br",
  },
] as const;

const STORAGE_KEY_DISCOVERY_COUNT = "sacrumscroll-discovery-count";

/** Retorna a versão do card Descoberta (0–3) e incrementa o contador no localStorage */
export function getDiscoveryVersion(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISCOVERY_COUNT);
    const count = raw ? parseInt(raw, 10) : 0;
    const next = count + 1;
    localStorage.setItem(STORAGE_KEY_DISCOVERY_COUNT, String(next));
    return (next - 1) % 4;
  } catch {
    return 0;
  }
}

/** CARD 2 — Descoberta de Conteúdo (a cada 20 citações), rotativo em 4 versões */
export function DiscoveryCard() {
  const [version] = useState(() => getDiscoveryVersion());
  const v = DISCOVERY_VERSIONS[version % 4] ?? DISCOVERY_VERSIONS[0]!;
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={CONVERSION_CARD_BASE}
    >
      <ConversionTag />
      <BookMarked className="mb-4 h-12 w-12 shrink-0 text-liturgico/90 sm:h-14 sm:w-14" strokeWidth={1.25} />
      <h2 className="font-cinzel text-center text-xl font-semibold tracking-wide text-liturgico sm:text-2xl">
        {v.title}
      </h2>
      <p className="mt-2 max-w-md text-center font-garamond text-sm leading-relaxed text-pedra/90 sm:text-base">
        {v.subtitle}
      </p>
      <ConversionCta href={v.href} ariaLabel={v.cta}>
        {v.cta}
      </ConversionCta>
    </motion.section>
  );
}

/** CARD 3 — Ebook Padres do Deserto (a cada 30 citações) */
export function EbookCard() {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={CONVERSION_CARD_BASE}
    >
      <ConversionTag />
      <BookOpen className="mb-4 h-12 w-12 shrink-0 text-liturgico/90 sm:h-14 sm:w-14" strokeWidth={1.25} />
      <h2 className="font-cinzel text-center text-xl font-semibold tracking-wide text-liturgico sm:text-2xl">
        A Sabedoria do Deserto em suas mãos
      </h2>
      <p className="mt-2 max-w-md text-center font-garamond text-sm leading-relaxed text-pedra/90 sm:text-base">
        Leia o ebook completo dos Padres do Deserto e aprofunde-se na tradição que alimenta este feed.
      </p>
      <ConversionCta href="https://online.fliphtml5.com/ssztx/xdha/" ariaLabel="Acessar o Ebook">
        Acessar o Ebook
      </ConversionCta>
    </motion.section>
  );
}
