import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rushzanzibar.com"),
  title: {
    default: "RushZanzibar | Tanzania & Zanzibar Travel Guide 2026",
    template: "%s | RushZanzibar",
  },
  description:
    "Your complete guide to Tanzania and Zanzibar with RushZanzibar. Discover beaches, tours, hotels, local tips, and hidden gems. Plan your East African adventure with local experts.",
  keywords: [
    "Tanzania travel",
    "Zanzibar guide",
    "RushZanzibar",
    "Dar es Salaam",
    "African safari",
    "beach holidays",
    "Spice Island",
    "Stone Town",
    "East Africa tourism",
  ],
  openGraph: {
    title: "RushZanzibar | Tanzania & Zanzibar Travel Guide",
    description: "Discover Tanzania and Zanzibar with RushZanzibar local experts",
    type: "website",
    locale: "en_US",
    siteName: "RushZanzibar",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      en: "/en",
      sw: "/sw",
    },
  },
};

import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import WhatsAppButton from "../components/WhatsAppButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
