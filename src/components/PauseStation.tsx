"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const DURATION_SEC = 30;

export function PauseStation() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SEC);

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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-8 bg-batina px-6 snap-item"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="text-liturgico"
      >
        <Heart className="h-16 w-16" strokeWidth={1.5} fill="currentColor" />
      </motion.div>
      <p className="font-garamond max-w-sm text-center text-xl italic text-pedra">
        Silêncio. Adore ao Senhor em seu coração.
      </p>
      <div className="font-cinzel text-4xl tabular-nums text-liturgico">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
