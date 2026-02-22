import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "@/contexts/MusicContext";
import { FINGERPRINT, FINGERPRINT_PHRASE } from "@/lib/antiplagio";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cinzel-decorative",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
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
  viewportFit: "cover",
};

const SITE_URL = "https://sacrumscroll.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SacrumScroll — O Feed da Tradição Católica",
    template: "%s | SacrumScroll",
  },
  description:
    "Substitua o scroll mundano por ascese espiritual e beleza sacra. Citações da Patrística, Escolástica, Mística e Liturgia. PWA com arte sacra e músicas litúrgicas.",
  keywords: [
    "SacrumScroll",
    "tradição católica",
    "patrística",
    "escolástica",
    "mística",
    "liturgia",
    "oração",
    "santos",
    "Igreja Católica",
    "feed espiritual",
  ],
  authors: [{ name: "Thácio Siqueira", url: "https://www.thaciosiqueira.com.br" }],
  creator: "Thácio Siqueira",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
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
  other: {
    "sacrumscroll-signature": FINGERPRINT,
  },
};

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SacrumScroll",
    description:
      "Substitua o scroll mundano por ascese espiritual e beleza sacra. Citações da Patrística, Escolástica, Mística e Liturgia.",
    url: SITE_URL,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    author: {
      "@type": "Person",
      name: "Thácio Siqueira",
      url: "https://www.thaciosiqueira.com.br",
    },
    inLanguage: "pt-BR",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${cinzelDecorative.variable} ${cormorant.variable} ${garamond.variable}`}>
      <body className="min-h-screen bg-batina text-pedra font-cormorant antialiased" data-signature={FINGERPRINT}>
        {/* Isca antiplágio: invisível na tela, presente no HTML para prova de autoria */}
        <span
          aria-hidden
          className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0 pointer-events-none"
          data-fingerprint={FINGERPRINT}
        >
          {FINGERPRINT_PHRASE}
        </span>
        <JsonLd />
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
