import Link from "next/link";
import styles from "../../page.module.css";

export const metadata = {
    title: "Zanzibar Travel Guide 2026 | Beaches, Tours & Hotels",
    description: "Complete Zanzibar guide. Discover the best beaches, Stone Town history, spice tours, hotels and local tips.",
};

const attractions = [
    { name: "Stone Town", slug: "stone-town", category: "Historical" },
    { name: "Nungwi Beach", slug: "nungwi-beach", category: "Beach" },
    { name: "Prison Island", slug: "prison-island", category: "Wildlife" },
    { name: "Jozani Forest", slug: "jozani-forest", category: "Nature" },
    { name: "Spice Farms", slug: "spice-farms", category: "Cultural" },
    { name: "Kendwa Beach", slug: "kendwa-beach", category: "Beach" },
];

const tours = [
    { name: "Spice Tour", slug: "zanzibar-spice-tour", duration: "Half Day", price: 45 },
    { name: "Stone Town Walk", slug: "stone-town-walking-tour", duration: "3 Hours", price: 35 },
    { name: "Safari Blue", slug: "safari-blue", duration: "Full Day", price: 95 },
    { name: "Dolphins & Snorkel", slug: "dolphins-snorkeling", duration: "Full Day", price: 75 },
];

export default function ZanzibarPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>✦</span>
                        NYOTA TRAVEL
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/tanzania">Tanzania</Link>
                        <Link href="/tanzania/zanzibar">Zanzibar</Link>
                        <Link href="/tours">Tours</Link>
                        <Link href="/guides">Guides</Link>
                    </div>
                    <div className={styles.navActions}>
                        <Link href="/tours" className="btn btn-primary">Book a Tour</Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "80px" }}>
                <section className={styles.hero} style={{ minHeight: "60vh" }}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <nav style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                            <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Home</Link>
                            <span style={{ margin: "0 0.5rem", color: "rgba(255,255,255,0.5)" }}>/</span>
                            <Link href="/tanzania" style={{ color: "rgba(255,255,255,0.7)" }}>Tanzania</Link>
                            <span style={{ margin: "0 0.5rem", color: "rgba(255,255,255,0.5)" }}>/</span>
                            <span>Zanzibar</span>
                        </nav>
                        <h1>Zanzibar</h1>
                        <p className={styles.heroSubtitle}>
                            The Spice Island paradise. Crystal-clear waters, historic Stone Town,
                            and world-class beaches await.
                        </p>
                    </div>
                </section>

                {/* Quick Facts */}
                <section style={{ background: "var(--color-white)", padding: "2rem 0" }}>
                    <div className="container">
                        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-ocean)", fontWeight: 600 }}>Population</div>
                                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>1.8 million</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-ocean)", fontWeight: 600 }}>Language</div>
                                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>Swahili, English</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-ocean)", fontWeight: 600 }}>Best Time</div>
                                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>June - October</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-ocean)", fontWeight: 600 }}>Avg Temp</div>
                                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>25-30°C</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Attractions */}
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Discover</span>
                                <h2>Top Attractions</h2>
                            </div>
                            <Link href="/tanzania/zanzibar/attractions" className="btn btn-secondary">View All →</Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "2rem" }}>
                            {attractions.map((attraction) => (
                                <Link key={attraction.slug} href={`/attractions/${attraction.slug}`} className="card" style={{ padding: "1.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-ocean)", textTransform: "uppercase" }}>{attraction.category}</span>
                                    <h3 style={{ margin: "0.5rem 0 0" }}>{attraction.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tours */}
                <section className="section" style={{ background: "var(--color-white)" }}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Book Now</span>
                                <h2>Popular Tours</h2>
                            </div>
                            <Link href="/tours?location=zanzibar" className="btn btn-secondary">All Zanzibar Tours →</Link>
                        </div>
                        <div className={styles.toursGrid} style={{ marginTop: "2rem" }}>
                            {tours.map((tour) => (
                                <article key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div className={styles.tourImage} />
                                    <div className={styles.tourContent}>
                                        <div className={styles.tourMeta}>
                                            <span>⏱️ {tour.duration}</span>
                                        </div>
                                        <h3>{tour.name}</h3>
                                        <div className={styles.tourFooter}>
                                            <span className={styles.tourPrice}>
                                                From <strong>${tour.price}</strong>
                                            </span>
                                            <Link href={`/tours/${tour.slug}`} className="btn btn-accent">Book</Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerBottom}>
                        <p>© {new Date().getFullYear()} Nyota Travel. A Nyota Creative project.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
