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
      className="fixed bottom-4 left-4 z-30"
    >
      <div className="flex items-center gap-1.5 rounded-lg border border-pedra/20 bg-batina/90 backdrop-blur-sm px-2.5 py-2 shadow-lg">
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center justify-center rounded-md p-2 text-liturgico transition hover:bg-liturgico/10"
          aria-label={currentTrack ? (isPlaying ? "Pausar música" : "Reproduzir música") : "Tocar música"}
        >
          {!currentTrack ? (
            <Music className="h-5 w-5" strokeWidth={1.5} />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
        <span className="font-garamond text-sm text-pedra min-w-0 max-w-[120px] truncate">
          {currentTrack ? currentTrack.title : "Tocar música"}
        </span>
        {currentTrack && (
          <button
            type="button"
            onClick={handleMuteToggle}
            className="ml-0.5 flex shrink-0 rounded-md p-1.5 text-pedra/70 transition hover:text-pedra"
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
    </motion.div>
  );
}
