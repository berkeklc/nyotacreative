"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "var(--color-terracotta)",
                color: "var(--color-white)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(192, 90, 62, 0.3)",
                zIndex: 9999,
                transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
                fontSize: "1.5rem",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(192, 90, 62, 0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(192, 90, 62, 0.3)";
            }}
        >
            ↑
        </button>
    );
}
