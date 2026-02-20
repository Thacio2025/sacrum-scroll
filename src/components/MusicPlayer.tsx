"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

export function MusicPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, setVolume, playRandom } = useMusic();
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(volume);

  useEffect(() => {
    if (isMuted) previousVolumeRef.current = volume;
  }, [isMuted, volume]);

  const handleClick = () => {
    if (!currentTrack) {
      playRandom();
      return;
    }
    togglePlay();
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
      <div className="flex items-center gap-1.5 rounded border border-pedra/20 bg-batina/35 px-2 py-1.5 shadow transition hover:border-pedra/40 hover:bg-batina/50">
        <button
          type="button"
          onClick={handleClick}
          className="flex shrink-0 rounded p-1 text-liturgico transition hover:bg-liturgico/10"
          aria-label={currentTrack ? (isPlaying ? "Pausar música" : "Reproduzir música") : "Tocar música"}
        >
          {!currentTrack ? (
            <Music className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : isPlaying ? (
            <Pause className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <Play className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </button>
        <span className="font-garamond text-xs text-pedra/70 min-w-0 max-w-[100px] truncate">
          {currentTrack ? currentTrack.title : "Tocar música"}
        </span>
        {currentTrack && (
          <button
            type="button"
            onClick={handleMuteToggle}
            className="flex shrink-0 rounded p-1 text-pedra/70 transition hover:text-pedra"
            aria-label={isMutedOrZero ? "Ativar som" : "Silenciar"}
          >
            {isMutedOrZero ? (
              <VolumeX className="h-3.5 w-3.5" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
