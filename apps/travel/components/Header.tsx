"use client";

import Link from "next/link";
import styles from "../app/page.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✦</span>
                    NYOTA TRAVEL
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/tanzania">Tanzania</Link>
                    <Link href="/tanzania/zanzibar">Zanzibar</Link>
                    <Link href="/tours">Tours</Link>
                    <Link href="/guides">Guides</Link>
                    <Link href="/hotels">Hotels</Link>
                </div>
                <div className={styles.navActions}>
                    <button className={styles.langSwitch}>EN</button>
                    <Link href="/tours" className="btn btn-primary">
                        Book a Tour
                    </Link>
                </div>
            </nav>
        </header>
    );
}
