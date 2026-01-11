import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Tanzania Travel Guide 2026",
    description: "Complete Tanzania travel guide. Discover Zanzibar, Serengeti, Kilimanjaro, Dar es Salaam and more.",
};

const destinations = [
    { name: "Zanzibar", slug: "zanzibar", tagline: "Spice Island Paradise", attractions: 45, tours: 23 },
    { name: "Dar es Salaam", slug: "dar-es-salaam", tagline: "The Harbour of Peace", attractions: 28, tours: 12 },
    { name: "Serengeti", slug: "serengeti", tagline: "The Endless Plains", attractions: 15, tours: 34 },
    { name: "Kilimanjaro", slug: "kilimanjaro", tagline: "Roof of Africa", attractions: 8, tours: 18 },
    { name: "Ngorongoro", slug: "ngorongoro", tagline: "The Crater", attractions: 6, tours: 14 },
    { name: "Arusha", slug: "arusha", tagline: "Safari Capital", attractions: 12, tours: 9 },
];

const quickFacts = [
    { label: "Capital", value: "Dodoma" },
    { label: "Language", value: "Swahili, English" },
    { label: "Currency", value: "Tanzanian Shilling (TZS)" },
    { label: "Best Time", value: "June - October" },
];

export default function TanzaniaPage() {
    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "80px" }}>
                {/* Hero */}
                <section className={styles.hero} style={{ minHeight: "60vh" }}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <nav style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                            <Link href="/" style={{ color: "rgba(255,255,255,0.7)" }}>Home</Link>
                            <span style={{ margin: "0 0.5rem", color: "rgba(255,255,255,0.5)" }}>/</span>
                            <span>Tanzania</span>
                        </nav>
                        <h1>Tanzania</h1>
                        <p className={styles.heroSubtitle}>
                            From the snow-capped peak of Kilimanjaro to the pristine beaches of Zanzibar,
                            Tanzania offers unforgettable adventures.
                        </p>
                    </div>
                </section>

                {/* Quick Facts */}
                <section style={{ background: "var(--color-white)", padding: "2rem 0" }}>
                    <div className="container">
                        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
                            {quickFacts.map((fact) => (
                                <div key={fact.label} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-terracotta)", fontWeight: 600 }}>
                                        {fact.label}
                                    </div>
                                    <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-charcoal)" }}>
                                        {fact.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Destinations Grid */}
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Explore</span>
                                <h2>Destinations in Tanzania</h2>
                            </div>
                        </div>
                        <div className={styles.destinationsGrid} style={{ marginTop: "2rem" }}>
                            {destinations.map((dest) => (
                                <Link
                                    key={dest.slug}
                                    href={`/tanzania/${dest.slug}`}
                                    className={styles.destinationCard}
                                >
                                    <div className={styles.destinationImage} />
                                    <div className={styles.destinationInfo}>
                                        <h3>{dest.name}</h3>
                                        <p>{dest.tagline}</p>
                                        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                                            <span>{dest.attractions} attractions</span>
                                            <span>{dest.tours} tours</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
