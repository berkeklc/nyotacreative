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
        category: guideRaw.category || "General",
        date: guideRaw.publishedAt ? new Date(guideRaw.publishedAt).toLocaleDateString() : "Recently",
        author: "Nyota Editor",
        image: getStrapiMedia(guideRaw.image?.url),
        expertAdvice: guideRaw.expertAdvice || "Local Insight: Enjoy the journey 'Haba na Haba'."
    } : fallbackGuides.find(g => g.slug === slug);

    if (!guide) return notFound();

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px", minHeight: "80vh" }}>
                <div className="container">
                    <nav className={styles.breadcrumb}>
                        <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / <span className={styles.activeStep}>{guide.category}</span>
                    </nav>

                    <div className={styles.layoutGrid}>
                        <article className={styles.mainContent}>
                            <header style={{ marginBottom: '3rem' }}>
                                {guide.image && (
                                    <div className={styles.guideImage} style={{
                                        backgroundImage: `url(${guide.image})`,
                                        height: '400px',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: '2rem'
                                    }} />
                                )}
                                <span className="badge-local" style={{ marginBottom: '1rem', display: 'inline-block' }}>{guide.category}</span>
                                <h1 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>{guide.title}</h1>
                                <div className={styles.guideMeta}>
                                    <span>By {guide.author}</span>
                                    <span>•</span>
                                    <span>Published {guide.date}</span>
                                </div>
                            </header>

                            <section className={styles.guideArticle}>
                                {guide.content ? guide.content.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                )) : (
                                    <p>Content is currently being updated by our advisors. Please check back shortly.</p>
                                )}
                            </section>

                            <section className={styles.adviceSection}>
                                <div className={styles.adviceCard}>
                                    <h3>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                        Expert Local Advice
                                    </h3>
                                    <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--color-slate)' }}>
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
