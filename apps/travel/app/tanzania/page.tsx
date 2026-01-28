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
        { label: "Language", value: rawFacts?.language || "", icon: "🗣️" },
        { label: "Currency", value: rawFacts?.currency || "", icon: "💵" },
        { label: "Best Time", value: rawFacts?.bestTimeToVisit || "", icon: "☀️" },
        { label: "Population", value: rawFacts?.population || "", icon: "🏙️" },
        { label: "Timezone", value: rawFacts?.timezone || "", icon: "🕐" },
        { label: "Avg Temperature", value: rawFacts?.avgTemperature || "", icon: "🌡️" },
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
        <div className={styles.page}>
            <main>
                {/* Hero Section */}
                <section style={{ 
                    minHeight: "85vh", 
                    backgroundImage: heroImage ? `url(${heroImage})` : undefined, 
                    backgroundColor: heroImage ? undefined : 'var(--color-charcoal)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    padding: '0'
                }}>
                    <div style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1
                    }} />
                    <div style={{ 
                        width: '100%',
                        position: 'relative',
                        zIndex: 2,
                        padding: '4rem 2rem 6rem',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}>
                        <nav style={{ 
                            marginBottom: "3rem", 
                            fontSize: "0.9rem", 
                            color: 'rgba(255,255,255,0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: 400
                        }}>
                            <Link href="/" style={{ 
                                color: 'rgba(255,255,255,0.9)', 
                                textDecoration: 'none',
                                transition: 'color 0.3s ease'
                            }}>Home</Link> 
                            <span style={{ opacity: 0.5 }}>/</span> 
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Tanzania</span>
                        </nav>
                        <h1 style={{ 
                            fontSize: 'clamp(4rem, 14vw, 8rem)', 
                            lineHeight: 1,
                            fontWeight: 900,
                            marginBottom: '2.5rem',
                            color: 'rgba(255,255,255,0.95)',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            letterSpacing: '-0.02em',
                            maxWidth: '900px'
                        }}>{destinationName || "Tanzania"}</h1>
                        {description && (
                            <p style={{ 
                                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
                                fontWeight: 400, 
                                color: 'rgba(255,255,255,0.98)',
                                maxWidth: '800px',
                                lineHeight: 1.6,
                                textShadow: '0 2px 10px rgba(0,0,0,0.4)'
                            }}>
                                {description}
                            </p>
                        )}
                    </div>
                </section>

                {/* Core Facts - Info Panel */}
                {quickFacts.length > 0 && (
                    <section style={{ 
                        background: "#2c2c2c", 
                        padding: "3.5rem 0", 
                        marginTop: "-4rem", 
                        position: 'relative', 
                        zIndex: 5, 
                        borderTop: '3px solid var(--color-terracotta)'
                    }}>
                        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                            <div style={{ 
                                display: "flex",
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: "3rem 4rem",
                                maxWidth: '1200px',
                                margin: '0 auto'
                            }}>
                                {quickFacts.map((fact, index) => (
                                    <div 
                                        key={fact.label} 
                                        style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.25rem',
                                            flex: '0 0 auto'
                                        }}
                                    >
                                        <div style={{ 
                                            fontSize: "2rem", 
                                            lineHeight: 1,
                                            flexShrink: 0
                                        }}>{fact.icon}</div>
                                        <div style={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.25rem'
                                        }}>
                                            <div style={{ 
                                                fontSize: "0.7rem", 
                                                textTransform: "uppercase", 
                                                color: "rgba(255,255,255,0.6)", 
                                                fontWeight: 700, 
                                                letterSpacing: '0.15em',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                lineHeight: 1.2
                                            }}>
                                                {fact.label}
                                            </div>
                                            <div style={{ 
                                                fontSize: "1.1rem", 
                                                fontWeight: 600, 
                                                color: "#ffffff",
                                                lineHeight: 1.3,
                                                fontFamily: 'system-ui, -apple-system, sans-serif'
                                            }}>
                                                {fact.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="section" style={{ background: "var(--color-sand)", padding: '10rem 0 8rem' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ 
                            textAlign: 'center', 
                            marginBottom: '6rem'
                        }}>
                            <span className={styles.sectionLabel} style={{ 
                                display: 'inline-block',
                                marginBottom: '1.5rem'
                            }}>Explore the regions</span>
                            <h2 style={{ 
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                fontWeight: 800,
                                color: 'var(--color-charcoal)',
                                marginBottom: '2rem',
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em'
                            }}>Where will your journey begin?</h2>
                            {description && (
                                <p style={{ 
                                    maxWidth: '800px', 
                                    margin: '0 auto', 
                                    fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', 
                                    color: 'var(--color-slate)',
                                    lineHeight: 1.8,
                                    fontWeight: 400
                                }}>
                                    {description}
                                </p>
                            )}
                        </div>

                        {displayCities.length > 0 ? (
                            <div className={styles.destinationsGrid} style={{
                                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                                gap: '3rem',
                                marginTop: '4rem'
                            }}>
                                {displayCities.map((dest: any) => (
                                    <Link
                                        key={dest.slug || dest.name}
                                        href={`/tanzania/${dest.slug}`}
                                        className={styles.destinationCard}
                                        style={{ 
                                            height: '550px',
                                            borderRadius: '2rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 25px 70px rgba(0,0,0,0.12)',
                                            transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                            cursor: 'pointer',
                                            display: 'block',
                                            position: 'relative',
                                            backgroundColor: 'var(--color-white)'
                                        }}
                                    >
                                        <div
                                            className={styles.destinationImage}
                                            style={{
                                                backgroundImage: dest.image ? `url(${dest.image})` : undefined,
                                                backgroundColor: dest.image ? undefined : 'var(--color-sand-dark)',
                                                height: '100%',
                                                width: '100%'
                                            }}
                                        />
                                        <div className={styles.destinationInfo} style={{ 
                                            padding: '3.5rem 2.5rem 2.5rem',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0
                                        }}>
                                            <h3 style={{ 
                                                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                                                fontWeight: 800,
                                                marginBottom: '1rem',
                                                lineHeight: 1.2,
                                                color: '#ffffff',
                                                letterSpacing: '-0.01em'
                                            }}>{dest.name}</h3>
                                            {dest.tagline && (
                                                <p style={{ 
                                                    fontSize: '1.1rem', 
                                                    opacity: 0.95,
                                                    lineHeight: 1.7,
                                                    marginBottom: '2rem',
                                                    color: 'rgba(255,255,255,0.95)',
                                                    fontWeight: 400
                                                }}>
                                                    {dest.tagline}
                                                </p>
                                            )}
                                            <div style={{ 
                                                display: "flex", 
                                                gap: "2.5rem", 
                                                marginTop: "auto", 
                                                fontSize: "0.9rem", 
                                                textTransform: 'uppercase', 
                                                fontWeight: 700, 
                                                letterSpacing: '0.12em',
                                                color: 'rgba(255,255,255,0.95)',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    borderRadius: '50px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                                                    {dest.attractions || 0} attractions
                                                </span>
                                                <span style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    borderRadius: '50px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <span style={{ fontSize: '1.2rem' }}>🎯</span>
                                                    {dest.tours || 0} tours
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '8rem 4rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,244,232,0.9) 100%)',
                                borderRadius: '2rem',
                                border: '2px dashed var(--color-terracotta)',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🗺️</div>
                                <h3 style={{ 
                                    fontSize: '1.5rem',
                                    color: 'var(--color-charcoal)',
                                    marginBottom: '1rem',
                                    fontWeight: 700
                                }}>Exploring Tanzania</h3>
                                <p style={{ 
                                    fontSize: '1.1rem',
                                    color: 'var(--color-slate)',
                                    lineHeight: 1.7,
                                    marginBottom: '0.5rem'
                                }}>We're currently updating our regional highlights.</p>
                                <p style={{ 
                                    fontSize: '0.95rem',
                                    color: 'var(--color-slate)',
                                    opacity: 0.7
                                }}>Check back soon for amazing destinations!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
