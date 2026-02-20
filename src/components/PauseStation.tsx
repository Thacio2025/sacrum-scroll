"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const DURATION_SEC = 30;

/** Jaculatórias — orações breves para as telas de pausa (coração). */
const JACULATORIAS = [
  "Jesus, manso e humilde de coração, fazei o meu coração semelhante ao vosso.",
  "Senhor meu e Deus meu!",
  "Jesus, eu confio em Vós.",
  "Ó meu Jesus, misericórdia!",
  "Coração de Jesus, fonte de vida e de santidade, tende piedade de nós.",
  "Maria, Mãe de graça, Mãe de misericórdia, defendei-nos do inimigo.",
  "Senhor, que eu veja, que eu queira o que Vós quereis.",
  "Vinde, Espírito Santo, enchei os corações dos vossos fiéis.",
  "Silêncio. Adore ao Senhor em seu coração.",
  "Jesus, Maria, José.",
  "Bendito seja Deus. Bendito seja o seu santo Nome.",
  "Ó sangue e água que jorrastes do Coração de Jesus, eu confio em Vós.",
  "Meu Deus e meu tudo.",
  "Ó bom Jesus, ouvi-me. Dentro das chagas, escondei-me.",
  "Que a paz do Senhor esteja sempre convosco.",
];

export function PauseStation() {
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SEC);
  const jaculatoria = useMemo(
    () => JACULATORIAS[Math.floor(Math.random() * JACULATORIAS.length)]!,
    []
  );

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
        {jaculatoria}
      </p>
      <div className="font-cinzel text-4xl tabular-nums text-liturgico">
        {secondsLeft > 0 ? `${secondsLeft}s` : "—"}
      </div>
    </motion.section>
  );
}
