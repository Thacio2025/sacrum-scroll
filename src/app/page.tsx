import { Feed } from "@/components/Feed";
import { LiturgicalTheme } from "@/components/LiturgicalTheme";

export default function Home() {
  return (
    <LiturgicalTheme>
      <main className="relative min-h-screen">
        <header className="fixed left-0 right-0 top-0 z-20 flex justify-center border-b border-white/5 bg-batina/80 py-3 backdrop-blur-sm">
          <h1 className="font-cinzel text-lg font-medium tracking-wide text-liturgico">
            SacrumScroll
          </h1>
        </header>
        <Feed />
      </main>
    </LiturgicalTheme>
  );
}
