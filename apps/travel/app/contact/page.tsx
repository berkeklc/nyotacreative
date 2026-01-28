import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Contact Us | RushZanzibar",
    description: "Get in touch with our Tanzanian travel experts for bespoke itinerary planning.",
};

export default function ContactPage() {
    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px" }}>
                <section className="section">
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Connect</span>
                                <h1>Get in Touch</h1>
                            </div>
                        </div>
                        <div className={styles.layoutGrid}>
                            <div className={styles.mainContent}>
                                <div className={styles.adviceCard} style={{ background: 'var(--color-sand)', borderLeft: '6px solid var(--color-ochre)', marginBottom: '3rem' }}>
                                    <h3 style={{ color: 'var(--color-ochre)' }}>Talk to a Local Advisor</h3>
                                    <p className={styles.descriptionText}>
                                        Whether you're planning a honeymoon in Zanzibar or a photography safari in the Serengeti, our experts are here to help you navigate every detail.
                                    </p>
                                </div>
                                <form className="card" style={{ padding: '3rem', border: '1px solid var(--color-sand-dark)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--color-slate)' }}>Full Name</label>
                                            <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-sand-dark)' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--color-slate)' }}>Email Address</label>
                                            <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-sand-dark)' }} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--color-slate)' }}>Message</label>
                                        <textarea rows={6} placeholder="How can we help you plan your journey?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-sand-dark)' }}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Inquiry</button>
                                </form>
                            </div>
                            <aside className={styles.sidebar}>
                                <div className={styles.sidebarCard}>
                                    <h3>Direct Channels</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 700, textTransform: 'uppercase' }}>Email</span>
                                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>hello@rushzanzibar.com</span>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 700, textTransform: 'uppercase' }}>WhatsApp</span>
                                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>+255 123 456 789</span>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 700, textTransform: 'uppercase' }}>Location</span>
                                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>Stone Town, Zanzibar</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
