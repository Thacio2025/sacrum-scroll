"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import type { MusicTrack } from "@/data/music-pool";
import { getRandomMusic, getRandomMusicExcluding } from "@/data/music-pool";

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  playRandom: () => void;
  audioElement: HTMLAudioElement | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5); // Volume padrão: 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Criar elemento de áudio uma vez
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const audio = new Audio();
    audio.loop = false; // Não repetir: ao terminar, tocar outra faixa
    audio.preload = "auto";
    
    audioRef.current = audio;

    // Event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      // Ao terminar a faixa, tocar outra aleatória (diferente da que acabou)
      setCurrentTrack((prev) => {
        const next = getRandomMusicExcluding(prev?.id ?? null);
        if (next && audioRef.current) {
          audioRef.current.src = next.url;
          audioRef.current.play().catch(() => {});
          return next;
        }
        return prev;
      });
    };
    const handleError = (e: ErrorEvent) => {
      console.error("[MusicContext] Erro ao carregar áudio:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError as EventListener);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError as EventListener);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Atualizar volume quando mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track?: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    const trackToPlay = track ?? currentTrack ?? getRandomMusic();
    if (!trackToPlay) return;

    // Se for uma nova música, trocar a fonte
    if (trackToPlay.id !== currentTrack?.id) {
      audio.src = trackToPlay.url;
      setCurrentTrack(trackToPlay);
    }

    audio.play().catch((error) => {
      console.error("[MusicContext] Erro ao reproduzir:", error);
      setIsPlaying(false);
    });
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const playRandom = () => {
    const randomTrack = getRandomMusicExcluding(currentTrack?.id ?? null);
    if (randomTrack) {
      play(randomTrack);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        play,
        pause,
        togglePlay,
        setVolume,
        playRandom,
        audioElement: audioRef.current,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic deve ser usado dentro de um MusicProvider");
  }
  return context;
}
