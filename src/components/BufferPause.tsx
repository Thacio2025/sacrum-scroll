"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const DURATION_SEC = 10;

const CIRCLE_R = 40;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

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

  const progress = (DURATION_SEC - secondsLeft) / DURATION_SEC;
  const circleOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="snap-item flex min-h-full w-full flex-col items-center justify-center gap-8 bg-batina px-6 py-10 sm:gap-10 [@media(orientation:landscape)_and_(max-height:500px)]:gap-3 [@media(orientation:landscape)_and_(max-height:500px)]:py-4 [@media(orientation:landscape)_and_(max-height:500px)]:px-4"
    >
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-28 w-auto text-liturgico sm:h-36 md:h-40 [@media(orientation:landscape)_and_(max-height:500px)]:h-20">
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
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute text-liturgico"
        >
          <Heart className="h-12 w-12 sm:h-14 sm:w-14 [@media(orientation:landscape)_and_(max-height:500px)]:h-8 [@media(orientation:landscape)_and_(max-height:500px)]:w-8" strokeWidth={1.5} fill="currentColor" />
        </motion.div>
      </div>
      <p className="font-garamond max-w-md text-center text-xl italic leading-relaxed text-pedra sm:max-w-lg sm:text-2xl md:text-3xl md:leading-relaxed [@media(orientation:landscape)_and_(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:500px)]:leading-snug">
        Um momento… as próximas imagens estão carregando.
      </p>
      <div className="font-cinzel text-3xl tabular-nums text-liturgico/80 sm:text-4xl md:text-5xl [@media(orientation:landscape)_and_(max-height:500px)]:text-xl">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
