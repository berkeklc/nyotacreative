"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Determine theme based on path
    useEffect(() => {
        let theme = 'default';
        if (pathname.includes('/tanzania/zanzibar') || pathname.includes('beach')) {
            theme = 'beach';
        } else if (pathname.includes('/tanzania') || pathname.includes('safari')) {
            theme = 'safari';
        }
        document.documentElement.setAttribute('data-theme', theme);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <nav className={styles.nav} aria-label="Main Navigation">
                {/* Left - Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-rush-zanzibar.png"
                        alt="Rush Zanzibar"
                        width={70}
                        height={70}
                        priority
                        style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid rgba(255,255,255,0.2)"
                        }}
                    />
                </Link>

                {/* Center - Nav Links */}
                <div className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ""}`}>
                    <Link href="/tanzania" onClick={() => setIsMenuOpen(false)}>Tanzania</Link>
                    <Link href="/tanzania/zanzibar" onClick={() => setIsMenuOpen(false)}>Zanzibar</Link>
                    <Link href="/tours" onClick={() => setIsMenuOpen(false)}>Tours</Link>
                    <Link href="/guides" onClick={() => setIsMenuOpen(false)}>Guides</Link>
                    <Link href="/hotels" onClick={() => setIsMenuOpen(false)}>Hotels</Link>
                </div>

                {/* Right - Actions */}
                <div className={styles.navActions}>
                    <button className={styles.langSwitch} aria-label="Switch Language">EN</button>
                    <Link href="/tours" className={styles.bookBtn}>
                        Book Now
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </nav>
        </header>
    );
}
