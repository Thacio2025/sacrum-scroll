import { Feed } from "@/components/Feed";
import { LiturgicalTheme } from "@/components/LiturgicalTheme";
import { Header } from "@/components/Header";
import { LiturgicalBanner } from "@/components/LiturgicalBanner";
import { MusicPlayer } from "@/components/MusicPlayer";

/**
 * Página principal — ordem do layout (de cima para baixo):
 *
 * 1. Header (fixo) — título, @professor_thacio, site, Direção espiritual
 * 2. LiturgicalBanner — uma linha com o tempo litúrgico (Advento, Quaresma, etc.)
 * 3. Feed — dentro dele: filtro de categoria, citação do dia, e a área de scroll com os cards
 * 4. MusicPlayer (fixo no canto) — play, próxima faixa, volume
 *
 * Ver LAYOUT.md na raiz do projeto para o desenho completo.
 */
export default function Home() {
  return (
    <LiturgicalTheme>
      <main className="relative flex min-h-screen flex-col">
        <Header />
        <LiturgicalBanner />
        <div className="flex min-h-0 flex-1 flex-col">
          <Feed />
        </div>
        <MusicPlayer />
      </main>
    </LiturgicalTheme>
  );
}
