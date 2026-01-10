import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nyota Creative | Premium Creative & Software Agency",
  description:
    "High-end creative and software agency offering branding, UI/UX design, software development, content production, and talent collaboration.",
  keywords: [
    "creative agency",
    "software development",
    "branding",
    "UI/UX design",
    "Tanzania",
    "East Africa",
  ],
  openGraph: {
    title: "Nyota Creative | Premium Creative & Software Agency",
    description: "Where creativity meets strategic excellence",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
