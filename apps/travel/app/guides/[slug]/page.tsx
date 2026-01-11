import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";

interface GuideContent {
    slug?: string;
    title: string;
    content: string;
    category: string;
    categoryLabel: string;
    author: string;
    date: string;
    image?: string | null;
    expertAdvice: string;
}

// Fallback guides
const fallbackGuides: GuideContent[] = [
    {
        slug: "best-beaches-zanzibar-2026",
        title: "Best Beaches in Zanzibar: 2026 Guide",
        content: "Nungwi and Kendwa offer the best swimming experiences due to smaller tidal variances. Paje is perfect for kite surfing. Discover the crystal clear waters and white sandy beaches of the Spice Island. The northern tip of the island remains the most popular for those seeking consistent beach time without the extreme low tides found on the east coast.",
        category: "beaches",
        categoryLabel: "Beaches",
        author: "Sarah Mwangi",
        date: "Jan 8, 2026",
        expertAdvice: "Traveler Tip: Head to Kendwa Rocks on a Saturday for their famous beach party, or visit Nungwi Mnarani Aquarium to see the sea turtle conservation project."
    },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return {
        title: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Nyota Travel`,
        description: "Expert travel guide and local tips for your Tanzania adventure.",
    };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = await fetchAPI("/articles", {
        filters: { slug: { $eq: slug } },
        populate: "*"
    });

    const guideRaw = data?.data?.[0];

    // Safety check for content rendering - prevents 500 error if data structure is off
    const guide = guideRaw ? {
        title: guideRaw.title || "Untitled Guide",
        content: guideRaw.content || "",
        category: guideRaw.category || "tips",
        categoryLabel: guideRaw.category?.replace('-', ' ') || "General",
        date: guideRaw.publishedAt ? new Date(guideRaw.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently",
        author: "Nyota Editorial Team",
        image: getStrapiMedia(guideRaw.heroImage?.url),
        expertAdvice: guideRaw.expertAdvice || "Local Insight: Enjoy the journey 'Haba na Haba'. Take your time to truly connect with the locations you visit."
    } : fallbackGuides.find(g => g.slug === slug);

    if (!guide) return notFound();

    // Fetch Related Articles
    const relatedData = await fetchAPI("/articles", {
        filters: {
            category: { $eq: guide.category },
            slug: { $ne: slug }
        },
        pagination: { limit: 3 },
        populate: "*"
    });

    const relatedGuides = (relatedData?.data || []).map((g: any) => ({
        title: g.title,
        slug: g.slug,
        image: getStrapiMedia(g.heroImage?.url),
        category: g.category?.replace('-', ' ')
    }));

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "100px", minHeight: "80vh", background: "var(--color-sand)" }}>
                <div className="container" style={{ paddingTop: '2rem' }}>
                    <nav className={styles.breadcrumb} style={{ marginBottom: '4rem' }}>
                        <Link href="/" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 0.75rem', color: 'rgba(0,0,0,0.1)' }}>/</span>
                        <Link href="/guides" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Guides</Link>
                        <span style={{ margin: '0 0.75rem', color: 'rgba(0,0,0,0.1)' }}>/</span>
                        <span style={{ color: 'var(--color-terracotta)', fontWeight: 800 }}>{guide.categoryLabel}</span>
                    </nav>

                    <div className={styles.layoutGrid}>
                        <article className={styles.mainContent}>
                            <header style={{ marginBottom: '5rem' }}>
                                <span className={styles.guideCategory} style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{guide.categoryLabel}</span>
                                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: '1.1', marginBottom: '2.5rem', color: 'var(--color-charcoal)', letterSpacing: '-0.03em' }}>
                                    {guide.title}
                                </h1>

                                <div className={styles.guideMeta} style={{ border: 'none', paddingTop: 0, marginBottom: '4rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>NY</div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--color-charcoal)', fontSize: '1rem' }}>{guide.author}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-slate)', marginTop: '0.2rem' }}>Travel Advisors • {guide.date}</div>
                                        </div>
                                    </div>
                                </div>

                                {guide.image && (
                                    <div className={styles.guideImage} style={{
                                        backgroundImage: `url("${guide.image}")`,
                                        height: '550px',
                                        borderRadius: '3rem',
                                        marginBottom: '4rem',
                                        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.15)'
                                    }} />
                                )}
                            </header>

                            <section className={styles.guideArticle}>
                                {guide.content ? (
                                    guide.content.split('\n').map((para: string, i: number) => (
                                        para.trim() && <p key={i}>{para}</p>
                                    ))
                                ) : (
                                    <p>Content is currently being updated by our advisors. Please check back shortly.</p>
                                )}
                            </section>

                            <section style={{ marginTop: '6rem' }}>
                                <div className={styles.adviceCard}>
                                    <div style={{ position: 'absolute', top: '2rem', right: '3rem', fontSize: '5rem', opacity: 0.05, color: 'var(--color-terracotta)', fontStyle: 'italic', fontVariant: 'small-caps' }}>
                                        “
                                    </div>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16h.01" /><path d="M12 8h.01" /><path d="M11 12h1v4h1" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /></svg>
                                        Advisor Insights
                                    </h3>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 600, lineHeight: '1.7', color: 'var(--color-charcoal)', position: 'relative', zIndex: 1 }}>
                                        {guide.expertAdvice}
                                    </p>
                                </div>
                            </section>

                            {/* Related Content Section */}
                            {relatedGuides.length > 0 && (
                                <section style={{ marginTop: '8rem', padding: '5rem 0 0', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', color: 'var(--color-charcoal)' }}>Continue Reading</h2>
                                    <div className={styles.guidesGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                        {relatedGuides.map((rel: any) => (
                                            <Link href={`/guides/${rel.slug}`} key={rel.slug} style={{ textDecoration: 'none' }}>
                                                <div className={styles.guideCard} style={{ borderRadius: '1.5rem' }}>
                                                    <div className={styles.guideImage} style={{ backgroundImage: `url("${rel.image}")`, aspectRatio: '16/9' }} />
                                                    <div className={styles.guideContent} style={{ padding: '1.5rem' }}>
                                                        <span className={styles.guideCategory} style={{ fontSize: '0.7rem' }}>{rel.category}</span>
                                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>{rel.title}</h4>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </article>

                        <aside className={styles.sidebar}>
                            <div className={styles.sidebarCard}>
                                <h3>Guide Navigation</h3>
                                <ul className={styles.sidebarLinks}>
                                    <li><Link href="#top">Introduction</Link></li>
                                    <li><Link href="#details">Key Details</Link></li>
                                    <li><Link href="#advice">Expert Advice</Link></li>
                                    <li><Link href="#related">Related Guides</Link></li>
                                </ul>

                                <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-sand-dark)' }}>
                                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-slate)', marginBottom: '1rem' }}>Ready to explore?</h4>
                                    <Link href="/tours" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                        View Expert Tours
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.sidebarCard} style={{ marginTop: '2rem', background: 'var(--color-ochre)', color: 'white', border: 'none' }}>
                                <h3 style={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.2)' }}>Free Consultation</h3>
                                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                                    Need a custom itinerary based on this guide? Our local experts are ready to help.
                                </p>
                                <button className="btn" style={{ width: '100%', background: 'white', color: 'var(--color-ochre)' }}>
                                    Talk to an Expert
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
