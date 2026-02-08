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

    // Try destination first
    let destinationRaw = null;
    const destinationData = await fetchAPI("/destinations", {
        filters: { slug: { $eq: slug } },
        populate: ["heroImage", "cities", "cities.tours", "cities.tours.heroImage", "quickFacts"]
    });
    destinationRaw = destinationData?.data?.[0];

    // If not found, try city
    let cityRaw = null;
    if (!destinationRaw) {
        const cityData = await fetchAPI("/cities", {
            filters: { slug: { $eq: slug } },
            populate: ["heroImage", "destination", "tours", "tours.heroImage", "attractions", "quickFacts"]
        });
        cityRaw = cityData?.data?.[0];
    }

    if (!destinationRaw && !cityRaw) return notFound();

    // Handle both destination and city
    const isCity = !!cityRaw;
    const dataRaw = destinationRaw || cityRaw;

    // Strip HTML from richtext description
    const descriptionRaw = dataRaw?.description || "";
    const descriptionText = descriptionRaw ? String(descriptionRaw).replace(/<[^>]*>/g, '').trim() : "";

    const rawFacts = dataRaw?.quickFacts || (isCity && cityRaw?.destination?.quickFacts);
    const facts = [
        { label: "Language", value: rawFacts?.language || "" },
        { label: "Currency", value: rawFacts?.currency || "" },
        { label: "Best Time", value: rawFacts?.bestTimeToVisit || "" },
        { label: "Population", value: rawFacts?.population || "" },
        { label: "Timezone", value: rawFacts?.timezone || "" },
        { label: "Avg Temperature", value: rawFacts?.avgTemperature || "" },
    ].filter(fact => fact.value);

    const destination = {
        id: dataRaw?.id,
        name: dataRaw?.name || "",
        tagline: descriptionText,
        heroImage: getStrapiMedia(dataRaw?.heroImage?.url),
        facts: facts
    };

    // Get related tours - from cities if destination, or directly if city
    let relatedTours: any[] = [];
    if (destinationRaw) {
        relatedTours = (destinationRaw.cities || []).flatMap((city: any) =>
            (city.tours || []).map((t: any) => ({
                ...t,
                cityName: city.name,
                imageUrl: getStrapiMedia(t.heroImage?.url)
            }))
        ).slice(0, 4);
    } else if (cityRaw) {
        relatedTours = (cityRaw.tours || []).map((t: any) => ({
            ...t,
            cityName: cityRaw.name,
            imageUrl: getStrapiMedia(t.heroImage?.url)
        })).slice(0, 4);
    }

    return (
        <div className={styles.page} style={{ background: '#fff' }}>
            <main>
                <section className={styles.hero} style={{
                    height: '85vh',
                    backgroundImage: destination.heroImage ? `url(${destination.heroImage})` : undefined,
                    backgroundColor: destination.heroImage ? undefined : 'var(--color-charcoal)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <div className={styles.heroOverlay} style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
                    }} />
                    <div className="container" style={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <nav className={styles.breadcrumb} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                            <span style={{ margin: '0 0.75rem', opacity: 0.5 }}>/</span>
                            <Link href="/tanzania" style={{ color: 'inherit', textDecoration: 'none' }}>Tanzania</Link>
                            {isCity && cityRaw?.destination && (
                                <>
                                    <span style={{ margin: '0 0.75rem', opacity: 0.5 }}>/</span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{cityRaw.destination.name}</span>
                                </>
                            )}
                            <span style={{ margin: '0 0.75rem', opacity: 0.5 }}>/</span>
                            <span style={{ color: '#fff', fontWeight: 500 }}>{destination.name}</span>
                        </nav>
                        <h1 className={styles.heroTitle} style={{
                            color: 'white',
                            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                            marginBottom: '1.5rem',
                            fontWeight: 300,
                            letterSpacing: '-0.02em',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            {destination.name}
                        </h1>
                        {destination.tagline && (
                            <p className={styles.heroSubtitle} style={{
                                color: 'rgba(255,255,255,0.95)',
                                maxWidth: '700px',
                                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                                lineHeight: 1.6,
                                fontWeight: 300
                            }}>
                                {destination.tagline}
                            </p>
                        )}
                    </div>
                </section>

                <div className="container section" style={{ padding: '6rem 2rem' }}>
                    <div className={styles.layoutGrid} style={{ gap: '6rem' }}>
                        <div className={styles.mainContent}>
                            <section style={{ marginBottom: '6rem' }}>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    marginBottom: '2rem',
                                    color: 'var(--color-charcoal)',
                                    fontWeight: 300,
                                    letterSpacing: '-0.02em'
                                }}>
                                    About {destination.name}
                                </h2>
                                {destination.tagline && (
                                    <p className={styles.descriptionText} style={{
                                        fontSize: '1.2rem',
                                        lineHeight: '1.9',
                                        color: 'var(--color-slate)',
                                        fontWeight: 300
                                    }}>
                                        <span style={{
                                            float: 'left',
                                            fontSize: '3.5rem',
                                            lineHeight: 0.8,
                                            paddingRight: '1rem',
                                            fontWeight: 700,
                                            color: 'var(--color-terracotta)'
                                        }}>{destination.tagline.charAt(0)}</span>
                                        {destination.tagline.substring(1)}
                                    </p>
                                )}
                            </section>


                            {relatedTours.length > 0 && (
                                <section style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-terracotta)', display: 'block', marginBottom: '0.5rem' }}>Experiences</span>
                                        <h2 style={{ fontSize: '2rem', color: 'var(--color-charcoal)', fontWeight: 300 }}>Curated Journeys</h2>
                                    </div>
                                    <div className={styles.toursGrid} style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                        gap: '2.5rem'
                                    }}>
                                        {relatedTours.map((tour: any) => (
                                            <Link href={`/tours/${tour.slug}`} key={tour.slug} className={styles.tourCard} style={{ textDecoration: 'none', display: 'block' }}>
                                                <div
                                                    className={styles.tourImage}
                                                    style={{
                                                        backgroundImage: tour.imageUrl ? `url(${tour.imageUrl})` : undefined,
                                                        backgroundColor: 'var(--color-sand-dark)',
                                                        paddingBottom: '65%',
                                                        backgroundSize: 'cover',
                                                        borderRadius: '4px',
                                                        marginBottom: '1.5rem'
                                                    }}
                                                />
                                                <div className={styles.tourContent}>
                                                    <div className={styles.tourMeta} style={{ fontSize: '0.85rem', color: 'var(--color-slate)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        <span>{tour.duration}</span>
                                                        <span style={{ margin: '0 0.5rem' }}>•</span>
                                                        <span style={{ color: 'var(--color-terracotta)' }}>{tour.cityName}</span>
                                                    </div>
                                                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-charcoal)', marginBottom: '0.5rem', fontWeight: 600 }}>{tour.name}</h3>
                                                    <div className={styles.tourFooter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                                        <span style={{ fontSize: '0.95rem', color: 'var(--color-slate)' }}>From <strong style={{ color: 'var(--color-charcoal)' }}>${tour.priceAdult}</strong></span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>View Journey →</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className={styles.sidebar} style={{ marginTop: '1rem' }}>
                            <div className={styles.sidebarCard} style={{ padding: '0 0 2rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <h3 style={{
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    color: 'var(--color-charcoal)'
                                }}>At a Glance</h3>
                                {destination.facts.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {destination.facts.map((fact: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--color-slate)' }}>
                                                    {fact.label}
                                                </span>
                                                <span style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)', fontWeight: 500, textAlign: 'right' }}>
                                                    {fact.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', fontStyle: 'italic' }}>Details coming soon.</p>
                                )}
                            </div>

                            <div className={styles.sidebarCard} style={{ marginTop: '3rem' }}>
                                <h3 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 300,
                                    color: 'var(--color-charcoal)',
                                    marginBottom: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    Dreaming of {destination.name}?
                                </h3>
                                <p style={{ fontSize: '1rem', color: 'var(--color-slate)', marginBottom: '2rem', lineHeight: 1.7 }}>
                                    Let us craft a bespoke itinerary tailored to your rhythm and style.
                                </p>
                                <Link href="/contact" className="btn btn-accent" style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    display: 'block',
                                    background: 'var(--color-charcoal)',
                                    color: '#fff',
                                    padding: '1rem',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.85rem'
                                }}>
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
