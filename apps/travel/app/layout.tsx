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

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MLXVCHP5');
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QEZ9QQWVQK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QEZ9QQWVQK');
          `}
        </Script>
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Rush Zanzibar",
              "url": "https://rushzanzibar.com",
              "description": "Your complete guide to Tanzania and Zanzibar with RushZanzibar.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TZ",
                "addressRegion": "Zanzibar"
              }
            })
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MLXVCHP5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
