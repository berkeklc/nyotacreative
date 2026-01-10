"use client";

import Link from "next/link";
import styles from "../app/page.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>✦</span>
                            NYOTA TRAVEL
                        </Link>
                        <p>
                            East Africa's trusted travel resource. Powered by local experts
                            and powered by Nyota Creative.
                        </p>
                        <div className={styles.footerSocial}>
                            <a href="#">📘</a>
                            <a href="#">📸</a>
                            <a href="#">🐦</a>
                            <a href="#">📺</a>
                        </div>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Destinations</h4>
                        <Link href="/tanzania/zanzibar">Zanzibar</Link>
                        <Link href="/tanzania/dar-es-salaam">Dar es Salaam</Link>
                        <Link href="/tanzania/serengeti">Serengeti</Link>
                        <Link href="/tanzania">All Destinations</Link>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Travel Guides</h4>
                        <Link href="/guides/category/beaches">Beaches</Link>
                        <Link href="/guides/category/food">Food & Drink</Link>
                        <Link href="/guides/category/culture">Culture</Link>
                        <Link href="/guides/category/tips">Travel Tips</Link>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} Nyota Travel. A Nyota Creative project.</p>
                    <div className={styles.footerLang}>
                        <button>🇬🇧 English</button>
                        <button>🇹🇿 Kiswahili</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
