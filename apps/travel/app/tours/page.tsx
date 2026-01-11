import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

export const metadata = {
    title: "Tours & Experiences | Nyota Travel",
    description: "Book unforgettable safaris, beach getaways, and cultural tours in Tanzania and Zanzibar.",
};

export default async function ToursPage() {
    const toursRes = await fetchAPI("/tours", {
        populate: ["heroImage", "city"],
        pagination: { limit: 12 }
    });

    const cmsTours = toursRes?.data || [];

    const displayTours = cmsTours.map((t: any) => ({
        title: t.name,
        slug: t.slug,
        duration: t.duration || "Bespoke",
        price: t.priceAdult || 0,
        image: getStrapiMedia(t.heroImage?.url),
        city: t.city?.name || "Tanzania"
    }));

    return (
        <div className={styles.page}>
            <header className={styles.hero} style={{ minHeight: "50vh", backgroundImage: "url('/hero-safari.jpg')" }}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>Signature Experiences</span>
                    <h1>Experience Tanzania</h1>
                    <p className={styles.heroSubtitle}>Curated expert-led tours and adventures designed for life-long memories.</p>
                </div>
            </header>

            <section className="section" style={{ background: "var(--color-sand)" }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>Discover</span>
                            <h2>Available Adventures</h2>
                        </div>
                    </div>

                    {displayTours.length > 0 ? (
                        <div className={styles.toursGrid} style={{ marginTop: '2rem' }}>
                            {displayTours.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={tour.image ? { backgroundImage: `url(${tour.image})` } : { backgroundColor: 'var(--color-sand-dark)' }}
                                    />
                                    <div className={styles.tourContent}>
                                        <div className={styles.tourMeta}>
                                            <span>⏱️ {tour.duration}</span>
                                            <span style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>{tour.city}</span>
                                        </div>
                                        <h3>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            <span>From <strong>${tour.price}</strong></span>
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <p>Our experts are updating our latest experiences. Please check back shortly.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
