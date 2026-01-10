import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Travel Guides | Nyota Travel",
    description: "Expert travel guides for Tanzania and Zanzibar. Beaches, food, culture, safety tips and more.",
};

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
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>✦</span>
                        NYOTA TRAVEL
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/tanzania">Tanzania</Link>
                        <Link href="/tanzania/zanzibar">Zanzibar</Link>
                        <Link href="/tours">Tours</Link>
                        <Link href="/guides">Guides</Link>
                    </div>
                    <div className={styles.navActions}>
                        <Link href="/tours" className="btn btn-primary">Book a Tour</Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "100px" }}>
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Resources</span>
                                <h1>Travel Guides</h1>
                                <p style={{ marginTop: "0.5rem", color: "var(--color-slate)" }}>
                                    Expert tips and guides from local writers
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        border: "1px solid var(--color-ocean)",
                                        borderRadius: "var(--radius-md)",
                                        background: cat === "All" ? "var(--color-ocean)" : "transparent",
                                        color: cat === "All" ? "white" : "var(--color-ocean)",
                                        fontSize: "0.875rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className={styles.guidesGrid} style={{ marginTop: "2rem" }}>
                            {guides.map((guide) => (
                                <article key={guide.slug} className={`${styles.guideCard} card`}>
                                    <div className={styles.guideImage} />
                                    <div className={styles.guideContent}>
                                        <span className={styles.guideCategory}>{guide.category}</span>
                                        <h3>
                                            <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                                        </h3>
                                        <div className={styles.guideMeta}>
                                            <span>By {guide.author}</span>
                                            <span>•</span>
                                            <span>{guide.date}</span>
                                            <span>•</span>
                                            <span>{guide.readTime}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerBottom}>
                        <p>© {new Date().getFullYear()} Nyota Travel. A Nyota Creative project.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
