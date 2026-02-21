"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { QuoteCard as QuoteCardType } from "@/types/content";
import { Cross, Flame, BookOpen, Bird, Scroll, Flag, Heart, Share2, MessageCircle } from "lucide-react";

const DIRECAO_URL = "https://wa.me/5561996449753?text=" + encodeURIComponent("Gostaria de saber mais sobre direção espiritual profissional");

const categoryIcons = {
  patristic: Cross,
  scholastic: BookOpen,
  mystic: Flame,
  liturgy: Bird,
  scripture: Scroll,
};

/** Gera efeito de zoom variado por card (baseado no id) para não repetir em todas as fotos. */
function getZoomEffect(cardId: string) {
  const hash = cardId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const type = hash % 3; // 0: só zoom in, 1: só zoom out, 2: ciclo in-out
  const scaleMax = [1.08, 1.12, 1.1, 1.15][hash % 4]!; // mais visível
  const duration = 18 + (hash % 12); // 18–30 s
  if (type === 0) return { scale: [1, scaleMax] as const, duration, repeatType: "reverse" as const };
  if (type === 1) return { scale: [scaleMax, 1] as const, duration, repeatType: "reverse" as const };
  return { scale: [1, scaleMax, 1] as const, duration, repeatType: "reverse" as const };
}

