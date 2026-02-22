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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-10 bg-batina px-6 snap-item"
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
        className="flex items-center gap-2 rounded border border-liturgico/40 bg-liturgico/10 px-4 py-2 font-garamond text-sm text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/20"
        aria-label="Tocar sino"
      >
        <Bell className="h-4 w-4" strokeWidth={1.5} />
        Tocar sino
      </button>

      {/* Cruz latina com animação de desenho (vertical + horizontal) */}
      <svg viewBox="0 0 100 100" className="h-24 w-auto text-liturgico md:h-32">
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

      <p className="font-garamond max-w-sm text-center text-xl italic text-pedra">
        {PAUSE_PHRASE}
      </p>
      <div className="font-cinzel text-4xl tabular-nums text-liturgico">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
