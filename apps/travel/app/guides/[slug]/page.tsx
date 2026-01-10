import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { fetchAPI } from "../../../lib/strapi";

// Fallback guides
const fallbackGuides = [
    {
        slug: "best-beaches-zanzibar-2026",
        title: "Best Beaches in Zanzibar: 2026 Guide",
        content: "Nungwi and Kendwa offer the best swimming experiences due to smaller tidal variances. Paje is perfect for kite surfing content. Discover the crystal clear waters and white sandy beaches of the Spice Island.",
        category: "Beaches",
        author: "Sarah Mwangi",
        date: "Jan 8, 2026"
    },
    {
        slug: "where-to-eat-stone-town",
        title: "Where to Eat in Stone Town: Local's Guide",
        content: "Stone Town is a foodie paradise. From Forodhani Gardens to upscale rooftop restaurants, the flavors of the Indian Ocean await you. Try the authentic Zanzibar pizza and fresh seafood at Lukmaan Restaurant.",
        category: "Food & Drink",
        author: "Ahmed Hassan",
        date: "Jan 5, 2026"
    },
    {
        slug: "getting-to-tanzania",
        title: "Getting to Tanzania: Complete Travel Guide",
        content: "Most international travelers fly into Julius Nyerere International Airport (DAR) in Dar es Salaam or Abeid Amani Karume International Airport (ZNZ) in Zanzibar. KLM, Qatar Airways, and Ethiopian Airlines offer frequent connections to Europe and the Middle East.",
        category: "Travel Tips",
        author: "Nyota Editor",
        date: "Jan 2, 2026"
    }
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return {
        title: `Guide: ${slug.split('-').join(' ')} | Nyota Travel`,
        description: "Travel guide and tips for your Tanzania adventure.",
    };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch from Strapi
    const data = await fetchAPI("/articles", {
        filters: {
            slug: {
                $eq: slug
            }
        },
        populate: "*"
    });

    const guideRaw = data?.data?.[0];

    const guide = guideRaw ? {
        title: guideRaw.title,
        content: guideRaw.content,
        category: guideRaw.category || "General",
        date: new Date(guideRaw.publishedAt).toLocaleDateString(),
        author: "Nyota Editor"
    } : fallbackGuides.find(g => g.slug === slug);

    if (!guide) {
        return notFound();
    }

    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px", minHeight: "80vh" }}>
                <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <nav className={styles.breadcrumb} style={{ marginBottom: "2rem", color: "#666" }}>
                        <Link href="/guides">Guides</Link> / <span style={{ textTransform: "capitalize" }}>{slug.split('-').join(' ')}</span>
                    </nav>

                    <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                        <span className="badge badge-featured" style={{ marginBottom: "1.5rem" }}>
                            {guide.category}
                        </span>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1.5rem", lineHeight: "1.2" }}>{guide.title}</h1>
                        <div style={{ color: "#888", fontWeight: 500 }}>
                            By {guide.author} • {guide.date}
                        </div>
                    </div>

                    <article style={{ fontSize: "1.25rem", lineHeight: "1.8", color: "var(--color-charcoal)", paddingBottom: "4rem" }}>
                        <p>{guide.content}</p>
                    </article>
                </div>
            </main>
        </div>
    );
}
