"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cross, Flame, BookOpen, Bird, Scroll } from "lucide-react";
import type { AuthorProfile } from "@/data/authors";
import type { ContentCategory } from "@/types/content";
import { getMainAuthors } from "@/data/authors";
import { getAuthorSafePrompt } from "@/data/author-prompts";

const POLLINATIONS_AVATAR_BASE = "https://image.pollinations.ai/prompt";

function getAuthorAvatarUrl(authorName: string): string | null {
  const prompt = getAuthorSafePrompt(authorName);
  if (!prompt) return null;
  const pathPrompt = encodeURIComponent(prompt);
  return `${POLLINATIONS_AVATAR_BASE}/${pathPrompt}?width=128&height=128&seed=${encodeURIComponent(authorName)}&nologo=true&model=flux`;
}

function AuthorAvatarCircle({
  authorName,
  Icon,
  isSelected,
  color,
  quoteCount,
}: {
  authorName: string;
  Icon: React.ElementType;
  isSelected: boolean;
  color: string;
  quoteCount: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const avatarUrl = getAuthorAvatarUrl(authorName);

  useEffect(() => {
    if (!avatarUrl) return;
    setImageLoaded(false);
    setImageError(false);
    
    // Tentar carregar a imagem
    const img = new Image();
    let timeoutId: ReturnType<typeof setTimeout>;
    
    img.onload = () => {
      clearTimeout(timeoutId);
      setImageLoaded(true);
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      setImageError(true);
    };
    
    // Timeout de 10 segundos - se não carregar, mostra ícone
    timeoutId = setTimeout(() => {
      if (!imageLoaded) {
        setImageError(true);
      }
    }, 10000);
    
    img.src = avatarUrl;
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [avatarUrl, imageLoaded]);

  const showAvatar = avatarUrl && imageLoaded && !imageError;

  return (
    <motion.div
      className={`h-14 w-14 rounded-full flex items-center justify-center border-2 transition-colors relative overflow-hidden ${
        isSelected ? "border-liturgico" : "border-pedra/30"
      }`}
      style={{
        backgroundColor: isSelected ? `${color}20` : "transparent",
        borderColor: isSelected ? color : undefined,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={authorName}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            showAvatar ? "opacity-100" : "opacity-0 absolute"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      {!showAvatar && (
        <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: isSelected ? color : "#a1a1aa" }} />
      )}
      {quoteCount > 1 && (
        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-liturgico text-[8px] font-bold text-batina flex items-center justify-center z-10">
          {quoteCount > 9 ? "9+" : quoteCount}
        </span>
      )}
    </motion.div>
  );
}

const categoryIcons = {
  patristic: Cross,
  scholastic: BookOpen,
  mystic: Flame,
  liturgy: Bird,
  scripture: Scroll,
};

const categoryColors: Record<ContentCategory, string> = {
  patristic: "#d4af37", // Dourado litúrgico
  scholastic: "#8b5cf6", // Roxo
  mystic: "#ef4444", // Vermelho
  liturgy: "#3b82f6", // Azul
  scripture: "#10b981", // Verde
};

interface AuthorProfileBarProps {
  selectedAuthor: string | null;
  onSelectAuthor: (author: string | null) => void;
}

export function AuthorProfileBar({ selectedAuthor, onSelectAuthor }: AuthorProfileBarProps) {
  const authors = getMainAuthors();

  return (
    <div className="sticky top-[66px] z-30 w-full overflow-x-auto bg-batina/95 backdrop-blur-sm border-b border-pedra/10 pb-2 pt-2">
      <div className="flex gap-3 px-4">
        {/* Botão "Todos" para limpar filtro */}
        <button
          type="button"
          onClick={() => onSelectAuthor(null)}
          className={`flex-shrink-0 flex flex-col items-center gap-1 transition-opacity ${
            selectedAuthor === null ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
          aria-label="Ver todos os autores"
        >
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center border-2 transition-colors ${
              selectedAuthor === null
                ? "border-liturgico bg-liturgico/20"
                : "border-pedra/30 bg-batina/50"
            }`}
          >
            <span className="font-cinzel text-xs text-pedra">TODOS</span>
          </div>
        </button>

        {/* Círculos de perfis dos autores */}
        {authors.map((author) => {
          const Icon = categoryIcons[author.category];
          const isSelected = selectedAuthor === author.name;
          const color = categoryColors[author.category];

          return (
            <button
              key={author.name}
              type="button"
              onClick={() => onSelectAuthor(isSelected ? null : author.name)}
              className="flex-shrink-0 flex flex-col items-center gap-1 transition-opacity hover:opacity-100"
              style={{ opacity: isSelected ? 1 : 0.7 }}
              aria-label={`Ver citações de ${author.name}`}
            >
              <AuthorAvatarCircle
                authorName={author.name}
                Icon={Icon}
                isSelected={isSelected}
                color={color}
                quoteCount={author.quoteCount}
              />
              <span
                className="font-garamond text-[10px] text-pedra/80 text-center max-w-[60px] truncate"
                style={{ color: isSelected ? color : undefined }}
              >
                {author.displayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
