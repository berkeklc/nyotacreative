import Link from "next/link";
import styles from "../../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";
import { notFound } from "next/navigation";

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
        populate: {
            heroImage: "*",
            cities: {
                populate: {
                    tours: {
                        populate: ["heroImage"]
                    }
                }
            },
            quickFacts: "*"
        }
    });

    const destinationRaw = data?.data?.[0];
    if (!destinationRaw) return notFound();

    const destination = {
        name: destinationRaw.name,
        tagline: destinationRaw.description,
        heroImage: getStrapiMedia(destinationRaw.heroImage?.url) || "/hero-safari.jpg",
        facts: [
            { label: "Region", value: "East Africa" },
            { label: "Best Time", value: destinationRaw.quickFacts?.bestTimeToVisit || "June - Oct" },
            { label: "Currency", value: destinationRaw.quickFacts?.currency || "TZS" },
            { label: "Language", value: destinationRaw.quickFacts?.language || "Swahili" }
        ]
    };

    // Flatten tours from cities
    const relatedTours = destinationRaw.cities?.flatMap((city: any) =>
        (city.tours || []).map((t: any) => ({
            ...t,
            cityName: city.name,
            imageUrl: getStrapiMedia(t.heroImage?.url)
        }))
    ).slice(0, 4) || [];

    return (
        <div className={styles.page}>
            <main>
                <section className={styles.hero} style={{ minHeight: '65vh', backgroundImage: `url(${destination.heroImage})` }}>
                    <div className={styles.heroOverlay} />
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <nav className={styles.breadcrumb} style={{ color: 'white', marginBottom: '2rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>
                            <span style={{ margin: '0 0.5rem' }}>/</span>
                            <Link href="/tanzania" style={{ color: 'rgba(255,255,255,0.8)' }}>Tanzania</Link>
                            <span style={{ margin: '0 0.5rem' }}>/</span>
                            <span style={{ color: 'white' }}>{destination.name}</span>
                        </nav>
                        <h1 className={styles.heroTitle} style={{ color: 'white', fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '1rem' }}>
                            {destination.name}
                        </h1>
                        <p className={styles.heroSubtitle} style={{ color: 'rgba(255,255,255,0.95)', maxWidth: '650px', fontSize: '1.25rem' }}>
                            {destination.tagline}
                        </p>
                    </div>
                </section>

                <div className="container section">
                    <div className={styles.layoutGrid}>
                        <div className={styles.mainContent}>
                            <section style={{ marginBottom: '4rem' }}>
                                <span className={styles.sectionLabel}>The Essence of {destination.name}</span>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-charcoal)' }}>Travel Guide 2026</h2>
                                <p className={styles.descriptionText} style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-slate)' }}>
                                    {destination.tagline} Beyond the initial welcome, {destination.name} reveals itself as a tapestry of unique landscapes and cultural depth.
                                    Whether you are here for the serenity of nature or the vibrant local energy, our curated insights ensure an authentic journey.
                                </p>
                            </section>

                            <div className={styles.adviceCard} style={{ background: 'var(--color-sand)', padding: '2.5rem', borderRadius: '1rem', borderTop: '4px solid var(--color-terracotta)' }}>
                                <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}>Expert Perspective</h3>
                                <p style={{ color: 'var(--color-charcoal)', fontSize: '1.1rem', fontStyle: 'italic' }}>
                                    "{destination.name} is where the soul of East Africa truly breathes. It's not just a destination; it's a rhythm that stays with you long after you leave."
                                </p>
                            </div>

                            {relatedTours.length > 0 && (
                                <section style={{ marginTop: '5rem' }}>
                                    <div className={styles.sectionHeader}>
                                        <div>
                                            <span className={styles.sectionLabel}>Signature Experiences</span>
                                            <h2>Popular in {destination.name}</h2>
                                        </div>
                                    </div>
                                    <div className={styles.toursGrid} style={{ marginTop: '2rem' }}>
                                        {relatedTours.map((tour: any) => (
                                            <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                                <div
                                                    className={styles.tourImage}
                                                    style={tour.imageUrl ? { backgroundImage: `url(${tour.imageUrl})` } : { backgroundColor: 'var(--color-sand-dark)' }}
                                                />
                                                <div className={styles.tourContent}>
                                                    <div className={styles.tourMeta}>
                                                        <span>⏱️ {tour.duration}</span>
                                                        <span style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>{tour.cityName}</span>
                                                    </div>
                                                    <h3>{tour.name}</h3>
                                                    <div className={styles.tourFooter}>
                                                        <span>From <strong>${tour.priceAdult}</strong></span>
                                                        <span className="btn btn-accent btn-sm">Details</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className={styles.sidebar}>
                            <div className={styles.sidebarCard} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--color-sand-dark)' }}>
                                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-sand-dark)', paddingBottom: '0.75rem' }}>Core Facts</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {destination.facts.map((fact: any, i: number) => (
                                        <div key={i}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-slate)', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                {fact.label}
                                            </span>
                                            <span style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                                                {fact.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.sidebarCard} style={{ marginTop: '2rem', background: 'var(--color-charcoal)', color: 'white', padding: '2rem', borderRadius: '1rem' }}>
                                <h3 style={{ color: 'white' }}>Plan Your Adventure</h3>
                                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                                    Our travel advisors are ready to design a bespoke itinerary for your visit to {destination.name}.
                                </p>
                                <Link href="/contact" className="btn btn-accent" style={{ width: '100%', textAlign: 'center' }}>
                                    Start Planning
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
