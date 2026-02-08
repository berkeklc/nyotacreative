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
                <section className={styles.hero} style={{
                    minHeight: '50vh',
                    padding: '140px 0 80px',
                    background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2a2520 100%)'
                }}>
                    <div className={styles.heroOverlay} style={{
                        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
                    }} />
                    <div className="container">
                        <div className={styles.heroContent} style={{
                            background: 'transparent',
                            backdropFilter: 'none',
                            boxShadow: 'none',
                            textAlign: 'center',
                            padding: 0,
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, var(--color-terracotta) 0%, var(--color-ochre) 100%)',
                                color: 'var(--color-white)',
                                padding: '0.625rem 1.5rem',
                                borderRadius: '100px',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                marginBottom: '2rem',
                                boxShadow: '0 4px 20px rgba(181, 74, 50, 0.3)'
                            }}>
                                Expert Insights
                            </span>
                            <h1 className={styles.heroTitle} style={{
                                color: 'var(--color-white)',
                                marginTop: '0',
                                fontSize: 'clamp(3rem, 8vw, 5rem)',
                                letterSpacing: '-0.03em'
                            }}>
                                Tanzanian <span style={{
                                    background: 'linear-gradient(135deg, var(--color-ochre) 0%, var(--color-terracotta) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>Guides</span>
                            </h1>
                            <p className={styles.heroSubtitle} style={{
                                margin: '0 auto',
                                color: 'rgba(255, 255, 255, 0.75)',
                                fontSize: '1.25rem',
                                maxWidth: '600px',
                                lineHeight: '1.6'
                            }}>
                                Professional advice, local secrets, and essential tips for your safari adventure.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)", paddingTop: '0' }}>
                    <div className="container">
                        <div className={styles.categoryFilter} style={{ marginTop: '-2.2rem' }}>
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
