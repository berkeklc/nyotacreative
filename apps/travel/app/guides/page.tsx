import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

const categories = ["All", "Beaches", "Food & Drink", "Travel Tips", "Safari", "Hotels", "Culture", "Transportation"];

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const params = await searchParams;
    const activeCategory = params.category || "All";

    const res = await fetchAPI("/articles", {
        populate: "*",
        sort: ["publishedAt:desc"],
        filters: activeCategory !== "All" ? {
            category: { $eq: activeCategory }
        } : {}
    });

    const guides = (res?.data || []).map((g: any) => {
        if (!g) return null;
        return {
            title: g.title || "Untitled Guide",
            slug: g.slug || "untitiled",
            category: g.category || "General",
            author: "Nyota Editor",
            date: g.publishedAt ? new Date(g.publishedAt).toLocaleDateString() : "Recently",
            readTime: "8 min",
            image: getStrapiMedia(g.image?.url)
        };
    }).filter(Boolean);

    return (
        <div className={styles.page}>
            <main>
                <section className={styles.hero} style={{ minHeight: '40vh', padding: '100px 0 60px' }}>
                    <div className={styles.heroOverlay} />
                    <div className="container">
                        <div className={styles.heroContent} style={{ background: 'transparent', backdropFilter: 'none', boxShadow: 'none', textAlign: 'left', padding: 0 }}>
                            <span className={styles.heroBadge}>Local Expertise</span>
                            <h1 className={styles.heroTitle} style={{ color: 'var(--color-charcoal)' }}>Travel <span className={styles.heroHighlight}>Guides</span></h1>
                            <p className={styles.heroSubtitle} style={{ marginLeft: 0 }}>
                                Professional advice, local secrets, and essential tips for your Tanzanian adventure.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div className={styles.categoryFilter}>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={cat === "All" ? "/guides" : `/guides?category=${encodeURIComponent(cat)}`}
                                    className={`${styles.categoryBtn} ${cat === activeCategory ? styles.active : ""}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {guides.length > 0 ? (
                            <div className={styles.guidesGrid}>
                                {guides.map((guide: any) => {
                                    if (!guide) return null;
                                    const bgStyle = guide.image ? { backgroundImage: `url("${guide.image}")` } : { backgroundColor: 'var(--color-sand-dark)' };

                                    return (
                                        <article key={guide.slug || Math.random()} className={`${styles.guideCard} card`}>
                                            <div className={styles.guideImage} style={bgStyle} />
                                            <div className={styles.guideContent}>
                                                <span className={styles.guideCategory}>{guide.category}</span>
                                                <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                                                <div className={styles.guideMeta}>
                                                    <span>{guide.author} • {guide.date}</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-slate)' }}>
                                {res?.data === null ? "Error connecting to Strapi. Please check your API token." : "No guides found in this category."}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
