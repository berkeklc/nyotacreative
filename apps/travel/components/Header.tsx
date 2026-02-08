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
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        if (isHome) {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        } else {
            setIsScrolled(true);
        }
    }, [isHome]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const headerClass = `${styles.header} ${isHome && !isScrolled ? styles.headerHidden : ""} ${isScrolled ? styles.headerVisible : ""}`;

    return (
        <header className={headerClass}>
            <nav className={styles.nav} aria-label="Main Navigation">
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-rush-zanzibar.png"
                        alt="Rush Zanzibar"
                        width={44}
                        height={44}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <span className={styles.logoText}>RUSHZANZIBAR</span>
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                <div className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ""}`}>
                    <Link href="/tanzania" onClick={() => setIsMenuOpen(false)}>Tanzania</Link>
                    <Link href="/tanzania/zanzibar" onClick={() => setIsMenuOpen(false)}>Zanzibar</Link>
                    <Link href="/tours" onClick={() => setIsMenuOpen(false)}>Tours</Link>
                    <Link href="/guides" onClick={() => setIsMenuOpen(false)}>Guides</Link>
                    <Link href="/hotels" onClick={() => setIsMenuOpen(false)}>Hotels</Link>
                </div>

                <div className={styles.navActions}>
                    <button className={styles.langSwitch} aria-label="Switch Language">EN</button>
                    <Link href="/tours" className="btn btn-primary">
                        Explore Experience
                    </Link>
                </div>
            </nav>
        </header>
    );
}
