import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "@/contexts/MusicContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SacrumScroll — O Feed da Tradição Católica",
  description:
    "Substitua o scroll mundano por ascese espiritual e beleza sacra. Patrística, Escolástica, Mística e Liturgia.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SacrumScroll" },
  openGraph: {
    title: "SacrumScroll — O Feed da Tradição Católica",
    description:
      "Substitua o scroll mundano por ascese espiritual e beleza sacra. Patrística, Escolástica, Mística e Liturgia.",
    url: "https://sacrumscroll.com",
    siteName: "SacrumScroll",
    images: [
      {
        url: "https://sacrumscroll.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SacrumScroll — O Feed da Tradição Católica",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SacrumScroll — O Feed da Tradição Católica",
    description:
      "Substitua o scroll mundano por ascese espiritual e beleza sacra. Patrística, Escolástica, Mística e Liturgia.",
    images: ["https://sacrumscroll.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${garamond.variable}`}>
      <body className="min-h-screen bg-batina text-pedra font-garamond antialiased">
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
