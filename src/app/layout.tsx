import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TerraCriar - Frutas Tropicais Premium",
  description: "Exportação de frutas tropicais premium do Vale do São Francisco. Manga, melão, uva, coco e muito mais direto do produtor para o mundo.",
  keywords: "frutas tropicais, exportação, Vale do São Francisco, manga, melão, uva, coco, TerraCriar",
  authors: [{ name: "TerraCriar" }],
  creator: "TerraCriar",
  publisher: "TerraCriar",
  robots: "index, follow",
  openGraph: {
    title: "TerraCriar - Frutas Tropicais Premium",
    description: "Exportação de frutas tropicais premium do Vale do São Francisco",
    url: "https://terracriar.com.br",
    siteName: "TerraCriar",
    images: [
      {
        url: "/images/terracriarLogo.png",
        width: 1200,
        height: 630,
        alt: "TerraCriar - Frutas Tropicais",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraCriar - Frutas Tropicais Premium",
    description: "Exportação de frutas tropicais premium do Vale do São Francisco",
    images: ["/images/terracriarLogo.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#059669",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TerraCriar" />
        <link rel="apple-touch-icon" href="/images/192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}