import Link from "next/link";
import styles from "./contact.module.css";

export const metadata = {
    title: "Contact Us | RushZanzibar",
    description: "Get in touch with our Tanzanian travel experts for bespoke itinerary planning.",
};

export default function ContactPage() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <img
                        src="/hero-safari.jpg"
                        alt="Contact Background"
                        className={styles.heroBgImage}
                    />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Get in Touch</h1>
                    <p className={styles.heroSubtitle}>
                        Whether you're planning a honeymoon or a family safari,
                        we're here to help you craft the perfect itinerary.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Info Column */}
                        <div className={styles.infoCard}>
                            <h2 className={styles.infoTitle}>Connect with Us</h2>

                            <div className={styles.contactMethod}>
                                <span className={styles.methodLabel}>Phone / WhatsApp</span>
                                <a href="https://wa.me/255794094733" target="_blank" className={styles.methodValue}>
                                    +255 794 094 733
                                </a>
                            </div>

                            <div className={styles.contactMethod}>
                                <span className={styles.methodLabel}>Email</span>
                                <a href="mailto:hello@rushzanzibar.com" className={styles.methodValue}>
                                    hello@rushzanzibar.com
                                </a>
                            </div>

                            <div className={styles.contactMethod}>
                                <span className={styles.methodLabel}>Office</span>
                                <span className={styles.methodValue}>
                                    Stone Town, Zanzibar<br />
                                    Tanzania
                                </span>
                            </div>

                            <div className={styles.socialLinks}>
                                <a href="#" className={styles.socialLink} aria-label="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className={styles.formCard}>
                            <h2 className={styles.infoTitle}>Send us a Message</h2>
                            <form>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name</label>
                                    <input type="text" className={styles.input} placeholder="Your Name" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email Address</label>
                                    <input type="email" className={styles.input} placeholder="name@example.com" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Message</label>
                                    <textarea className={styles.textarea} placeholder="Tell us about your trip plans..."></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn}>
                                    Send Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
