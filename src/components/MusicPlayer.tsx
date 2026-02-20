"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

export function MusicPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, setVolume, playRandom } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(volume);

  // Salvar volume anterior quando mutar
  useEffect(() => {
    if (isMuted) {
      previousVolumeRef.current = volume;
    }
  }, [isMuted, volume]);

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Se não houver músicas disponíveis, mostrar botão para iniciar
  if (!currentTrack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-30"
      >
        <button
          type="button"
          onClick={playRandom}
          className="flex items-center gap-2 rounded-lg border border-liturgico/30 bg-batina/90 backdrop-blur-sm px-4 py-2.5 shadow-lg transition hover:bg-liturgico/10"
        >
          <Music className="h-4 w-4 text-liturgico" strokeWidth={1.5} />
          <span className="font-garamond text-sm text-liturgico">Tocar música</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-30"
    >
      <div className="flex items-center gap-2 rounded-lg border border-pedra/20 bg-batina/90 backdrop-blur-sm shadow-lg">
        {/* Botão principal de play/pause */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center justify-center p-2.5 text-liturgico transition hover:bg-liturgico/10"
          aria-label={isPlaying ? "Pausar música" : "Reproduzir música"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>

        {/* Informações da música */}
        <div className="flex min-w-0 flex-1 flex-col px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <Music className="h-3 w-3 shrink-0 text-liturgico/70" strokeWidth={1.5} />
            <p className="truncate font-garamond text-xs text-pedra">
              {currentTrack.title}
            </p>
          </div>
          {currentTrack.artist && (
            <p className="truncate font-garamond text-[10px] italic text-pedra/60">
              {currentTrack.artist}
            </p>
          )}
        </div>

        {/* Controles de volume */}
        <div className="flex items-center gap-1 pr-2">
          <button
            type="button"
            onClick={handleMuteToggle}
            className="flex items-center justify-center p-1.5 text-pedra/70 transition hover:text-pedra"
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 100, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1 w-20 cursor-pointer appearance-none rounded bg-pedra/20 accent-liturgico"
                  aria-label="Volume"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center p-1 text-pedra/50 transition hover:text-pedra/70"
            aria-label={isExpanded ? "Recolher controles" : "Expandir controles"}
          >
            <div className="h-3 w-3 rounded border border-current" />
          </button>
        </div>
      </div>

      {/* Botão para tocar música aleatória (opcional, pode ser removido) */}
      {!isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={playRandom}
          className="mt-2 w-full rounded border border-liturgico/30 bg-liturgico/10 px-3 py-1.5 font-garamond text-xs text-liturgico transition hover:bg-liturgico/20"
        >
          Tocar música
        </motion.button>
      )}
    </motion.div>
  );
}
