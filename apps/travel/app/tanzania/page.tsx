import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

export const metadata = {
    title: "Tanzania Travel Guide 2026 | Nyota Travel",
    description: "Complete Tanzania travel guide. Discover Zanzibar, Serengeti, Kilimanjaro, Dar es Salaam and more.",
};

export default async function TanzaniaPage() {
    // 1. Fetch Tanzania Destination data with cities
    const destinationRes = await fetchAPI("/destinations", {
        filters: { slug: "tanzania" },
        populate: ["heroImage", "cities", "cities.heroImage", "cities.tours", "cities.attractions", "quickFacts"]
    });

    const tanzania = destinationRes?.data?.[0];

    // Fallback if destination not found or API error
    if (!tanzania) {
        return (
            <div className={styles.page}>
                <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h2>Destination data unavailable</h2>
                    <p>We're having trouble reaching our servers. Please try again later.</p>
                    <Link href="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back to Home</Link>
                </main>
            </div>
        );
    }

    const destinationName = tanzania.name || "Tanzania";
    const description = tanzania.description || "From the snow-capped peak of Kilimanjaro to the pristine beaches of Zanzibar, Tanzania offers unforgettable adventures.";
    const heroImage = getStrapiMedia(tanzania.heroImage?.url) || "/hero-safari.jpg";

    const rawFacts = tanzania.quickFacts;
    const quickFacts = [
        { label: "Capital", value: "Dodoma", icon: "🏙️" },
        { label: "Language", value: rawFacts?.language || "Swahili, English", icon: "🗣️" },
        { label: "Currency", value: rawFacts?.currency || "TZS", icon: "💵" },
        { label: "Best Time", value: rawFacts?.bestTimeToVisit || "June - Oct", icon: "☀️" },
    ];

    const displayCities = (tanzania.cities || []).map((c: any) => ({
        name: c.name,
        slug: c.slug,
        tagline: c.description?.slice(0, 100) + "..." || "Explore this beautiful region",
        attractions: Array.isArray(c.attractions) ? c.attractions.length : (typeof c.attractions === 'object' && c.attractions?.data ? c.attractions.data.length : 0),
        tours: Array.isArray(c.tours) ? c.tours.length : (typeof c.tours === 'object' && c.tours?.data ? c.tours.data.length : 0),
        image: getStrapiMedia(c.heroImage?.url)
    }));

    return (
        <div className={styles.page}>
            <main>
                {/* Hero Section */}
                <section className={styles.hero} style={{ minHeight: "75vh", backgroundImage: `url(${heroImage})` }}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent} style={{ maxWidth: '900px' }}>
                        <nav style={{ marginBottom: "2rem", fontSize: "0.9rem", color: 'rgba(255,255,255,0.8)' }}>
                            <Link href="/">Home</Link> <span style={{ margin: '0 0.5rem' }}>/</span> <span>Tanzania</span>
                        </nav>
                        <h1 style={{ fontSize: 'clamp(3.5rem, 12vw, 6rem)', lineHeight: 1 }}>{destinationName}</h1>
                        <p className={styles.heroSubtitle} style={{ fontSize: '1.5rem', fontWeight: 400, color: 'rgba(255,255,255,0.95)' }}>
                            The soul of Africa, where wild savannahs meet turquoise shores.
                        </p>
                    </div>
                </section>

                {/* Core Facts - Premium Bar */}
                <section style={{ background: "var(--color-charcoal)", padding: "3rem 0", marginTop: "-4rem", position: 'relative', zIndex: 5, borderTop: '4px solid var(--color-terracotta)' }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                            {quickFacts.map((fact) => (
                                <div key={fact.label} style={{ textAlign: "center", borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: "2rem", marginBottom: '0.5rem' }}>{fact.icon}</div>
                                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--color-terracotta)", fontWeight: 700, letterSpacing: '0.1em' }}>
                                        {fact.label}
                                    </div>
                                    <div style={{ fontSize: "1.25rem", fontWeight: 500, color: "white" }}>
                                        {fact.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)", padding: '8rem 0' }}>
                    <div className="container">
                        <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <span className={styles.sectionLabel} style={{ justifyContent: 'center' }}>Explore the regions</span>
                            <h2 style={{ fontSize: '3.5rem' }}>Where will your journey begin?</h2>
                            <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', fontSize: '1.1rem', color: 'var(--color-slate)' }}>
                                From the cosmopolitan energy of Dar es Salaam to the ancient alleys of Stone Town, Tanzania is a land of infinite variety.
                            </p>
                        </div>

                        {displayCities.length > 0 ? (
                            <div className={styles.destinationsGrid}>
                                {displayCities.map((dest: any) => (
                                    <Link
                                        key={dest.slug}
                                        href={`/tanzania/${dest.slug}`}
                                        className={styles.destinationCard}
                                        style={{ height: '500px' }}
                                    >
                                        <div
                                            className={styles.destinationImage}
                                            style={dest.image ? { backgroundImage: `url(${dest.image})` } : { backgroundColor: 'var(--color-sand-dark)' }}
                                        />
                                        <div className={styles.destinationInfo} style={{ padding: '2.5rem' }}>
                                            <h3 style={{ fontSize: '2rem' }}>{dest.name}</h3>
                                            <p style={{ fontSize: '1rem', opacity: 0.9 }}>{dest.tagline}</p>
                                            <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", fontSize: "0.8rem", textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                                                <span>{dest.attractions} attractions</span>
                                                <span>{dest.tours} tours</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p>Loading regional highlights...</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
