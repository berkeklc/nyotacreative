import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollToTop from "../components/ScrollToTop";

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

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          id="json-ld-agency"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Nyota Creative",
              "url": "https://nyotacreative.com",
              "description": "Premium Creative & Software Agency in Tanzania",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TZ"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <ScrollToTop />
        <WhatsAppButton />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4JQE9PKYDE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4JQE9PKYDE');
          `}
        </Script>
      </body>
    </html>
  );
}
