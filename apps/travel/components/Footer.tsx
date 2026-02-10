"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "../app/page.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo} style={{ color: 'var(--color-white)', display: 'flex', alignItems: 'center' }}>
                            <Image
                                src="/logo-rush-zanzibar.png"
                                alt="Rush Zanzibar"
                                width={90}
                                height={90}
                                style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                            />
                        </Link>
                        <p>
                            Expert insight into Tanzania's wild heart and Zanzibar's turquoise horizons.
                            Your journey, curated by local professionals.
                        </p>
                        <div className={styles.footerSocial}>
                            <a href="#" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 69.44 69.44 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 69.44 69.44 0 0 1-15 0 2 2 0 0 1-2-2Z" /><path d="m9.75 15.02 5.75-3.02-5.75-3.02v6.04Z" /></svg>
                            </a>
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
                        <h4>Transport</h4>
                        <Link href="/rentals">Car Rental</Link>
                        <Link href="/rentals">Airport Transfers</Link>
                        <Link href="/rentals">Self-Drive</Link>
                    </div>

                    <div className={styles.footerLinks}>
                        <h4>Agency</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} RushZanzibar. A RushZanzibar project.</p>
                    <div className={styles.footerLang}>
                        <button>
                            <span>🇬🇧</span> English
                        </button>
                        <button>
                            <span>🇹🇿</span> Kiswahili
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
