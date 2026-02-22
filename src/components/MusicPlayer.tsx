"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music, SkipForward } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

export function MusicPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, setVolume, playRandom } = useMusic();
  const handleSkip = () => {
    playRandom();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };
  const [isMuted, setIsMuted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const previousVolumeRef = useRef(volume);

  useEffect(() => {
    if (isMuted) previousVolumeRef.current = volume;
  }, [isMuted, volume]);

  const handleClick = () => {
    if (!currentTrack) {
      playRandom();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
      return;
    }
    togglePlay();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const isMutedOrZero = isMuted || volume === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 z-30 sm:bottom-20"
    >
      <div className="flex items-center gap-1 rounded border border-pedra/20 bg-batina/35 p-2 shadow transition hover:border-pedra/40 hover:bg-batina/50">
        <button
          type="button"
          onClick={handleClick}
          className="flex shrink-0 rounded p-1 text-liturgico transition hover:bg-liturgico/10"
          aria-label={currentTrack ? (isPlaying ? "Pausar música" : "Reproduzir música") : "Tocar música"}
        >
          {!currentTrack ? (
            <Music className="h-4 w-4" strokeWidth={1.5} />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Play className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="flex shrink-0 rounded p-1 text-pedra/70 transition hover:text-pedra"
          aria-label="Próxima faixa"
        >
          <SkipForward className="h-4 w-4" strokeWidth={1.5} />
        </button>
        {currentTrack && (
          <button
            type="button"
            onClick={handleMuteToggle}
            className="flex shrink-0 rounded p-1 text-pedra/70 transition hover:text-pedra"
            aria-label={isMutedOrZero ? "Ativar som" : "Silenciar"}
          >
            {isMutedOrZero ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
      {showToast && (
        <div
          className="absolute bottom-full left-0 mb-2 rounded-full border border-pedra/20 bg-batina/90 px-3 py-1.5 font-garamond text-xs text-pedra shadow-lg whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          {currentTrack ? currentTrack.title : "Tocar música"}
        </div>
      )}
    </motion.div>
  );
}
