import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "About Us | Nyota Travel",
    description: "Expert travel guides for Tanzania and Zanzibar. Learn more about our mission.",
};

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px" }}>
                <section className="section">
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Identity</span>
                                <h1>About Nyota Travel</h1>
                            </div>
                        </div>
                        <div className={styles.layoutGrid}>
                            <div className={styles.mainContent}>
                                <div className={styles.adviceCard} style={{ background: 'var(--color-sand)', borderLeft: '6px solid var(--color-terracotta)', marginBottom: '3rem' }}>
                                    <h3 style={{ color: 'var(--color-terracotta)' }}>Our Tanzania, Your Adventure</h3>
                                    <p className={styles.descriptionText}>
                                        Nyota Travel was founded on a simple principle: nobody knows Tanzania better than the people who call it home. We aren't just a booking platform; we are your local advisors, your on-the-ground support, and your bridge to the wild heart of Africa.
                                    </p>
                                </div>
                                <section>
                                    <h2>Expertise You Can Trust</h2>
                                    <p className={styles.descriptionText} style={{ marginBottom: '2rem' }}>
                                        From the rhythmic tides of Zanzibar to the thundering hooves of the Serengeti migration, our guides and experts have walked every trail and explored every hidden alley of Stone Town. We curate experiences that prioritize authenticity, cultural respect, and premium comfort.
                                    </p>
                                    <div className={styles.infoGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div className="card-premium">
                                            <h4>Local Insight</h4>
                                            <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>Deep-rooted connections with local communities to ensure unique, ethical experiences.</p>
                                        </div>
                                        <div className="card-premium">
                                            <h4>Bespoke Planning</h4>
                                            <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>Tailor-made itineraries crafted by experts who understand the nuances of Tanzanian travel.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <aside className={styles.sidebar}>
                                <div className={styles.sidebarCard}>
                                    <h3>Ready to start?</h3>
                                    <ul className={styles.sidebarLinks}>
                                        <li><Link href="/tours">View All Tours</Link></li>
                                        <li><Link href="/guides">Read Travel Guides</Link></li>
                                        <li><Link href="/contact">Inquire Now</Link></li>
                                    </ul>
                                    <Link href="/contact" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                        Contact an Advisor
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
