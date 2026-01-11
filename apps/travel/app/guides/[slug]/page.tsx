import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";

interface GuideContent {
    slug?: string;
    title: string;
    content: string;
    category: string;
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
        category: "Beaches",
        author: "Sarah Mwangi",
        date: "Jan 8, 2026",
        expertAdvice: "Traveler Tip: Head to Kendwa Rocks on a Saturday for their famous beach party, or visit Nungwi Mnarani Aquarium to see the sea turtle conservation project."
    } as any, // Simple cast for fallback type compatibility
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
        category: guideRaw.category?.replace('-', ' ') || "General",
        date: guideRaw.publishedAt ? new Date(guideRaw.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently",
        author: "Nyota Editorial Team",
        image: getStrapiMedia(guideRaw.heroImage?.url),
        expertAdvice: guideRaw.expertAdvice || "Local Insight: Enjoy the journey 'Haba na Haba'. Take your time to truly connect with the locations you visit."
    } : fallbackGuides.find(g => g.slug === slug);

    if (!guide) return notFound();

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "100px", minHeight: "80vh", backgroundImage: "url('/pattern-dots.png')", backgroundRepeat: 'repeat', backgroundSize: '100px' }}>
                <div className="container" style={{ paddingTop: '2rem' }}>
                    <nav className={styles.breadcrumb} style={{ marginBottom: '3rem' }}>
                        <Link href="/">Home</Link> <span style={{ margin: '0 0.5rem', color: 'rgba(0,0,0,0.2)' }}>/</span>
                        <Link href="/guides">Guides</Link> <span style={{ margin: '0 0.5rem', color: 'rgba(0,0,0,0.2)' }}>/</span>
                        <span style={{ color: 'var(--color-terracotta)', fontWeight: 700 }}>{guide.category}</span>
                    </nav>

                    <div className={styles.layoutGrid}>
                        <article className={styles.mainContent}>
                            <header style={{ marginBottom: '4rem' }}>
                                <span className={styles.guideCategory} style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block' }}>{guide.category}</span>
                                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: '1.1', marginBottom: '2rem', color: 'var(--color-charcoal)', letterSpacing: '-0.02em' }}>
                                    {guide.title}
                                </h1>

                                <div className={styles.guideMeta} style={{ border: 'none', paddingTop: 0, marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>NY</div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{guide.author}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Published on {guide.date}</div>
                                        </div>
                                    </div>
                                </div>

                                {guide.image && (
                                    <div className={styles.guideImage} style={{
                                        backgroundImage: `url("${guide.image}")`,
                                        height: '500px',
                                        borderRadius: '2rem',
                                        marginBottom: '3rem',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                                    }} />
                                )}
                            </header>

                            <section className={styles.guideArticle} style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-slate)' }}>
                                {guide.content ? guide.content.split('\n').map((para: string, i: number) => (
                                    <p key={i} style={{ marginBottom: '2rem' }}>{para}</p>
                                )) : (
                                    <p>Content is currently being updated by our advisors. Please check back shortly.</p>
                                )}
                            </section>

                            <section className={styles.adviceSection} style={{ marginTop: '5rem' }}>
                                <div className={styles.adviceCard} style={{ background: 'var(--color-ochre)', color: 'white', padding: '3rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2z" /></svg>
                                    </div>
                                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16h.01" /><path d="M12 8h.01" /><path d="M11 12h1v4h1" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /></svg>
                                        </div>
                                        Advisor Insights
                                    </h3>
                                    <p style={{ fontSize: '1.35rem', fontWeight: 500, lineHeight: '1.6', opacity: 0.95, position: 'relative', zIndex: 1 }}>
                                        "{guide.expertAdvice}"
                                    </p>
                                </div>
                            </section>
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
