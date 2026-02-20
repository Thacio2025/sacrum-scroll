import { Feed } from "@/components/Feed";
import { LiturgicalTheme } from "@/components/LiturgicalTheme";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";

export default function Home() {
  return (
    <LiturgicalTheme>
      <main className="relative min-h-screen">
        <Header />
        <Feed />
        <MusicPlayer />
      </main>
    </LiturgicalTheme>
  );
}
