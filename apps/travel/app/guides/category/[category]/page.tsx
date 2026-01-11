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
            <main style={{ paddingTop: '100px', background: "var(--color-sand)" }}>
                <div className="container" style={{ paddingTop: '2rem' }}>
                    <nav className={styles.breadcrumb} style={{ marginBottom: '4rem' }}>
                        <Link href="/" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 0.75rem', color: 'rgba(0,0,0,0.1)' }}>/</span>
                        <Link href="/guides" style={{ color: 'var(--color-slate)', textDecoration: 'none' }}>Guides</Link>
                        <span style={{ margin: '0 0.75rem', color: 'rgba(0,0,0,0.1)' }}>/</span>
                        <span style={{ color: 'var(--color-terracotta)', fontWeight: 800 }}>{catName}</span>
                    </nav>

                    <header style={{ marginBottom: '5rem', maxWidth: '800px' }}>
                        <span className={styles.guideCategory} style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{catName} Collection</span>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: '1.1', marginBottom: '2rem', color: 'var(--color-charcoal)', letterSpacing: '-0.03em' }}>
                            Local insights for <span style={{ color: 'var(--color-terracotta)' }}>{catName}</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-slate)', lineHeight: '1.6' }}>
                            Discover expert tips and curated guides specifically for your {catName.toLowerCase()} adventure in Tanzania.
                        </p>
                    </header>

                    {guides.length > 0 ? (
                        <div className={styles.guidesGrid} style={{ marginBottom: '6rem' }}>
                            {guides.map((guide: any) => {
                                if (!guide) return null;
                                return (
                                    <article key={guide.slug} className={styles.guideCard}>
                                        <div className={styles.guideImage} style={{ backgroundImage: `url("${guide.image}")` }} />
                                        <div className={styles.guideContent}>
                                            <span className={styles.guideCategory}>{guide.category}</span>
                                            <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                                            <div className={styles.guideMeta}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>NY</div>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{guide.author}</span>
                                                </div>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{guide.date}</span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--color-slate)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🦁</div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>No {catName} guides found yet</h3>
                            <p style={{ fontSize: '1.1rem' }}>We are currently crafting new expert insights for this category.</p>
                            <Link href="/guides" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block', borderRadius: '100px', padding: '1rem 2rem' }}>
                                Explore Other Guides
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
