"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Submission failed");
            setStatus("success");
            setFormData({ name: "", email: "", company: "", message: "" });
        } catch (err) {
            setStatus("error");
            console.error("Contact form error:", err);
        }
    };

    if (status === "success") {
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
                <main style={{ paddingTop: "120px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", maxWidth: "500px" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✨</div>
                        <h2>Message Sent!</h2>
                        <p style={{ color: "rgba(250,250,250,0.7)", marginBottom: "2rem" }}>
                            Thank you for reaching out. Our team will get back to you within 24 hours.
                        </p>
                        <button onClick={() => setStatus("idle")} className="btn btn-outline">
                            Send Another Message
                        </button>
                    </div>
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
                                <a href="mailto:nyotacreatives@gmail.com" style={{ fontSize: "1.125rem" }}>nyotacreatives@gmail.com</a>
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
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "rgba(250,250,250,0.7)" }}>Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ alignSelf: "flex-start" }}
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "Sending..." : "Send Message"}
                                </button>
                                {status === "error" && (
                                    <p style={{ color: "red", fontSize: "0.875rem" }}>
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
