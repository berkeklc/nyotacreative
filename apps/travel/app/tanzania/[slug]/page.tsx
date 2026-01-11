import Link from "next/link";
import styles from "../../page.module.css";
import { fetchAPI } from "../../../lib/strapi";
import { notFound } from "next/navigation";

// Fallback logic
const fallbackDestinations: any = {
    zanzibar: {
        name: "Zanzibar",
        tagline: "The Spice Island paradise. Turquoise waters, white sands, and a rich cultural heritage.",
        facts: [
            { label: "Best Time", value: "June to October" },
            { label: "Currency", value: "Tanzanian Shilling (TZS)" },
            { label: "Language", value: "Swahili & English" },
            { label: "Time Zone", value: "EAT (UTC+3)" }
        ]
    },
    serengeti: {
        name: "Serengeti",
        tagline: "Home of the Great Migration. Witness the raw beauty of the African savannah.",
        facts: [
            { label: "Best Time", value: "January to June" },
            { label: "Key Wildlife", value: "The Big Five" },
            { label: "Park Type", value: "National Park" },
            { label: "Area", value: "14,750 km²" }
        ]
    }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return {
        title: `${(slug || "").charAt(0).toUpperCase() + (slug || "").slice(1)} Travel Guide 2026 | Nyota Travel`,
        description: `Complete guide to ${slug}. Discover the best beaches, history, and safari tours.`,
    };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = await fetchAPI("/destinations", {
        filters: { slug: { $eq: slug } },
        populate: "*"
    });

    const destinationRaw = data?.data?.[0];
    const destination = destinationRaw ? {
        name: destinationRaw.name,
        tagline: destinationRaw.description,
        heroImage: destinationRaw.heroImage?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app"}${destinationRaw.heroImage.url}`
            : null,
        facts: [
            { label: "Category", value: "Destination" },
            { label: "Region", value: "East Africa" }
        ]
    } : fallbackDestinations[slug];

    if (!destination) return notFound();

    return (
        <div className={styles.page}>
            <main>
                <section className={styles.hero} style={{ minHeight: '60vh' }}>
                    <div className={styles.heroOverlay} />
                    {destination.heroImage && (
                        <div
                            className={styles.heroImageBg}
                            style={{ backgroundImage: `url(${destination.heroImage})` }}
                        />
                    )}
                    <div className="container">
                        <div className={styles.heroContent} style={{ textAlign: 'left', background: 'transparent', backdropFilter: 'none', boxShadow: 'none' }}>
                            <nav className={styles.breadcrumb} style={{ color: 'white' }}>
                                <Link href="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link> / <Link href="/tanzania" style={{ color: 'rgba(255,255,255,0.8)' }}>Tanzania</Link> / <span style={{ color: 'white' }}>{destination.name}</span>
                            </nav>
                            <h1 className={styles.heroTitle} style={{ color: 'white', fontSize: '5rem' }}>{destination.name}</h1>
                            <p className={styles.heroSubtitle} style={{ color: 'rgba(255,255,255,0.9)', marginLeft: 0, maxWidth: '600px' }}>
                                {destination.tagline}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container section">
                    <div className={styles.layoutGrid}>
                        <div className={styles.mainContent}>
                            <section style={{ marginBottom: '4rem' }}>
                                <span className={styles.sectionLabel}>Overview</span>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About {destination.name}</h2>
                                <p className={styles.descriptionText}>
                                    {destination.tagline} Discover the local culture, explore hidden gems, and plan your perfect trip with Nyota Travel's expert recommendations for 2026.
                                    Tanzania remains one of the world's most evocative destinations, offering a unique blend of adventure and relaxation.
                                </p>
                            </section>

                            <div className={styles.adviceCard} style={{ background: 'var(--color-sand)', borderLeftColor: 'var(--color-terracotta)' }}>
                                <h3 style={{ color: 'var(--color-terracotta)' }}>Why visit {destination.name}?</h3>
                                <p style={{ color: 'var(--color-slate)' }}>
                                    It's a place where time slows down, and nature speaks the loudest. Whether you're tracking the Great Migration or wandering through the ancient alleys of Stone Town, the magic of this region is undeniable.
                                </p>
                            </div>

                            <section style={{ marginTop: '4rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Popular Experiences</h3>
                                <div className={styles.toursGrid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="card-premium">
                                        <h4>Guided Local Tours</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)' }}>Authentic encounters with local communities.</p>
                                    </div>
                                    <div className="card-premium">
                                        <h4>Signature Adventures</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)' }}>Hand-picked experiences by our travel experts.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className={styles.sidebar}>
                            <div className={styles.sidebarCard}>
                                <h3>Quick Facts</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {destination.facts.map((fact: any, i: number) => (
                                        <div key={i}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-slate)', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                {fact.label}
                                            </span>
                                            <span style={{ fontSize: '1rem', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                                                {fact.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.sidebarCard} style={{ marginTop: '2rem' }}>
                                <h3>Contact an Advisor</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', marginBottom: '1.5rem' }}>
                                    Planning a trip to {destination.name}? Let our local experts craft the perfect itinerary for you.
                                </p>
                                <Link href="/contact" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                    Enquire Now
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