export function QuoteCard({
  card,
  index,
  accentColor,
  imageLoading = false,
  onImageLoad,
  onReportImage,
  isLiked = false,
  onLike,
}: {
  card: QuoteCardType;
  index: number;
  accentColor: string;
  imageLoading?: boolean;
  onImageLoad?: () => void;
  onReportImage?: () => void;
  isLiked?: boolean;
  onLike?: () => void;
}) {
  const Icon = categoryIcons[card.category];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);
  const zoomEffect = useMemo(() => getZoomEffect(card.id), [card.id]);

  const showImageLoader = imageLoading || (!!card.imageUrl && !imageLoaded);

  const handleReportClick = () => {
    onReportImage?.();
    setShowReportToast(true);
    setTimeout(() => setShowReportToast(false), 1500);
  };

  const handleShare = async () => {
    const title = `${card.author}${card.source ? ` · ${card.source}` : ""}`;
    const text = `«${card.text}»`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
      }
    } catch {
      // usuário cancelou ou falha silenciosa
    }
  };

  useEffect(() => {
    if (!card.imageUrl) {
      onImageLoad?.();
      return;
    }
    setImageLoaded(false);
    const img = new Image();
    const notify = onImageLoad;
    
    // Timeout de 30 segundos para imagens da Pollinations (podem demorar)
    const timeoutId = setTimeout(() => {
      if (!imageLoaded) {
        console.warn(`[QuoteCard] Timeout carregando imagem: ${card.imageUrl?.substring(0, 50)}...`);
        setImageLoaded(true);
        notify?.();
      }
    }, 30000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      console.log(`[QuoteCard] Imagem carregada: ${card.imageUrl?.substring(0, 50)}...`);
      setImageLoaded(true);
      notify?.();
    };
    img.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error(`[QuoteCard] Erro ao carregar imagem: ${card.imageUrl}`, error);
      setImageLoaded(true);
      notify?.();
    };
    
    // Adicionar crossOrigin para evitar problemas de CORS
    img.crossOrigin = "anonymous";
    img.src = card.imageUrl;
    
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onImageLoad fora das deps evita loop (imagem sumindo/carregando)
  }, [card.imageUrl]);

  const hasNoImage = !card.imageUrl || card.imageUrl === null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative flex min-h-[100vh] w-full flex-col justify-center overflow-hidden rounded-none snap-item"
    >
      {/* Fundo sempre visível (batina #050505) */}
      <div className="absolute inset-0 bg-batina" aria-hidden />
      
      {card.imageUrl && (
        <>
          {/* Placeholder enquanto a imagem carrega */}
          <div
            className="absolute inset-0 bg-batina transition-opacity duration-500"
            style={{ opacity: imageLoaded ? 0 : 1 }}
            aria-hidden
          />
          {/* Tentar usar img tag diretamente para melhor compatibilidade */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full w-full origin-center"
              style={{ willChange: imageLoaded ? "transform" : "auto" }}
              initial={false}
              animate={imageLoaded ? { scale: zoomEffect.scale } : { scale: 1 }}
              transition={
                imageLoaded
                  ? {
                      duration: zoomEffect.duration,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: zoomEffect.repeatType,
                    }
                  : { duration: 0 }
              }
            >
              <img
                src={card.imageUrl}
                alt=""
                className="block h-full w-full object-cover"
                style={{ display: imageLoaded ? "block" : "none" }}
                crossOrigin="anonymous"
              />
            </motion.div>
          </motion.div>
          <div className="art-overlay absolute inset-0" />
        </>
      )}
      
      {/* Indicador de carregamento da imagem */}
      {showImageLoader && (
        <div
          className="absolute right-6 top-24 z-20 flex items-center gap-1.5"
          aria-label="Imagem carregando"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-liturgico/90" />
          <span className="font-garamond text-xs italic text-pedra/70">carregando…</span>
        </div>
      )}
      
      {/* Indicador quando não há imagem disponível */}
      {hasNoImage && !imageLoading && (
        <div
          className="absolute right-6 top-24 z-20 flex items-center gap-1.5 rounded border border-pedra/20 bg-batina/60 px-2 py-1"
          aria-label="Sem imagem disponível"
        >
          <span className="font-garamond text-xs italic text-pedra/60">sem imagem</span>
        </div>
      )}

      {/* Direita: três ícones em cima; abaixo, botão horizontal "Quero direção espiritual" */}
      <div className="absolute right-0 bottom-20 z-20 flex flex-col items-end gap-4 pr-2 md:top-[72%] md:-translate-y-1/2 md:bottom-auto">
        {onLike && (
          <button
            type="button"
            onClick={onLike}
            className="flex items-center justify-center p-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:scale-110 hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            aria-label={isLiked ? "Desfazer curtida" : "Curtir"}
          >
            <Heart
              className="h-5 w-5"
              strokeWidth={isLiked ? 1.2 : 2}
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
        )}
        {card.imageUrl && (
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center p-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:scale-110 hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            aria-label="Compartilhar"
          >
            <Share2 className="h-5 w-5" strokeWidth={2} />
          </button>
        )}
        {card.imageUrl && onReportImage && (
          <button
            type="button"
            onClick={handleReportClick}
            className="flex items-center justify-center p-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:scale-110 hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            aria-label="Denunciar imagem inapropriada"
          >
            <Flag className="h-5 w-5" strokeWidth={2} />
          </button>
        )}
        <a
          href={DIRECAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 whitespace-nowrap rounded border border-liturgico/40 bg-liturgico/15 px-3 py-2 font-garamond text-xs text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/25"
          aria-label="Quero direção espiritual"
        >
          <MessageCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          Quero direção espiritual
        </a>
      </div>

      {/* Toast breve ao clicar em Denunciar */}
      {showReportToast && (
        <div
          className="absolute bottom-44 left-1/2 z-30 -translate-x-1/2 rounded-full border border-pedra/20 bg-batina/90 px-3 py-1.5 font-garamond text-xs text-pedra shadow-lg md:bottom-52"
          role="status"
          aria-live="polite"
        >
          Denunciar imagem
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col justify-center px-16 py-8 text-center md:justify-end md:px-8 md:pb-20 md:pt-28 md:text-left -translate-y-6 md:-translate-y-8">
        <div className="mx-auto max-w-2xl">
          {/* Fundo leve atrás do texto; padding horizontal evita que a citação fique sob os botões */}
          <div className="rounded-lg bg-batina/50 backdrop-blur-[2px] px-4 py-8 md:px-8 md:py-10">
            <div className="mb-5 flex items-center justify-center gap-2 md:justify-start">
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} style={{ color: accentColor }} />
              <span className="font-cinzel text-base font-semibold uppercase tracking-widest text-white drop-shadow-md md:text-lg">
                {card.author}
                {card.source && ` · ${card.source}`}
              </span>
            </div>
            <blockquote className="font-garamond text-3xl font-medium italic leading-relaxed text-white drop-shadow-lg md:text-4xl md:leading-relaxed">
              «{card.text}»
            </blockquote>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
