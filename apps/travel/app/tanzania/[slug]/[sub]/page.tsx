import Link from "next/link";
import styles from "../../../page.module.css";

export default async function DestinationSubPage({ params }: { params: Promise<{ slug: string, sub: string }> }) {
    const { slug, sub } = await params;
    const destName = slug.charAt(0).toUpperCase() + slug.slice(1);
    const subName = sub.charAt(0).toUpperCase() + sub.slice(1);

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: '120px' }}>
                <section className="section">
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>{destName}</span>
                                <h1>{subName} in {destName}</h1>
                            </div>
                        </div>

                        <div className={styles.layoutGrid}>
                            <div className={styles.mainContent}>
                                <div className={styles.adviceCard} style={{ background: 'var(--color-sand)', borderLeft: '6px solid var(--color-terracotta)', marginBottom: '3rem' }}>
                                    <h3>Local Insight: {subName}</h3>
                                    <p className={styles.descriptionText}>
                                        Exploring {subName} in {destName} offers a unique glimpse into the heart of Tanzania's coastal and wild life. Our advisors are currently curating the best spots, hidden gems, and essential safety tips for this specific experience.
                                    </p>
                                </div>
                                <section>
                                    <h2>Coming Soon</h2>
                                    <p className={styles.descriptionText}>
                                        We are currently building out the full detailed guide for {subName} experiences. In the meantime, you can explore our main guides or contact an advisor for personalized recommendations.
                                    </p>
                                    <Link href="/guides" className="btn btn-primary" style={{ marginTop: '2rem' }}>Explore Guides</Link>
                                </section>
                            </div>
                            <aside className={styles.sidebar}>
                                <div className={styles.sidebarCard}>
                                    <h3>Need Details?</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', marginBottom: '1.5rem' }}>
                                        Our local experts can give you up-to-the-minute info on {subName} conditions and bookings.
                                    </p>
                                    <Link href="/contact" className="btn btn-accent" style={{ width: '100%', textAlign: 'center' }}>Message Advisor</Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
