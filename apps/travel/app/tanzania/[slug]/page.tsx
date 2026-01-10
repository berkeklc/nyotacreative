import Link from "next/link";
import styles from "../../page.module.css";
import { fetchAPI } from "../../../lib/strapi";
import { notFound } from "next/navigation";

// Fallback logic
const fallbackDestinations: any = {
    zanzibar: { name: "Zanzibar", description: "The Spice Island paradise. Turquoise waters, white sands, and a rich cultural heritage." },
    serengeti: { name: "Serengeti", description: "Home of the Great Migration. Witness the raw beauty of the African savannah." },
    kilimanjaro: { name: "Kilimanjaro", description: "The Roof of Africa. Conquer the highest peak on the continent." },
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

    // Fetch destination from Strapi
    const data = await fetchAPI("/destinations", {
        filters: {
            slug: {
                $eq: slug
            }
        },
        populate: "*"
    });

    const destinationRaw = data?.data?.[0];

    const destination = destinationRaw ? {
        name: destinationRaw.name,
        tagline: destinationRaw.description,
        heroImage: destinationRaw.heroImage?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app"}${destinationRaw.heroImage.url}`
            : null
    } : fallbackDestinations[slug] || { name: slug, tagline: "Details coming soon." };

    if (!destinationRaw && !fallbackDestinations[slug]) {
        return notFound();
    }

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "100px" }}>
                <section className={styles.hero} style={{ minHeight: "60vh", background: destination.heroImage ? `url(${destination.heroImage}) center/cover` : 'var(--color-ocean)' }}>
                    <div className={styles.heroOverlay} style={{ background: 'rgba(0,0,0,0.4)' }} />
                    <div className={styles.heroContent} style={{ position: 'relative', zIndex: 2 }}>
                        <nav style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>
                            <Link href="/">Home</Link> / <Link href="/tanzania">Tanzania</Link> / <span style={{ color: '#fff' }}>{destination.name}</span>
                        </nav>
                        <h1 style={{ color: '#fff', fontSize: 'clamp(3rem, 7vw, 5rem)' }}>{destination.name}</h1>
                        <p className={styles.heroSubtitle}>
                            {destination.tagline}
                        </p>
                    </div>
                </section>

                <div className="container" style={{ padding: "4rem 0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem" }}>
                        <div>
                            <h2>About {destination.name}</h2>
                            <p style={{ fontSize: "1.125rem", lineHeight: "1.8", color: "var(--color-slate)", marginTop: "1rem" }}>
                                {destination.tagline}. Discover the local culture, explore hidden gems, and plan your perfect trip with Nyota Travel's expert recommendations for 2026.
                            </p>

                            <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                <div className="card" style={{ padding: "2rem" }}>
                                    <h3 style={{ marginBottom: "0.5rem" }}>Best Time to Visit</h3>
                                    <p>June to October (Dry Season)</p>
                                </div>
                                <div className="card" style={{ padding: "2rem" }}>
                                    <h3 style={{ marginBottom: "0.5rem" }}>Key Highlights</h3>
                                    <p>Culture, Safari, Adventure</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar">
                            <div className="card" style={{ padding: "2rem", background: "var(--color-sand)" }}>
                                <h3 style={{ marginBottom: "1rem" }}>In This Guide</h3>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <li><Link href="#overview" style={{ color: "var(--color-ocean)", fontWeight: 500 }}>Overview</Link></li>
                                    <li><Link href="#tours" style={{ color: "var(--color-ocean)", fontWeight: 500 }}>Top Tours</Link></li>
                                    <li><Link href="#hotels" style={{ color: "var(--color-ocean)", fontWeight: 500 }}>Where to Stay</Link></li>
                                    <li><Link href="#tips" style={{ color: "var(--color-ocean)", fontWeight: 500 }}>Travel Tips</Link></li>
                                </ul>
                                <Link href="/tours" className="btn btn-primary" style={{ width: "100%", marginTop: "2rem" }}>Book a Tour</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
