"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const NAV_LINKS = [
    { href: "/tanzania", label: "Destinations" },
    { href: "/tours", label: "Tours" },
    { href: "/rentals", label: "Transfers & Cars" },
    { href: "/guides", label: "Guides" },
    { href: "/hotels", label: "Hotels" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let theme = "default";
        if (pathname.startsWith("/tanzania/zanzibar") || pathname.includes("beach")) {
            theme = "beach";
        } else if (pathname.startsWith("/tanzania") || pathname.includes("safari")) {
            theme = "safari";
        }
        document.documentElement.setAttribute("data-theme", theme);
    }, [pathname]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
            <nav className={styles.nav} aria-label="Main Navigation Bar">
                <Link href="/" className={styles.brand}>
                    <Image
                        src="/logo-rush-zanzibar.png"
                        alt="Rush Zanzibar"
                        width={56}
                        height={56}
                        priority
                        className={styles.brandLogo}
                    />
                    <span className={styles.brandText}>
                        <strong>Rush Zanzibar</strong>
                        <small>Transfers, Tours, and Rentals</small>
                    </span>
                </Link>

                <div className={styles.navLinks}>
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive(item.href) ? styles.navLinkActive : ""}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.navActions}>
                    <Link href="/rentals" className={styles.transportBtn}>
                        Compare Transport
                    </Link>
                    <Link href="/contact" className={styles.bookBtn}>
                        Plan My Trip
                    </Link>
                </div>

                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation-panel"
                >
                    <span className={styles.menuLine} />
                    <span className={styles.menuLine} />
                    <span className={styles.menuLine} />
                </button>
            </nav>

            <button
                type="button"
                className={`${styles.mobileBackdrop} ${isMenuOpen ? styles.mobileBackdropOpen : ""}`}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close mobile navigation"
            />

            <div
                id="mobile-navigation-panel"
                className={`${styles.mobilePanel} ${isMenuOpen ? styles.mobilePanelOpen : ""}`}
                aria-hidden={!isMenuOpen}
            >
                <div className={styles.mobilePanelHeader}>
                    <span>Menu</span>
                    <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation panel">
                        Close
                    </button>
                </div>

                <div className={styles.mobileNavLinks}>
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={`mobile-${item.href}`}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={isActive(item.href) ? styles.mobileNavLinkActive : ""}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.mobileActions}>
                    <Link href="/rentals" onClick={() => setIsMenuOpen(false)} className={styles.mobileTransportBtn}>
                        Transfers & Car Rentals
                    </Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={styles.mobileBookBtn}>
                        Talk to a Planner
                    </Link>
                </div>
            </div>
        </header>
    );
}
