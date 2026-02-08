import Link from "next/link";
import styles from "../app/page.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo} style={{ fontSize: "1.5rem" }}>
                            NYOTA<span className={styles.logoAccent}>.</span>
                        </Link>
                        <p className="text-muted" style={{ marginTop: "1rem", maxWidth: "250px" }}>
                            Premium creative & software agency based in Dar es Salaam, Tanzania.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className={styles.footerColumn}>
                        <h4>Navigation</h4>
                        <Link href="/work">Work</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    {/* Services */}
                    <div className={styles.footerColumn}>
                        <h4>Services</h4>
                        <Link href="/services/software">Software</Link>
                        <Link href="/services/design">Design</Link>
                        <Link href="/services/branding">Branding</Link>
                        <Link href="/services/content">Content</Link>
                    </div>

                    {/* Connect */}
                    <div className={styles.footerColumn}>
                        <h4>Connect</h4>
                        <a href="https://instagram.com/nyotacreative" target="_blank" rel="noopener">Instagram</a>
                        <a href="https://linkedin.com/company/nyotacreative" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="mailto:nyotacreatives@gmail.com">nyotacreatives@gmail.com</a>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p className="text-muted">
                        © {new Date().getFullYear()} Nyota Creative. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
