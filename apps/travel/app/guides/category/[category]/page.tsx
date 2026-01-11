import Link from "next/link";
import styles from "../../../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../../../lib/strapi";

export default async function GuideCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const catName = category.charAt(0).toUpperCase() + category.slice(1);

    const res = await fetchAPI("/articles", {
        populate: "*",
        filters: {
            category: { $containsi: category }
        }
    });

    const guides = (res?.data || []).map((g: any) => {
        if (!g) return null;
        return {
            title: g.title || "Untitled Guide",
            slug: g.slug || "untitiled",
            category: g.category?.replace('-', ' ') || "General",
            author: "Nyota Editor",
            date: g.publishedAt ? new Date(g.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently",
            readTime: g.readTime ? `${g.readTime} min read` : "8 min read",
            image: getStrapiMedia(g.heroImage?.url)
        };
    }).filter(Boolean);

    return (
        <div className={styles.page}>
            <main>
                <section className={styles.hero} style={{ minHeight: '30vh', padding: '120px 0 60px' }}>
                    <div className={styles.heroOverlay} />
                    <div className="container">
                        <div className={styles.heroContent} style={{ background: 'transparent', backdropFilter: 'none', boxShadow: 'none', textAlign: 'left', padding: 0 }}>
                            <span className={styles.heroBadge} style={{ background: 'rgba(192, 90, 62, 0.1)', color: 'var(--color-terracotta)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {catName} Collection
                            </span>
                            <h1 className={styles.heroTitle} style={{ color: 'var(--color-charcoal)', marginTop: '1rem', fontSize: '3.5rem' }}>
                                <span className={styles.heroHighlight}>{catName}</span> Tips
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div style={{ marginBottom: '3rem' }}>
                            <Link href="/guides" style={{ color: 'var(--color-terracotta)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Back to All Guides
                            </Link>
                        </div>

                        {guides.length > 0 ? (
                            <div className={styles.guidesGrid}>
                                {guides.map((guide: any) => {
                                    if (!guide) return null;
                                    const bgStyle = guide.image ? { backgroundImage: `url("${guide.image}")` } : { backgroundColor: 'var(--color-sand-dark)' };

                                    return (
                                        <article key={guide.slug} className={styles.guideCard}>
                                            <div className={styles.guideImage} style={bgStyle} />
                                            <div className={styles.guideContent}>
                                                <span className={styles.guideCategory}>{guide.category}</span>
                                                <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                                                <div className={styles.guideMeta}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6rem' }}>NY</div>
                                                        {guide.author}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{guide.date}</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-slate)' }}>
                                <h3>No {catName} guides found.</h3>
                                <p>We are currently updating our local insights for this category.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
