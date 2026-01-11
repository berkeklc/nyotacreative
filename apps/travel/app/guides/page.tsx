"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

const categories = ["All", "Beaches", "Food & Drink", "Travel Tips", "Safari", "Hotels", "Culture", "Transportation"];

export default function GuidesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [guides, setGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGuides() {
            setLoading(true);
            const res = await fetchAPI("/articles", {
                populate: "*",
                sort: ["publishedAt:desc"],
                filters: activeCategory !== "All" ? {
                    category: { $eq: activeCategory }
                } : {}
            });

            if (res?.data) {
                setGuides(res.data.map((g: any) => ({
                    title: g.title,
                    slug: g.slug,
                    category: g.category || "General",
                    author: "Nyota Editor",
                    date: new Date(g.publishedAt).toLocaleDateString(),
                    readTime: "8 min",
                    image: getStrapiMedia(g.image?.url)
                })));
            }
            setLoading(false);
        }
        loadGuides();
    }, [activeCategory]);

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
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`${styles.categoryBtn} ${cat === activeCategory ? styles.active : ""}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-slate)' }}>Loading guides...</div>
                        ) : guides.length > 0 ? (
                            <div className={styles.guidesGrid}>
                                {guides.map((guide) => (
                                    <article key={guide.slug} className={`${styles.guideCard} card`}>
                                        <div className={styles.guideImage} style={{
                                            backgroundImage: guide.image ? `url(${guide.image})` : 'none',
                                            backgroundColor: 'var(--color-sand-dark)'
                                        }} />
                                        <div className={styles.guideContent}>
                                            <span className={styles.guideCategory}>{guide.category}</span>
                                            <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                                            <div className={styles.guideMeta}>
                                                <span>{guide.author} • {guide.date}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-slate)' }}>No guides found in this category.</div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
