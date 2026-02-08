import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

export const metadata = {
    title: "Tanzania Travel Guide 2026 | Nyota Travel",
    description: "Complete Tanzania travel guide. Discover Zanzibar, Serengeti, Kilimanjaro, Dar es Salaam and more.",
};

export default async function TanzaniaPage() {
    // 1. Fetch Tanzania Destination data
    const destinationRes = await fetchAPI("/destinations", {
        filters: { slug: "tanzania" },
        populate: ["heroImage", "quickFacts"]
    });

    const tanzania = destinationRes?.data?.[0];

    // 2. Fetch cities separately with multiple fallback strategies
    let cities: any[] = [];

    // Strategy 1: Fetch cities by destination ID
    if (tanzania?.id) {
        const citiesRes1 = await fetchAPI("/cities", {
            filters: { destination: { id: { $eq: tanzania.id } } },
            populate: ["heroImage", "tours", "attractions"]
        });
        cities = citiesRes1?.data || [];
    }

    // Strategy 2: Fetch cities by destination slug
    if (cities.length === 0) {
        const citiesRes2 = await fetchAPI("/cities", {
            filters: { destination: { slug: { $eq: "tanzania" } } },
            populate: ["heroImage", "tours", "attractions"]
        });
        cities = citiesRes2?.data || [];
    }

    // Strategy 3: Fetch all cities and filter client-side
    if (cities.length === 0) {
        const allCitiesRes = await fetchAPI("/cities", {
            populate: ["heroImage", "tours", "attractions", "destination"]
        });
        const allCities = allCitiesRes?.data || [];
        if (tanzania?.id) {
            cities = allCities.filter((city: any) => {
                const dest = city.destination;
                if (!dest) return false;
                // Handle both object and ID formats
                if (typeof dest === 'object') {
                    return dest.id === tanzania.id || dest.slug === "tanzania";
                }
                return dest === tanzania.id;
            });
        } else {
            cities = allCities.filter((city: any) => {
                const dest = city.destination;
                if (!dest) return false;
                if (typeof dest === 'object') {
                    return dest.slug === "tanzania";
                }
                return false;
            });
        }
    }

    // Strategy 4: Try with populate object format (Strapi v4)
    if (cities.length === 0 && tanzania?.id) {
        const citiesRes4 = await fetchAPI("/cities", {
            filters: { destination: tanzania.id },
            populate: ["heroImage", "tours", "attractions"]
        });
        cities = citiesRes4?.data || [];
    }

    // Strategy 5: Last resort - fetch all cities without filter
    if (cities.length === 0) {
        const allCitiesRes = await fetchAPI("/cities", {
            populate: ["heroImage", "tours", "attractions"]
        });
        cities = allCitiesRes?.data || [];
    }

    // Show empty state if destination not found
    if (!tanzania) {
        return (
            <div className={styles.page}>
                <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h2>No destination data available</h2>
                    <p>This destination is not available at the moment.</p>
                    <Link href="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back to Home</Link>
                </main>
            </div>
        );
    }

    const destinationName = tanzania.name || "";
    // Strip HTML from richtext description for display
    const descriptionRaw = tanzania.description || "";
    const description = descriptionRaw ? String(descriptionRaw).replace(/<[^>]*>/g, '').trim() : "";
    const heroImage = getStrapiMedia(tanzania.heroImage?.url);

    // Debug logging
    console.log('[Tanzania Page] Destination:', destinationName);
    console.log('[Tanzania Page] Cities found:', cities.length);
    if (cities.length > 0) {
        console.log('[Tanzania Page] First city:', cities[0]?.name);
    }

    const rawFacts = tanzania.quickFacts;
    const quickFacts = [
        { label: "Language", value: rawFacts?.language || "" },
        { label: "Currency", value: rawFacts?.currency || "" },
        { label: "Best Time", value: rawFacts?.bestTimeToVisit || "" },
        { label: "Population", value: rawFacts?.population || "" },
        { label: "Timezone", value: rawFacts?.timezone || "" },
        { label: "Avg Temperature", value: rawFacts?.avgTemperature || "" },
    ].filter(fact => fact.value); // Only show facts that have values from Strapi

    const displayCities = cities.map((c: any) => {
        // Strip HTML tags from richtext description for tagline
        const descriptionText = c.description
            ? String(c.description).replace(/<[^>]*>/g, '').trim()
            : '';
        const tagline = descriptionText ? (descriptionText.slice(0, 100) + (descriptionText.length > 100 ? "..." : "")) : "";

        // Ensure slug exists, fallback to name-based slug if needed
        let citySlug = c.slug || "";
        if (!citySlug && c.name) {
            citySlug = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }

        console.log('[City]', c.name, 'slug:', citySlug);

        return {
            name: c.name || "",
            slug: citySlug,
            tagline: tagline,
            attractions: Array.isArray(c.attractions) ? c.attractions.length : (typeof c.attractions === 'object' && c.attractions?.data ? c.attractions.data.length : 0),
            tours: Array.isArray(c.tours) ? c.tours.length : (typeof c.tours === 'object' && c.tours?.data ? c.tours.data.length : 0),
            image: getStrapiMedia(c.heroImage?.url)
        };
    });

    return (
        <div className={styles.page} style={{ background: '#fff' }}>
            <main>
                {/* Immersive Hero Section */}
                <section style={{
                    height: "90vh",
                    backgroundImage: heroImage ? `url(${heroImage})` : undefined,
                    backgroundColor: heroImage ? undefined : 'var(--color-charcoal)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0'
                }}>
                    <div style={{
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
                        zIndex: 1
                    }} />

                    <div className="container" style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        maxWidth: '1000px'
                    }}>
                        <span style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '1.5rem',
                            fontWeight: 500
                        }}>The Soul of Africa</span>
                        <h1 style={{
                            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                            lineHeight: 1,
                            fontWeight: 300,
                            marginBottom: '2rem',
                            color: '#ffffff',
                            letterSpacing: '-0.03em',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Wild.</span> Ancient. <br />
                            <span style={{ fontWeight: 800 }}>Unforgettable.</span>
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                            color: 'rgba(255,255,255,0.95)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            fontWeight: 300
                        }}>
                            From the eternal snows of Kilimanjaro to the spice-scented shores of Zanzibar.
                        </p>
                    </div>
                </section>

                {/* Editorial Intro & Minimal Facts */}
                <section className="section" style={{ padding: '8rem 0', background: '#fff' }}>
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '4rem',
                            alignItems: 'start'
                        }}>
                            <div>
                                <p style={{
                                    fontSize: '1.5rem',
                                    lineHeight: 1.8,
                                    color: 'var(--color-charcoal)',
                                    fontWeight: 300,
                                    marginBottom: '2rem'
                                }}>
                                    <span style={{
                                        float: 'left',
                                        fontSize: '4.5rem',
                                        lineHeight: 0.8,
                                        paddingRight: '1rem',
                                        fontWeight: 700,
                                        color: 'var(--color-terracotta)'
                                    }}>T</span>
                                    anzania is not just a destination; it is a sensory awakening.
                                    It is the rhythm of the Great Migration thundering across the plains,
                                    the silence of a balloon safari at sunrise, and the warmth of a Swahili greeting.
                                </p>
                                <p style={{
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    color: 'var(--color-slate)',
                                    marginBottom: '3rem'
                                }}>
                                    Here, nature dictates the pace of life. You don't just watch the wildlife;
                                    you become part of their world. Whether you seek the thrill of the chase
                                    or the peace of the ocean, Tanzania offers a journey that touches the soul.
                                </p>

                                {/* Minimal Facts embedded in text flow */}
                                {quickFacts.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '3rem',
                                        padding: '2rem 0',
                                        borderTop: '1px solid rgba(0,0,0,0.1)',
                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                        flexWrap: 'wrap'
                                    }}>
                                        {quickFacts.slice(0, 4).map((fact, i) => (
                                            <div key={i}>
                                                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>{fact.label}</span>
                                                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{fact.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Chapters (Cities) - Zig-Zag Layout */}
                <section className="section" style={{ padding: '0 0 8rem', background: '#fff' }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-terracotta)' }}>Destinations</span>
                            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-charcoal)', marginTop: '1rem' }}>Chapters of Tanzania</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                            {displayCities.map((dest: any, index: number) => (
                                <div key={dest.slug} style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                    gap: '4rem',
                                    alignItems: 'center',
                                    direction: index % 2 === 1 ? 'rtl' : 'ltr' // Alternating layout
                                }}>
                                    {/* Image Side */}
                                    <Link href={`/tanzania/${dest.slug}`} style={{ display: 'block', position: 'relative', height: '500px', overflow: 'hidden', borderRadius: '4px' }}>
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundImage: dest.image ? `url(${dest.image})` : undefined,
                                            backgroundColor: 'var(--color-sand-dark)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'transform 0.7s ease',
                                        }} className={styles.zoomImage} />
                                    </Link>

                                    {/* Text Side */}
                                    <div style={{ direction: 'ltr', padding: '0 1rem' }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '4rem',
                                            fontWeight: 900,
                                            color: 'rgba(0,0,0,0.03)',
                                            lineHeight: 1,
                                            marginBottom: '-1.5rem',
                                            position: 'relative',
                                            zIndex: 0
                                        }}>
                                            0{index + 1}
                                        </span>
                                        <h3 style={{
                                            fontSize: '2.5rem',
                                            fontWeight: 700,
                                            color: 'var(--color-charcoal)',
                                            marginBottom: '1.5rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            {dest.name}
                                        </h3>
                                        {dest.tagline && (
                                            <p style={{
                                                fontSize: '1.1rem',
                                                lineHeight: 1.8,
                                                color: 'var(--color-slate)',
                                                marginBottom: '2rem'
                                            }}>
                                                {dest.tagline}
                                            </p>
                                        )}
                                        <Link href={`/tanzania/${dest.slug}`} className={styles.textLink} style={{
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: 'var(--color-terracotta)',
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            Explore {dest.name} <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {displayCities.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate)' }}>
                                    <p>Regional chapters coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
