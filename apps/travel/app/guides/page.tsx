import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

const categories = [
    { label: "All", value: "All" },
    { label: "Beaches", value: "beaches" },
    { label: "Food & Drink", value: "food-drink" },
    { label: "Safari", value: "adventure" },
    { label: "Travel Tips", value: "tips" },
    { label: "Safety", value: "safety" },
    { label: "Culture", value: "culture" },
    { label: "Transport", value: "transportation" }
];

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
                <section className={styles.hero} style={{ minHeight: '40vh', padding: '120px 0 60px' }}>
                    <div className={styles.heroOverlay} />
                    <div className="container">
                        <div className={styles.heroContent} style={{ background: 'transparent', backdropFilter: 'none', boxShadow: 'none', textAlign: 'left', padding: 0 }}>
                            <span className={styles.heroBadge} style={{ background: 'rgba(192, 90, 62, 0.1)', color: 'var(--color-terracotta)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Expert Insights
                            </span>
                            <h1 className={styles.heroTitle} style={{ color: 'var(--color-charcoal)', marginTop: '1.5rem' }}>
                                Tanzanian <span className={styles.heroHighlight}>Guides</span>
                            </h1>
                            <p className={styles.heroSubtitle} style={{ marginLeft: 0, color: 'var(--color-slate)', fontSize: '1.25rem' }}>
                                Professional advice, local secrets, and essential tips for your safari adventure.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)", paddingTop: '0' }}>
                    <div className="container">
                        <div className={styles.categoryFilter} style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.value}
                                    href={cat.value === "All" ? "/guides" : `/guides?category=${cat.value}`}
                                    className={`${styles.categoryBtn} ${activeCategory === cat.value ? styles.active : ""}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {cat.label}
                                </Link>
                            ))}
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
                                                    <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--color-terracotta)' }}>{guide.readTime}</span>
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
