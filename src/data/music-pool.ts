/**
 * Pool de músicas litúrgicas e católicas para o SacrumScroll.
 * 
 * Você pode adicionar URLs de músicas aqui. Elas podem ser:
 * - Links diretos para arquivos MP3/OGG/WAV hospedados
 * - Links do YouTube (será necessário usar uma API de conversão)
 * - Links de serviços de streaming (Spotify, SoundCloud, etc.)
 * 
 * Para adicionar suas próprias músicas:
 * 1. Coloque os arquivos de áudio na pasta `public/music/`
 * 2. Adicione o caminho relativo aqui (ex: "/music/gregorian-chant.mp3")
 * 3. Ou adicione URLs externas diretamente
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  category: "gregorian" | "polyphonic" | "hymn" | "meditation" | "liturgical";
}

export const MUSIC_POOL: MusicTrack[] = [
  {
    id: "music-1",
    title: "Música Litúrgica 1",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_1cc7b81cfc4d4b998517bc7c6ff2b2f1-128.mp3",
    category: "liturgical",
  },
  {
    id: "music-2",
    title: "Música Litúrgica 2",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_2cdd2d3b396544f7b5f9201c20ba2b70-128.mp3",
    category: "liturgical",
  },
  {
    id: "music-3",
    title: "Música Litúrgica 3",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_e68f8a5190a14ad884169252d321cb33-128.mp3",
    category: "liturgical",
  },
  {
    id: "music-4",
    title: "Música Litúrgica 4",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_00815613ad714150aebf9552005a767d-128.mp3",
    category: "liturgical",
  },
  {
    id: "music-5",
    title: "Música Litúrgica 5",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_03883e792a57419f8eb54f830a616bbf-128.mp3",
    category: "liturgical",
  },
  {
    id: "music-6",
    title: "Música Litúrgica 6",
    artist: "Música Católica",
    url: "https://music.wixstatic.com/preview/e585d6_60caab8f3a964ddaaf4b39aa455662ef-128.mp3",
    category: "liturgical",
  },
];

/**
 * Obtém uma música aleatória do pool
 */
export function getRandomMusic(): MusicTrack | null {
  if (MUSIC_POOL.length === 0) return null;
  return MUSIC_POOL[Math.floor(Math.random() * MUSIC_POOL.length)]!;
}

/**
 * Obtém uma música por ID
 */
export function getMusicById(id: string): MusicTrack | null {
  return MUSIC_POOL.find((m) => m.id === id) ?? null;
}

/**
 * Obtém todas as músicas de uma categoria
 */
export function getMusicByCategory(category: MusicTrack["category"]): MusicTrack[] {
  return MUSIC_POOL.filter((m) => m.category === category);
}
