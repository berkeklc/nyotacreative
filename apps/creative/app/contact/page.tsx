"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./contact.module.css";
import globalStyles from "../page.module.css";
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
                <header className={globalStyles.header}>
                    <nav className={globalStyles.nav}>
                        <Link href="/" className={globalStyles.logo}>
                            NYOTA<span className={globalStyles.logoAccent}>.</span>
                        </Link>
                        <div className={globalStyles.navLinks}>
                            <Link href="/work">Work</Link>
                            <Link href="/services">Services</Link>
                            <Link href="/about">About</Link>
                            <Link href="/contact" className={globalStyles.activeLink}>
                                Contact
                            </Link>
                        </div>
                    </nav>
                </header>
                <main style={{ paddingTop: "120px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className={styles.successMessage}>
                        <div style={{ fontSize: "3rem", marginBottom: "1.5rem", color: "var(--color-gold)" }}>✨</div>
                        <h2 className={styles.title} style={{ fontSize: "2.5rem" }}>Message Sent</h2>
                        <p className={styles.description}>
                            Thank you for reaching out. We will review your message and get back to you shortly.
                        </p>
                        <button onClick={() => setStatus("idle")} className={styles.submitButton}>
                            Send Another
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={globalStyles.header}>
                <nav className={globalStyles.nav}>
                    <Link href="/" className={globalStyles.logo}>
                        NYOTA<span className={globalStyles.logoAccent}>.</span>
                    </Link>
                    <div className={globalStyles.navLinks}>
                        <Link href="/work">Work</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact" style={{ color: "var(--color-gold)" }}>
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "120px" }}>
                <section className={`${styles.section} container`}>
                    <div className={styles.grid}>
                        <div className={styles.contentSide}>
                            <span className={globalStyles.sectionLabel}>Start a Conversation</span>
                            <h1 className={styles.title}>Let's Create<br />Something Iconic.</h1>
                            <p className={styles.description}>
                                Whether you have a clear vision or just a spark of an idea, we're here to help you bring it to life.
                            </p>

                            <div className={styles.contactInfo}>
                                <div style={{ marginBottom: "2rem" }}>
                                    <span className={styles.label}>Email</span>
                                    <a href="mailto:nyotacreatives@gmail.com" className={styles.value}>
                                        nyotacreatives@gmail.com
                                    </a>
                                </div>

                                <div style={{ marginBottom: "2rem" }}>
                                    <span className={styles.label}>Phone</span>
                                    <a href="tel:+255794094733" className={styles.value}>
                                        +255 794 094 733
                                    </a>
                                </div>

                                <div>
                                    <span className={styles.label}>Studio</span>
                                    <p className={styles.location}>
                                        Dar es Salaam,<br />Tanzania
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className={styles.label} style={{ marginBottom: "1rem" }}>Follow Us</span>
                                <div className={styles.socialLinks}>
                                    <a href="https://instagram.com/nyotacreative" target="_blank" className={styles.socialLink}>Instagram</a>
                                    <a href="https://linkedin.com/company/nyotacreative" target="_blank" className={styles.socialLink}>LinkedIn</a>
                                    <a href="https://twitter.com/nyotacreative" target="_blank" className={styles.socialLink}>Twitter</a>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSide}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={styles.input}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={styles.input}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Company (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className={styles.input}
                                        placeholder="Company name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className={styles.textarea}
                                        placeholder="Tell us about your project..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "Sending..." : "Send Message"}
                                </button>
                                {status === "error" && (
                                    <p style={{ color: "#E76F51", fontSize: "0.9rem", marginTop: "1rem" }}>
                                        Submission failed. Please try again.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
