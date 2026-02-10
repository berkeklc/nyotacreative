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
        title: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | RushZanzibar`,
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

    // Process richtext content from Strapi
    const processContent = (content: string) => {
        if (!content) return null;
        
        // If it's HTML/richtext, strip tags and format
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        if (!textContent) return null;
        
        // Split into paragraphs
        const paragraphs = textContent.split(/\n\n+/).filter(p => p.trim());
        return paragraphs;
    };

    const contentParagraphs = processContent(guide.content || "");

    return (
        <div className={styles.page} id="top">
            <main style={{ minHeight: "100vh", background: "var(--color-white)" }}>
                {/* Hero Section */}
                {guide.image && (
                    <section style={{
                        height: '60vh',
                        minHeight: '500px',
                        backgroundImage: `url("${guide.image}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                            position: 'absolute',
                            inset: 0,
                            zIndex: 1
                        }} />
                        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '4rem', width: '100%' }}>
                            <nav style={{ 
                                marginBottom: "2rem", 
                                fontSize: "0.9rem", 
                                color: 'rgba(255,255,255,0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Home</Link>
                                <span>/</span>
                                <Link href="/guides" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Guides</Link>
                                <span>/</span>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{guide.categoryLabel}</span>
                            </nav>
                            <span className={styles.guideCategory} style={{ 
                                fontSize: '0.85rem', 
                                marginBottom: '1.5rem',
                                color: 'rgba(255,255,255,0.9)',
                                display: 'inline-block',
                                background: 'rgba(192, 90, 62, 0.2)',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '50px',
                                backdropFilter: 'blur(10px)'
                            }}>{guide.categoryLabel}</span>
                            <h1 style={{ 
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                                fontWeight: 900, 
                                lineHeight: '1.1', 
                                marginBottom: '2rem', 
                                color: '#ffffff', 
                                letterSpacing: '-0.02em',
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                maxWidth: '900px'
                            }}>
                                {guide.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'rgba(255,255,255,0.95)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '50%', 
                                        background: 'rgba(255,255,255,0.2)', 
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        color: 'white', 
                                        fontWeight: 800, 
                                        fontSize: '0.85rem',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}>NY</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{guide.author}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{guide.date}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {!guide.image && (
                    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
                        <nav style={{ 
                            marginBottom: "3rem", 
                            fontSize: "0.9rem", 
                            color: 'var(--color-slate)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <Link href="/" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Home</Link>
                            <span>/</span>
                            <Link href="/guides" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Guides</Link>
                            <span>/</span>
                            <span style={{ color: 'var(--color-terracotta)', fontWeight: 700 }}>{guide.categoryLabel}</span>
                        </nav>
                        <span className={styles.guideCategory} style={{ fontSize: '0.85rem', marginBottom: '1.5rem', display: 'block' }}>{guide.categoryLabel}</span>
                        <h1 style={{ 
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                            fontWeight: 900, 
                            lineHeight: '1.1', 
                            marginBottom: '2rem', 
                            color: 'var(--color-charcoal)', 
                            letterSpacing: '-0.02em'
                        }}>
                            {guide.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '50%', 
                                    background: 'var(--color-charcoal)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: 'white', 
                                    fontWeight: 800, 
                                    fontSize: '0.85rem'
                                }}>NY</div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-charcoal)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{guide.author}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>{guide.date}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: guide.image ? '4rem 2rem' : '0 2rem 4rem' }}>
                    <div className={styles.layoutGrid} style={{ gap: '4rem', alignItems: 'start' }}>
                        <article className={styles.mainContent} style={{ maxWidth: '800px' }}>
                            <section id="content" className={styles.guideArticle} style={{
                                fontSize: '1.15rem',
                                lineHeight: '1.85',
                                color: 'var(--color-charcoal)',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}>
                                {contentParagraphs && contentParagraphs.length > 0 ? (
                                    contentParagraphs.map((para: string, i: number) => {
                                        const trimmedPara = para.trim();
                                        if (!trimmedPara) return null;
                                        
                                        // Check if it's a heading (starts with # or is short and bold-like)
                                        if (trimmedPara.length < 100 && trimmedPara.endsWith(':')) {
                                            return (
                                                <h2 key={i} style={{
                                                    fontSize: '1.75rem',
                                                    fontWeight: 800,
                                                    color: 'var(--color-charcoal)',
                                                    marginTop: '3rem',
                                                    marginBottom: '1.5rem',
                                                    lineHeight: 1.3,
                                                    letterSpacing: '-0.01em'
                                                }}>
                                                    {trimmedPara.replace(':', '')}
                                                </h2>
                                            );
                                        }
                                        
                                        return (
                                            <p key={i} style={{
                                                marginBottom: '2rem',
                                                fontSize: '1.15rem',
                                                lineHeight: '1.85',
                                                color: '#2c2c2c',
                                                fontWeight: 400
                                            }}>
                                                {trimmedPara}
                                            </p>
                                        );
                                    })
                                ) : (
                                    <p style={{
                                        fontSize: '1.15rem',
                                        lineHeight: '1.85',
                                        color: 'var(--color-slate)',
                                        fontStyle: 'italic'
                                    }}>
                                        Content is currently being updated by our travel advisors. Please check back shortly.
                                    </p>
                                )}
                            </section>

                            <section id="advice" style={{ marginTop: '5rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #fff8f4 0%, #ffe8dd 100%)',
                                    padding: '3.5rem',
                                    borderRadius: '2rem',
                                    border: '2px solid rgba(192, 90, 62, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '1.5rem', 
                                        right: '2rem', 
                                        fontSize: '6rem', 
                                        opacity: 0.08, 
                                        color: 'var(--color-terracotta)', 
                                        fontStyle: 'italic',
                                        lineHeight: 1,
                                        fontFamily: 'Georgia, serif'
                                    }}>"</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'var(--color-terracotta)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            flexShrink: 0
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 16h.01" /><path d="M12 8h.01" /><path d="M11 12h1v4h1" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            </svg>
                                        </div>
                                        <h3 style={{ 
                                            color: 'var(--color-terracotta)', 
                                            fontSize: '1.35rem', 
                                            fontWeight: 800,
                                            margin: 0
                                        }}>
                                            Expert Insight
                                        </h3>
                                    </div>
                                    <p style={{ 
                                        fontSize: '1.25rem', 
                                        fontWeight: 500, 
                                        lineHeight: '1.75', 
                                        color: 'var(--color-charcoal)', 
                                        position: 'relative', 
                                        zIndex: 1,
                                        margin: 0
                                    }}>
                                        {guide.expertAdvice}
                                    </p>
                                </div>
                            </section>

                            {/* Related Content Section */}
                            {relatedGuides.length > 0 && (
                                <section id="related" style={{ 
                                    marginTop: '6rem', 
                                    padding: '5rem 0 2rem', 
                                    borderTop: '2px solid rgba(0,0,0,0.06)'
                                }}>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <span className={styles.sectionLabel} style={{ marginBottom: '1rem', display: 'block' }}>More Guides</span>
                                        <h2 style={{ 
                                            fontSize: 'clamp(2rem, 4vw, 2.75rem)', 
                                            fontWeight: 900, 
                                            color: 'var(--color-charcoal)',
                                            lineHeight: 1.2,
                                            margin: 0
                                        }}>
                                            Continue Exploring
                                        </h2>
                                    </div>
                                    <div className={styles.guidesGrid} style={{ 
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                                        gap: '2.5rem'
                                    }}>
                                        {relatedGuides.map((rel: any) => (
                                            <Link href={`/guides/${rel.slug}`} key={rel.slug} style={{ textDecoration: 'none', display: 'block' }}>
                                                <div className={styles.guideCard} style={{ 
                                                    borderRadius: '1.5rem',
                                                    height: '100%',
                                                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                                }}>
                                                    <div className={styles.guideImage} style={{ 
                                                        backgroundImage: rel.image ? `url("${rel.image}")` : undefined,
                                                        backgroundColor: rel.image ? undefined : 'var(--color-sand-dark)',
                                                        aspectRatio: '16/10',
                                                        borderRadius: '1.5rem 1.5rem 0 0'
                                                    }} />
                                                    <div className={styles.guideContent} style={{ padding: '2rem' }}>
                                                        <span className={styles.guideCategory} style={{ 
                                                            fontSize: '0.75rem',
                                                            marginBottom: '1rem',
                                                            display: 'block'
                                                        }}>
                                                            {rel.category}
                                                        </span>
                                                        <h4 style={{ 
                                                            fontSize: '1.3rem', 
                                                            fontWeight: 800, 
                                                            color: 'var(--color-charcoal)', 
                                                            margin: 0,
                                                            lineHeight: 1.3
                                                        }}>
                                                            {rel.title}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </article>

                        <aside className={styles.sidebar} style={{ position: 'sticky', top: '2rem' }}>
                            <div className={styles.sidebarCard} style={{
                                background: 'var(--color-white)',
                                padding: '2.5rem',
                                borderRadius: '1.5rem',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
                            }}>
                                <h3 style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: 800, 
                                    marginBottom: '1.5rem', 
                                    paddingBottom: '1rem', 
                                    borderBottom: '2px solid var(--color-sand-dark)',
                                    color: 'var(--color-charcoal)'
                                }}>
                                    Quick Links
                                </h3>
                                <ul className={styles.sidebarLinks} style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem'
                                }}>
                                    <li><Link href="#top" style={{ 
                                        textDecoration: 'none', 
                                        color: 'var(--color-slate)', 
                                        fontWeight: 600, 
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        padding: '0.5rem 0.75rem',
                                        marginLeft: '-0.75rem',
                                        borderRadius: '0.5rem'
                                    }}>Introduction</Link></li>
                                    <li><Link href="#content" style={{ 
                                        textDecoration: 'none', 
                                        color: 'var(--color-slate)', 
                                        fontWeight: 600, 
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        padding: '0.5rem 0.75rem',
                                        marginLeft: '-0.75rem',
                                        borderRadius: '0.5rem'
                                    }}>Full Guide</Link></li>
                                    <li><Link href="#advice" style={{ 
                                        textDecoration: 'none', 
                                        color: 'var(--color-slate)', 
                                        fontWeight: 600, 
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        padding: '0.5rem 0.75rem',
                                        marginLeft: '-0.75rem',
                                        borderRadius: '0.5rem'
                                    }}>Expert Tips</Link></li>
                                    <li><Link href="#related" style={{ 
                                        textDecoration: 'none', 
                                        color: 'var(--color-slate)', 
                                        fontWeight: 600, 
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        padding: '0.5rem 0.75rem',
                                        marginLeft: '-0.75rem',
                                        borderRadius: '0.5rem'
                                    }}>Related Guides</Link></li>
                                </ul>

                                <div style={{ 
                                    marginTop: '2.5rem', 
                                    paddingTop: '2rem', 
                                    borderTop: '1px solid var(--color-sand-dark)' 
                                }}>
                                    <h4 style={{ 
                                        fontSize: '0.85rem', 
                                        textTransform: 'uppercase', 
                                        color: 'var(--color-slate)', 
                                        marginBottom: '1rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.1em'
                                    }}>
                                        Ready to explore?
                                    </h4>
                                    <Link href="/tours" className="btn btn-accent" style={{ 
                                        width: '100%', 
                                        textAlign: 'center',
                                        display: 'block',
                                        padding: '0.875rem 1.5rem',
                                        borderRadius: '0.75rem',
                                        fontWeight: 700
                                    }}>
                                        View Expert Tours
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.sidebarCard} style={{ 
                                marginTop: '2rem', 
                                background: 'linear-gradient(135deg, var(--color-terracotta) 0%, #b85a3a 100%)', 
                                color: 'white', 
                                border: 'none',
                                padding: '2.5rem',
                                borderRadius: '1.5rem',
                                boxShadow: '0 15px 50px rgba(192, 90, 62, 0.2)'
                            }}>
                                <h3 style={{ 
                                    color: 'white', 
                                    borderBottomColor: 'rgba(255,255,255,0.2)',
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '2px solid rgba(255,255,255,0.2)'
                                }}>
                                    Free Consultation
                                </h3>
                                <p style={{ 
                                    fontSize: '0.95rem', 
                                    marginBottom: '1.5rem', 
                                    opacity: 0.95,
                                    lineHeight: 1.6
                                }}>
                                    Need a custom itinerary based on this guide? Our local experts are ready to help plan your perfect trip.
                                </p>
                                <Link href="/contact" className="btn" style={{ 
                                    width: '100%', 
                                    background: 'white', 
                                    color: 'var(--color-terracotta)',
                                    textAlign: 'center',
                                    display: 'block',
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s ease'
                                }}>
                                    Talk to an Expert
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
