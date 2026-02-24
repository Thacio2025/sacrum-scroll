"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

/** Largura a partir da qual consideramos "TV" para tipografia grande e centralizada */
const TV_BREAKPOINT_PX = 1920;
import type { QuoteCard as QuoteCardType, ContentCategory } from "@/types/content";
import { getAuthorCentury } from "@/data/authors";
import { getShareCardDataUrl } from "@/lib/share-card-image";
import { Cross, Flame, BookOpen, Bird, Scroll, Flag, Heart, Share2, Image as ImageIcon, MessageCircle, User, Loader2, X } from "lucide-react";

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  patristic: "Patrística",
  scholastic: "Escolástica",
  mystic: "Mística",
  liturgy: "Liturgia",
  scripture: "Escritura",
};

const DIRECAO_URL = "https://wa.me/5561996449753?text=" + encodeURIComponent("Gostaria de saber mais sobre a Mentoria Filosófica e Teológica com o professor Thácio.");

const categoryIcons = {
  patristic: Cross,
  scholastic: BookOpen,
  mystic: Flame,
  liturgy: Bird,
  scripture: Scroll,
};

type CardMotionType = "zoom" | "pan-right" | "pan-left" | "pan-up" | "pan-down";

/** Movimento variado por card: zoom in/out ou pan (esquerda↔direita, cima↔baixo). Duração mais lenta. */
function getCardMotion(cardId: string) {
  const hash = cardId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const types: CardMotionType[] = ["zoom", "pan-right", "pan-left", "pan-up", "pan-down"];
  const type = types[hash % types.length]!;
  const duration = 42 + (hash % 18); // 42–60 s, mais devagar
  const scaleMax = [1.06, 1.1, 1.08, 1.12][hash % 4]!;
  return { type, duration, scaleMax };
}

