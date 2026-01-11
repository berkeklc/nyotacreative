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

    const guides = res?.data || [];

    return (
        <div className={styles.page}>
            <main>
                <section className={styles.hero} style={{ minHeight: '30vh', padding: '120px 0 60px' }}>
                    <div className={styles.heroOverlay} />
                    <div className="container">
                        <div className={styles.heroContent} style={{ background: 'transparent', backdropFilter: 'none', boxShadow: 'none', textAlign: 'left', padding: 0 }}>
                            <span className={styles.categoryBadge}>{catName} Guides</span>
                            <h1 className={styles.heroTitle} style={{ color: 'var(--color-charcoal)' }}>Top <span className={styles.heroHighlight}>{catName}</span> Tips</h1>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div style={{ marginBottom: '2rem' }}>
                            <Link href="/guides" style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>← All Guides</Link>
                        </div>

                        {guides.length > 0 ? (
                            <div className={styles.guidesGrid}>
                                {guides.map((guide: any) => (
                                    <article key={guide.slug} className={`${styles.guideCard} card`}>
                                        <div className={styles.guideImage} style={{
                                            backgroundImage: guide.image?.url ? `url(${getStrapiMedia(guide.image.url)})` : 'none',
                                            backgroundColor: 'var(--color-sand-dark)'
                                        }} />
                                        <div className={styles.guideContent}>
                                            <span className={styles.guideCategory}>{guide.category}</span>
                                            <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                                            <div className={styles.guideMeta}>
                                                <span>By Nyota Editor • {new Date(guide.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
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
