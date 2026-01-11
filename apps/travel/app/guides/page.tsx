"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

const guides = [
    { title: "Best Beaches in Zanzibar: Complete 2026 Guide", slug: "best-beaches-zanzibar-2026", category: "Beaches", author: "Sarah Mwangi", date: "Jan 8, 2026", readTime: "12 min" },
    { title: "Where to Eat in Stone Town: Local's Guide", slug: "where-to-eat-stone-town", category: "Food & Drink", author: "Ahmed Hassan", date: "Jan 5, 2026", readTime: "8 min" },
    { title: "Tanzania Safety Tips: Everything You Need to Know", slug: "tanzania-safety-tips", category: "Travel Tips", author: "James Kilonzo", date: "Jan 3, 2026", readTime: "10 min" },
    { title: "Zanzibar Nightlife: Best Bars & Clubs", slug: "zanzibar-nightlife-guide", category: "Nightlife", author: "Zara Mbarouk", date: "Dec 28, 2025", readTime: "7 min" },
    { title: "How to Get from Dar to Zanzibar: Complete Guide", slug: "dar-to-zanzibar-transport", category: "Transportation", author: "David Okello", date: "Dec 22, 2025", readTime: "6 min" },
    { title: "Serengeti Safari: Planning Your Trip", slug: "serengeti-safari-planning", category: "Safari", author: "Sarah Mwangi", date: "Dec 18, 2025", readTime: "15 min" },
    { title: "Best Hotels in Zanzibar for Every Budget", slug: "best-hotels-zanzibar", category: "Hotels", author: "Ahmed Hassan", date: "Dec 15, 2025", readTime: "11 min" },
    { title: "Zanzibar Spice Tour: What to Expect", slug: "zanzibar-spice-tour-guide", category: "Culture", author: "James Kilonzo", date: "Dec 10, 2025", readTime: "8 min" },
];

const categories = ["All", "Beaches", "Food & Drink", "Travel Tips", "Safari", "Hotels", "Culture", "Transportation"];

export default function GuidesPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredGuides = activeCategory === "All"
        ? guides
        : guides.filter(guide => guide.category === activeCategory);

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
                        {/* Categories */}
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

                        <div className={styles.guidesGrid}>
                            {filteredGuides.map((guide) => (
                                <article key={guide.slug} className={`${styles.guideCard} card`}>
                                    <div className={styles.guideImage} style={{
                                        backgroundImage: `url(/images/guides/${guide.slug}.jpg)`,
                                        backgroundColor: 'var(--color-sand-dark)'
                                    }} />
                                    <div className={styles.guideContent}>
                                        <span className={styles.guideCategory}>{guide.category}</span>
                                        <h3>
                                            <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                                        </h3>
                                        <div className={styles.guideMeta}>
                                            <span>{guide.author}</span>
                                            <span>•</span>
                                            <span>{guide.readTime} read</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
