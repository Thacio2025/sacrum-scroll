"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";

export function WelcomeCard() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-8 bg-batina px-6 py-12 snap-item"
    >
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <BookOpen className="h-14 w-14 text-liturgico" strokeWidth={1.25} />
        <h1 className="font-cinzel text-3xl font-medium tracking-wide text-liturgico md:text-4xl">
          SacrumScroll
        </h1>
        <p className="font-cinzel text-lg uppercase tracking-[0.2em] text-pedra/80">
          O Feed da Tradição Católica
        </p>
      </motion.div>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-md text-center font-garamond text-lg italic leading-relaxed text-pedra"
      >
        Substitua o scroll mundano por ascese espiritual e beleza sacra. Patrística, Escolástica,
        Mística e Liturgia — uma tela por vez.
      </motion.p>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-sm text-center font-garamond text-base text-pedra/70"
      >
        A cada sete cards, uma pausa: <em>«Silêncio. Adore ao Senhor em seu coração.»</em>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-4 flex flex-col items-center gap-2"
      >
        <span className="font-cinzel text-xs uppercase tracking-widest text-pedra/60">
          Deslize para começar
        </span>
        <ChevronDown className="h-6 w-6 animate-bounce text-liturgico/80" strokeWidth={2} />
      </motion.div>
    </motion.section>
  );
}