/** Garante que uma promise termine em até `ms` ms (senão falha com timeout). */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(id);
        resolve(value);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      }
    );
  });
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
  onOpenAuthorBio,
  isPresentationMode = false,
}: {
  card: QuoteCardType;
  index: number;
  accentColor: string;
  imageLoading?: boolean;
  onImageLoad?: () => void;
  onReportImage?: () => void;
  isLiked?: boolean;
  onLike?: () => void;
  onOpenAuthorBio?: () => void;
  /** Modo apresentação: só imagem e frase (sem botões) */
  isPresentationMode?: boolean;
}) {
  const Icon = categoryIcons[card.category];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);
  const cardMotion = useMemo(() => getCardMotion(card.id), [card.id]);

  /** Só aplicamos visual "TV" (fonte maior, centralizado) em telas grandes; celular horizontal mantém tipografia normal */
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsLargeScreen(window.innerWidth >= TV_BREAKPOINT_PX);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const isTV = isPresentationMode && isLargeScreen;

  /** Modo apresentação no celular: scroll na citação, card mais largo, contraste melhor */
  const isMobilePresentation = isPresentationMode && !isLargeScreen;

  const showImageLoader = imageLoading || (!!card.imageUrl && !imageLoaded);

  const handleReportClick = () => {
    onReportImage?.();
    setShowReportToast(true);
    setTimeout(() => setShowReportToast(false), 1500);
  };

  const [shareImageModalOpen, setShareImageModalOpen] = useState(false);
  const [shareImageStatus, setShareImageStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [shareImageCanShare, setShareImageCanShare] = useState(false);
  const [shareImageToast, setShareImageToast] = useState<"ok" | "error" | "ios" | null>(null);
  const shareImageFileRef = useRef<File | null>(null);
  const shareImageBlobUrlRef = useRef<string | null>(null);
  const preGeneratedFileRef = useRef<File | null>(null);
  const preGeneratedCardIdRef = useRef<string | null>(null);
  const shareCardContainerRef = useRef<HTMLElement | null>(null);

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

  /** Primeiro clique: abre o modal e gera a imagem (ou usa pré-gerada). O share/download acontece no segundo clique. */
  const handleShareImageClick = () => {
    setShareImageToast(null);
    if (preGeneratedCardIdRef.current === card.id && preGeneratedFileRef.current) {
      shareImageFileRef.current = preGeneratedFileRef.current;
      const canShare =
        typeof navigator !== "undefined" &&
        !!navigator.share &&
        !!navigator.canShare?.({ files: [preGeneratedFileRef.current] });
      setShareImageCanShare(canShare);
      setShareImageStatus("ready");
      setShareImageModalOpen(true);
      return;
    }
    setShareImageStatus("generating");
    setShareImageModalOpen(true);
    shareImageFileRef.current = null;
    (async () => {
      try {
        // html2canvas às vezes pode travar; colocamos timeout para não ficar gerando para sempre
        const dataUrl = await withTimeout(getShareCardDataUrl(card), 15000);
        let blob: Blob;
        try {
          blob = await (await fetch(dataUrl)).blob();
        } catch {
          const base64 = dataUrl.split(",")[1];
          const binary = atob(base64 ?? "");
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          blob = new Blob([bytes], { type: "image/png" });
        }
        const file = new File([blob], "sacrumscroll-card.png", { type: "image/png" });
        shareImageFileRef.current = file;
        preGeneratedFileRef.current = file;
        preGeneratedCardIdRef.current = card.id;
        const canShare =
          typeof navigator !== "undefined" &&
          !!navigator.share &&
          !!navigator.canShare?.({ files: [file] });
        setShareImageCanShare(canShare);
        setShareImageStatus("ready");
      } catch {
        setShareImageStatus("error");
      }
    })();
  };

  const closeShareImageModal = () => {
    setShareImageModalOpen(false);
    setShareImageStatus("idle");
    if (shareImageBlobUrlRef.current) {
      URL.revokeObjectURL(shareImageBlobUrlRef.current);
      shareImageBlobUrlRef.current = null;
    }
  };

  /** Segundo clique (user gesture): compartilhar com Web Share API. */
  const handleShareImageSecondClick = () => {
    const file = shareImageFileRef.current;
    if (!file) return;
    try {
      navigator.share({
        title: "SacrumScroll",
        text: `«${card.text}» — ${card.author}`,
        files: [file],
      });
      setShareImageToast("ok");
      setTimeout(() => setShareImageToast(null), 2500);
    } catch {
      // usuário cancelou
    }
    closeShareImageModal();
  };

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  /** Segundo clique (user gesture): baixar imagem. Em iOS, fallback: abrir em nova aba e avisar. */
  const handleDownloadImageClick = () => {
    const file = shareImageFileRef.current;
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sacrumscroll-card.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (isIOS) {
        setShareImageToast("ios");
        setTimeout(() => setShareImageToast(null), 4000);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        URL.revokeObjectURL(url);
      }
    }, 200);
    setShareImageToast(isIOS ? "ios" : "ok");
    if (!isIOS) setTimeout(() => setShareImageToast(null), 2500);
    closeShareImageModal();
  };

  /** Pré-geração: quando o card fica visível por 1s, gera a imagem em background para o primeiro clique já mostrar "pronto". */
  useEffect(() => {
    const el = shareCardContainerRef.current;
    if (!el || isPresentationMode) return;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          return;
        }
        timeoutId = setTimeout(() => {
          timeoutId = null;
          if (preGeneratedCardIdRef.current === card.id) return;
          getShareCardDataUrl(card)
            .then((dataUrl) =>
              fetch(dataUrl)
                .then((r) => r.blob())
                .catch(() => {
                  const base64 = dataUrl.split(",")[1];
                  const binary = atob(base64 ?? "");
                  const bytes = new Uint8Array(binary.length);
                  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                  return new Blob([bytes], { type: "image/png" });
                })
            )
            .then((blob) => {
              preGeneratedFileRef.current = new File([blob], "sacrumscroll-card.png", {
                type: "image/png",
              });
              preGeneratedCardIdRef.current = card.id;
            })
            .catch(() => {
              // silencioso; no primeiro clique gera normalmente
            });
        }, 1000);
      },
      { threshold: 0.3, rootMargin: "50px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [card.id, card, isPresentationMode]);

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

  // Garante que o texto não fique escondido por muito tempo:
  // se a imagem demorar, após ~300ms o texto aparece mesmo sem imageLoaded.
  useEffect(() => {
    setTextReady(false);
    const t = setTimeout(() => setTextReady(true), 300);
    return () => clearTimeout(t);
  }, [card.id, card.imageUrl]);

  const hasNoImage = !card.imageUrl || card.imageUrl === null;

  return (
    <motion.article
      ref={(el) => {
        shareCardContainerRef.current = el;
      }}
      layout
      initial={isPresentationMode ? false : { opacity: 0, y: 24 }}
      animate={isPresentationMode ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={isPresentationMode ? { duration: 0 } : { duration: 0.5, delay: index * 0.05 }}
      className="snap-item relative flex min-h-full w-full flex-col justify-center overflow-hidden rounded-none"
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
            transition={isPresentationMode ? { duration: 0 } : { duration: 0.5 }}
          >
            <div
              className={`origin-center ${
                isPresentationMode
                  ? "h-full w-full"
                  : cardMotion.type === "zoom"
                    ? "h-full w-full"
                    : "absolute left-[-6%] top-[-6%] h-[112%] w-[112%]"
              }`}
              style={
                imageLoaded && !isPresentationMode
                  ? ({
                      "--zoom-max": cardMotion.scaleMax,
                      animation: `card-${cardMotion.type} ${cardMotion.duration}s ease-in-out infinite`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <img
                src={card.imageUrl}
                alt=""
                className="block h-full w-full object-cover"
                style={{ display: imageLoaded ? "block" : "none" }}
                crossOrigin="anonymous"
                loading="lazy"
              />
            </div>
          </motion.div>
          <div className="art-overlay absolute inset-0" />
        </>
      )}
      
      {/* Indicador de carregamento da imagem — oculto no modo apresentação */}
      {!isPresentationMode && showImageLoader && (
        <div
          className="absolute right-6 top-24 z-20 flex items-center gap-1.5"
          aria-label="Imagem carregando"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-liturgico/90" />
          <span className="font-garamond text-xs italic text-pedra/70">carregando…</span>
        </div>
      )}
      
      {/* Indicador quando não há imagem disponível — oculto no modo apresentação */}
      {!isPresentationMode && hasNoImage && !imageLoading && (
        <div
          className="absolute right-6 top-24 z-20 flex items-center gap-1.5 rounded border border-pedra/20 bg-batina/60 px-2 py-1"
          aria-label="Sem imagem disponível"
        >
          <span className="font-garamond text-xs italic text-pedra/60">sem imagem</span>
        </div>
      )}

      {/* Direita: ícones e botões — ocultos no modo apresentação (só imagem e frase) */}
      {!isPresentationMode && (
      <div className="absolute right-0 bottom-16 z-20 flex flex-col items-end gap-3 pr-2 sm:bottom-20 sm:gap-4 md:bottom-auto md:top-[72%] md:-translate-y-1/2 md:pr-3">
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
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center p-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:scale-110 hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          aria-label="Compartilhar texto"
        >
          <Share2 className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={handleShareImageClick}
          className="flex items-center justify-center p-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:scale-110 hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          aria-label="Compartilhar como imagem"
        >
          <ImageIcon className="h-5 w-5" strokeWidth={2} />
        </button>
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
        {onOpenAuthorBio && (
          <button
            type="button"
            onClick={onOpenAuthorBio}
            className="flex items-center gap-1.5 whitespace-nowrap rounded border border-pedra/30 bg-batina/50 px-3 py-2 font-garamond text-xs text-pedra/90 transition hover:border-pedra/50 hover:bg-batina/70"
            aria-label="Sobre o autor"
          >
            <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            Sobre o autor
          </button>
        )}
        <a
          href={DIRECAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 whitespace-nowrap rounded border border-liturgico/40 bg-liturgico/15 px-3 py-2 font-garamond text-xs text-liturgico transition hover:border-liturgico/60 hover:bg-liturgico/25"
          aria-label="Quero Mentoria"
        >
          <MessageCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          Quero Mentoria
        </a>
      </div>
      )}

      {/* Toast breve ao clicar em Denunciar */}
      {showReportToast && (
        <div
          className="absolute bottom-40 left-1/2 z-30 -translate-x-1/2 rounded-full border border-pedra/20 bg-batina/90 px-3 py-1.5 font-garamond text-xs text-pedra shadow-lg sm:bottom-44 md:bottom-52"
          role="status"
          aria-live="polite"
        >
          Denunciar imagem
        </div>
      )}

      {/* Toast ao compartilhar como imagem */}
      {shareImageToast && (
        <div
          className={`absolute bottom-40 left-1/2 z-30 -translate-x-1/2 rounded-full border px-3 py-1.5 font-garamond text-xs shadow-lg sm:bottom-44 md:bottom-52 ${
            shareImageToast === "error"
              ? "border-red-900/40 bg-red-950/90 text-red-200"
              : shareImageToast === "ios"
                ? "border-amber-900/40 bg-amber-950/90 text-amber-200"
                : "border-pedra/20 bg-batina/90 text-pedra"
          }`}
          role="status"
          aria-live="polite"
        >
          {shareImageToast === "error"
            ? "Não foi possível gerar a imagem"
            : shareImageToast === "ios"
              ? "Se não baixou, abra a imagem e segure para salvar"
              : "Imagem pronta para compartilhar"}
        </div>
      )}

      {/* Modal compartilhar imagem em dois passos (user gesture no segundo clique) */}
      {shareImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-image-modal-title"
        >
          <div className="relative w-full max-w-sm rounded-xl border border-pedra/20 bg-batina/95 p-6 shadow-xl backdrop-blur-sm">
            <button
              type="button"
              onClick={closeShareImageModal}
              className="absolute right-3 top-3 rounded p-1 text-pedra/70 transition hover:bg-pedra/10 hover:text-pedra"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            {shareImageStatus === "generating" && (
              <>
                <p id="share-image-modal-title" className="mb-4 font-garamond text-lg text-pedra">
                  Gerando imagem…
                </p>
                <div className="flex justify-center py-6">
                  <Loader2 className="h-10 w-10 animate-spin text-dourado" strokeWidth={2} />
                </div>
              </>
            )}
            {shareImageStatus === "ready" && (
              <>
                <p id="share-image-modal-title" className="mb-4 font-garamond text-lg text-pedra">
                  Imagem pronta
                </p>
                <div className="flex flex-col gap-3">
                  {shareImageCanShare ? (
                    <button
                      type="button"
                      onClick={handleShareImageSecondClick}
                      className="flex items-center justify-center gap-2 rounded-lg border border-dourado/50 bg-dourado/20 px-4 py-3 font-garamond text-pedra transition hover:bg-dourado/30"
                    >
                      <Share2 className="h-5 w-5" strokeWidth={2} />
                      Compartilhar
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleDownloadImageClick}
                    className="flex items-center justify-center gap-2 rounded-lg border border-pedra/30 bg-pedra/10 px-4 py-3 font-garamond text-pedra transition hover:bg-pedra/20"
                  >
                    <ImageIcon className="h-5 w-5" strokeWidth={2} />
                    {shareImageCanShare ? "Baixar imagem" : "Baixar imagem"}
                  </button>
                </div>
              </>
            )}
            {shareImageStatus === "error" && (
              <>
                <p id="share-image-modal-title" className="mb-4 font-garamond text-lg text-red-200">
                  Não foi possível gerar a imagem
                </p>
                <button
                  type="button"
                  onClick={closeShareImageModal}
                  className="w-full rounded-lg border border-pedra/30 bg-pedra/10 px-4 py-3 font-garamond text-pedra"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Área do texto: tenta entrar junto com a imagem; se ela demorar, o texto aparece após um pequeno atraso */}
      <div
        className={`relative z-10 flex flex-1 flex-col justify-center -translate-y-4 md:-translate-y-8 ${
          isTV
            ? "text-center px-6 py-8 sm:px-10 sm:py-12 md:px-12 md:py-16 md:pt-20"
            : isMobilePresentation
              ? "min-h-0 text-center px-3 py-4 sm:px-4 sm:py-5"
              : "text-center md:justify-end md:text-left px-4 py-6 pr-24 pb-28 sm:px-6 sm:pr-32 sm:pb-28 md:px-8 md:pr-44 md:pb-24 md:pt-28"
        }`}
        style={{
          opacity: hasNoImage || imageLoaded || textReady ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          className={`mx-auto w-full ${isTV ? "max-w-4xl" : isMobilePresentation ? "max-w-3xl" : "max-w-2xl"}`}
        >
          {/* Caixa atrás das frases — no celular em apresentação: scroll interno e contraste maior */}
          <div
            className={
              isTV
                ? "rounded-lg bg-batina/30 backdrop-blur-[1px] px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-14"
                : isMobilePresentation
                  ? "max-h-[75dvh] overflow-y-auto rounded-lg bg-batina/50 backdrop-blur-[1px] px-4 py-5 sm:px-5 sm:py-6"
                  : "rounded-lg bg-batina/30 backdrop-blur-[1px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10"
            }
            style={
              isMobilePresentation
                ? { WebkitOverflowScrolling: "touch" as const }
                : undefined
            }
          >
            {/* Categoria · Século (small-caps) */}
            <p
              className={`font-cormorant font-medium tracking-widest text-pedra/90 [text-shadow:0_0_1px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.7)] ${
                isTV
                  ? "mb-4 text-sm sm:text-base md:mb-5 md:text-lg"
                  : "mb-3 text-xs md:mb-4"
              }`}
              style={{ fontVariant: "small-caps" }}
            >
              {CATEGORY_LABELS[card.category]}
              {(card.century ?? getAuthorCentury(card.author)) && (
                <> · {card.century ?? getAuthorCentury(card.author)}</>
              )}
            </p>
            <div
              className={`flex items-center gap-2 ${
                isTV
                  ? "mb-6 justify-center md:mb-8"
                  : "mb-5 justify-center md:justify-start"
              }`}
            >
              <Icon
                className={`shrink-0 ${isTV ? "h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" : "h-6 w-6"}`}
                style={{ color: accentColor }}
                strokeWidth={1.5}
              />
              <span
                className={`font-cinzel font-semibold uppercase tracking-widest text-white [text-shadow:0_0_1px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,0.8)] ${
                  isTV
                    ? "text-lg sm:text-xl md:text-2xl"
                    : "text-base md:text-lg"
                }`}
              >
                {card.author}
                {card.source && ` · ${card.source}`}
              </span>
            </div>
            <blockquote
              className={`font-garamond font-medium italic leading-relaxed text-white [text-shadow:0_0_2px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,0.7)] ${
                isTV
                  ? "text-4xl sm:text-5xl md:text-6xl md:leading-relaxed"
                  : "text-3xl md:text-4xl md:leading-relaxed"
              }`}
            >
              «{card.text}»
            </blockquote>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
