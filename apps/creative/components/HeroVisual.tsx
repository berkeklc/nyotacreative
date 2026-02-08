"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading placeholder
function LoadingPlaceholder() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 70% 50%, rgba(201, 169, 98, 0.1) 0%, transparent 50%)",
      }}
    />
  );
}

// Dynamic import for Three.js
const LiquidStar = dynamic(() => import("./LiquidStar"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingPlaceholder />;
  }

  return <LiquidStar />;
}
