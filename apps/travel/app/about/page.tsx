import Link from "next/link";
import styles from "./about.module.css";

export const metadata = {
    title: "About Us | Nyota Travel",
    description: "Expert travel guides for Tanzania and Zanzibar. Learn more about our mission.",
};

export default function AboutPage() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <img
                        src="/hero-safari.jpg"
                        alt="Background"
                        className={styles.heroBgImage}
                    />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Our Tanzania,<br />
                        <span>Your Adventure</span>
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <p className={styles.introText}>
                        Nyota Travel was founded on a simple principle: nobody knows Tanzania better than the people who call it home.
                        We aren't just a booking platform; we are your local advisors, your on-the-ground support, and your bridge to the wild heart of Africa.
                    </p>

                    <div className={styles.gridTwo}>
                        <div className={styles.imageBlock}>
                            <img src="/zanzibar-beach.jpg" alt="Zanzibar Beach" className={styles.imageCover} />
                        </div>
                        <div className={styles.textBlock}>
                            <span className={styles.sectionLabel}>Our Story</span>
                            <h3>Expertise You Can Trust</h3>
                            <p>
                                From the rhythmic tides of Zanzibar to the thundering hooves of the Serengeti migration, our guides and experts have walked every trail and explored every hidden alley of Stone Town.
                            </p>
                            <p>
                                We curate experiences that prioritize authenticity, cultural respect, and premium comfort. When you travel with Rush, you travel with friends who know the way.
                            </p>
                        </div>
                    </div>

                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>Why Choose Us</span>
                        <h2>The Nyota Difference</h2>
                    </div>

                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🌍</span>
                            <h3>Local Insight</h3>
                            <p>Deep-rooted connections with local communities to ensure unique, ethical experiences that gives back.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>✨</span>
                            <h3>Bespoke Planning</h3>
                            <p>Tailor-made itineraries crafted by experts who understand the nuances of Tanzanian travel and luxury.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🤝</span>
                            <h3>On-Ground Support</h3>
                            <p>24/7 assistance from our team in Dar es Salaam and Zanzibar. We are always just a call away.</p>
                        </div>
                    </div>

                    <div className={styles.ctaSection}>
                        <div className={styles.ctaContent}>
                            <h2 className={styles.ctaTitle}>Start Your Journey</h2>
                            <p className={styles.ctaText}>
                                Ready to explore the best of Tanzania? Let's plan your dream trip together.
                            </p>
                            <Link href="/contact" className={styles.ctaButton}>
                                Contact an Advisor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
