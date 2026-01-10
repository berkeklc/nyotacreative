import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Contact | Nyota Creative",
    description: "Get in touch with Nyota Creative. Let's discuss your next project.",
};

export default function ContactPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        NYOTA<span className={styles.logoAccent}>.</span>
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/work">Work</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact" className="btn btn-outline">
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "120px", minHeight: "80vh" }}>
                <section className="section container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem" }}>
                        <div>
                            <span className={styles.sectionLabel}>Contact</span>
                            <h1 style={{ marginBottom: "1.5rem" }}>Let's talk</h1>
                            <p style={{ color: "rgba(250,250,250,0.7)", marginBottom: "3rem", maxWidth: "400px" }}>
                                Ready to start your next project? We'd love to hear from you.
                                Fill out the form or reach us directly.
                            </p>

                            <div style={{ marginBottom: "2rem" }}>
                                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gold)", marginBottom: "0.5rem" }}>Email</h4>
                                <a href="mailto:hello@nyota.com" style={{ fontSize: "1.125rem" }}>hello@nyota.com</a>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gold)", marginBottom: "0.5rem" }}>Phone</h4>
                                <a href="tel:+255123456789" style={{ fontSize: "1.125rem" }}>+255 123 456 789</a>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gold)", marginBottom: "0.5rem" }}>Location</h4>
                                <p style={{ fontSize: "1.125rem" }}>
                                    Dar es Salaam, Tanzania
                                </p>
                            </div>

                            <div>
                                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gold)", marginBottom: "0.5rem" }}>Social</h4>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <a href="https://instagram.com/nyotacreative" target="_blank" rel="noopener">Instagram</a>
                                    <a href="https://linkedin.com/company/nyotacreative" target="_blank" rel="noopener">LinkedIn</a>
                                    <a href="https://twitter.com/nyotacreative" target="_blank" rel="noopener">Twitter</a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "rgba(250,250,250,0.7)" }}>Name *</label>
                                    <input
                                        type="text"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "1rem",
                                            background: "var(--color-charcoal-light)",
                                            border: "1px solid rgba(250,250,250,0.1)",
                                            color: "var(--color-off-white)",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "rgba(250,250,250,0.7)" }}>Email *</label>
                                    <input
                                        type="email"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "1rem",
                                            background: "var(--color-charcoal-light)",
                                            border: "1px solid rgba(250,250,250,0.1)",
                                            color: "var(--color-off-white)",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "rgba(250,250,250,0.7)" }}>Company</label>
                                    <input
                                        type="text"
                                        style={{
                                            width: "100%",
                                            padding: "1rem",
                                            background: "var(--color-charcoal-light)",
                                            border: "1px solid rgba(250,250,250,0.1)",
                                            color: "var(--color-off-white)",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "rgba(250,250,250,0.7)" }}>Message *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        style={{
                                            width: "100%",
                                            padding: "1rem",
                                            background: "var(--color-charcoal-light)",
                                            border: "1px solid rgba(250,250,250,0.1)",
                                            color: "var(--color-off-white)",
                                            fontSize: "1rem",
                                            resize: "vertical"
                                        }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerBottom}>
                        <p className="text-muted">
                            © {new Date().getFullYear()} Nyota Creative. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
