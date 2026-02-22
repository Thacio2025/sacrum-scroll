import { LiturgicalTheme } from "@/components/LiturgicalTheme";
import { PresentationProvider } from "@/contexts/PresentationContext";
import { HomeLayout } from "@/components/HomeLayout";

/**
 * Página principal — ordem do layout (de cima para baixo):
 *
 * 1. Header (fixo) — título, modo apresentação, tela cheia, @professor_thacio, site, Direção espiritual
 * 2. LiturgicalBanner — uma linha com o tempo litúrgico
 * 3. Feed — filtro de categoria, citação do dia, área de scroll com os cards
 * 4. MusicPlayer (fixo no canto)
 *
 * Modo apresentação (botão Monitor): só imagem + frase + @professor_thacio — ideal para TV/celular.
 * Ver LAYOUT.md na raiz do projeto.
 */
export default function Home() {
  return (
    <LiturgicalTheme>
      <PresentationProvider>
        <HomeLayout />
      </PresentationProvider>
    </LiturgicalTheme>
  );
}
