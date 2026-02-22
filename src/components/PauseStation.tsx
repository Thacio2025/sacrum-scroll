"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const DURATION_SEC = 30;

const PAUSE_PHRASE = "Silêncio. Adore ao Senhor em seu coração.";

/** Cruz latina: traço vertical + traço horizontal (para animação de desenho). */
const CROSS_VERTICAL = "M 50 8 L 50 92";
const CROSS_HORIZONTAL = "M 20 42 L 80 42";
const STROKE_LENGTH = 84;

const CIRCLE_R = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

export function PauseStation() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SEC);
  const bellRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const playBell = () => {
    try {
      if (bellRef.current) {
        bellRef.current.currentTime = 0;
        bellRef.current.play().catch(() => {});
      }
    } catch {
      // autoplay pode ser bloqueado
    }
  };

  const progress = (DURATION_SEC - secondsLeft) / DURATION_SEC;
  const circleOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="snap-item flex min-h-full w-full flex-col items-center justify-center gap-8 bg-batina px-6 py-10 sm:gap-10 md:gap-12"
    >
      {/* Sino (áudio só após gesto do usuário) */}
      <audio
        ref={bellRef}
        src="https://music.wixstatic.com/preview/e585d6_b944fae2f6cc48ae8d6f0b4d4d637de9-128.mp3"
        preload="none"
      />
      <button
        type="button"
        onClick={playBell}
        className="flex items-center gap-2 rounded border border-liturgico/40 bg-liturgico/10 px-4 py-2 font-garamond text-sm text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/20 sm:text-base"
        aria-label="Tocar sino"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
        Tocar sino
      </button>

      {/* Cruz + círculo de progresso (marca o tempo da pausa) */}
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-32 w-auto text-liturgico sm:h-40 md:h-48 lg:h-56">
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-pedra/20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={CIRCLE_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={circleOffset}
            transform="rotate(-90 50 50)"
            className="text-liturgico/70"
            transition={{ duration: 0.3 }}
          />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute h-20 w-auto text-liturgico sm:h-24 md:h-32 lg:h-40">
          <motion.path
            d={CROSS_VERTICAL}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={STROKE_LENGTH}
            initial={{ strokeDashoffset: STROKE_LENGTH }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.path
            d={CROSS_HORIZONTAL}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={60}
            initial={{ strokeDashoffset: 60 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <p className="font-garamond max-w-lg text-center text-2xl italic leading-relaxed text-pedra sm:max-w-xl sm:text-3xl sm:leading-relaxed md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed">
        {PAUSE_PHRASE}
      </p>

      <div className="font-cinzel text-3xl tabular-nums text-liturgico/80 sm:text-4xl md:text-5xl">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
