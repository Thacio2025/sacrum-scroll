"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const DURATION_SEC = 10;

export function BufferPause() {
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
      className="snap-item flex min-h-full w-full flex-col items-center justify-center gap-8 bg-batina px-6"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-liturgico"
      >
        <Heart className="h-14 w-14" strokeWidth={1.5} fill="currentColor" />
      </motion.div>
      <p className="font-garamond max-w-sm text-center text-lg italic text-pedra">
        Um momento… as próximas imagens estão carregando.
      </p>
      <div className="font-cinzel text-4xl tabular-nums text-liturgico">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
