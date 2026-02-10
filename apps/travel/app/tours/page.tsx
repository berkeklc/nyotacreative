import Link from "next/link";
import styles from "./tours.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";
import TourPlannerForm from "../../components/TourPlannerForm";

export const metadata = {
    title: "Tours & Experiences | RushZanzibar",
    description:
        "Browse Tanzania and Zanzibar tours, chat instantly on WhatsApp, or submit one quick form for a custom itinerary.",
};

const WHATSAPP_PHONE = "255794094733";
const WHATSAPP_TEXT = encodeURIComponent("Hi RushZanzibar, I need help choosing the right tour plan.");

interface TourCardData {
    title: string;
    slug: string;
    duration: string;
    price: number;
    image: string | null;
    city: string;
    difficulty: string;
    featured: boolean;
    description: string;
}

function toText(value: unknown) {
    if (typeof value !== "string") return "";
    return value.trim();
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toSnippet(description: string) {
    const text = stripHtml(description);
    if (!text) return "Curated by local experts with flexible pacing and personalized planning support.";
    return `${text.slice(0, 96)}${text.length > 96 ? "..." : ""}`;
}

function parseDurationDays(duration: string) {
    const numeric = duration.match(/(\d+(?:\.\d+)?)/);
    if (!numeric) return null;
    const value = Number(numeric[1]);
    if (Number.isNaN(value)) return null;
    const lower = duration.toLowerCase();
    if (lower.includes("hour") || lower.includes("min")) return null;
    return value;
}

function formatPrice(value: number) {
    return `$${value.toLocaleString("en-US")}`;
}

export default async function ToursPage() {
    let toursRes: { data?: unknown; error?: unknown } | null = null;
    try {
        const response = await fetchAPI("/tours", {
            populate: ["heroImage", "city"],
            pagination: { limit: 100 },
            sort: ["featured:desc", "priceAdult:asc", "name:asc"],
        });
        toursRes = response as { data?: unknown; error?: unknown };
    } catch (error) {
        console.error("Tours page fetch failure:", error);
        toursRes = { data: [], error: "fetch_failed" };
    }

    const rawTours: Record<string, unknown>[] = Array.isArray(toursRes?.data) ? toursRes.data : [];
    const hasFetchError = Boolean(toursRes?.error);

    const tours: TourCardData[] = rawTours
        .map((item): TourCardData | null => {
            const title = toText(item.name);
            const slug = toText(item.slug);
            if (!title || !slug) return null;

            const description = toText(item.description);
            const city = (item.city as { name?: string } | undefined)?.name || "";
            const heroImage = item.heroImage as { url?: string } | undefined;

            return {
                title,
                slug,
                duration: toText(item.duration),
                price: Number(item.priceAdult || 0),
                image: getStrapiMedia(heroImage?.url),
                city: toText(city),
                difficulty: toText(item.difficulty),
                featured: Boolean(item.featured),
                description,
            };
        })
        .filter((tour): tour is TourCardData => tour !== null);

    const plannerOptions = tours.map((tour) => ({ slug: tour.slug, title: tour.title }));

    const featuredCount = tours.filter((tour) => tour.featured).length;
    const pricedTours = tours.filter((tour) => tour.price > 0);
    const minimumPrice = pricedTours.length ? Math.min(...pricedTours.map((tour) => tour.price)) : null;

    const durations = tours
        .map((tour) => parseDurationDays(tour.duration))
        .filter((value): value is number => value !== null);
    const avgDays = durations.length
        ? `${(durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(1)} days`
        : "Flexible";

    const topCities = tours
        .map((tour) => tour.city)
        .filter((city): city is string => Boolean(city))
        .reduce<Record<string, number>>((acc, city) => {
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

    const strongestCity =
        Object.entries(topCities)
            .sort((a, b) => b[1] - a[1])
            .map(([city]) => city)[0] || "Tanzania";

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={`container ${styles.heroInner}`}>
                    <span className={styles.heroBadge}>Tour Planner 2026</span>
                    <h1>Find The Right Tour Fast, Then Book In Minutes</h1>
                    <p>
                        No complex category maze. Compare the best active routes, chat instantly on WhatsApp, or fill one
                        short form and get your custom itinerary from our advisors.
                    </p>
                    <div className={styles.heroActions}>
                        <a
                            href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_TEXT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsAppHeroBtn}
                        >
                            WhatsApp Now
                        </a>
                        <a href="#tour-planner" className={`${styles.quickPlannerBtn} btn btn-primary`}>
                            Open Quick Planner
                        </a>
                        <Link href="/contact" className={`${styles.advisorBtn} btn btn-secondary`}>
                            Talk To Advisor
                        </Link>
                    </div>
                    <div className={styles.heroHint}>
                        <span>Response in under 24h</span>
                        <span>Local ground team in Tanzania</span>
                        <span>Custom private and group plans</span>
                    </div>
                    <div className={styles.heroStatStrip}>
                        <article>
                            <span>Live Tours</span>
                            <strong>{tours.length}</strong>
                        </article>
                        <article>
                            <span>Featured</span>
                            <strong>{featuredCount}</strong>
                        </article>
                        <article>
                            <span>Starting From</span>
                            <strong>{minimumPrice ? formatPrice(minimumPrice) : "Custom"}</strong>
                        </article>
                    </div>
                </div>
            </section>

            <section className={styles.mainSection}>
                <div className={`container ${styles.layout}`}>
                    <aside id="tour-planner" className={styles.plannerPanel}>
                        <div className={styles.plannerHead}>
                            <span>Quick Inquiry</span>
                            <h2>Plan My Tour</h2>
                            <p>
                                Fill this once. We will align route, dates, and budget quickly, then send your final
                                recommendation.
                            </p>
                        </div>

                        <a
                            href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_TEXT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.plannerWhatsApp}
                        >
                            <span className={styles.plannerWhatsAppIcon}>WA</span>
                            <span className={styles.plannerWhatsAppText}>
                                <strong>Need instant help?</strong>
                                <span>Tap here for live WhatsApp support.</span>
                            </span>
                        </a>

                        <div className={styles.plannerBody}>
                            <TourPlannerForm tourOptions={plannerOptions} />
                        </div>
                    </aside>

                    <div className={styles.listPanel}>
                        <div className={styles.listHeader}>
                            <div>
                                <h2>Active Tours</h2>
                                <p>
                                    Featured routes are prioritized first, then all available tours sorted for faster
                                    scanning.
                                </p>
                                {hasFetchError && (
                                    <p className={styles.dataWarning}>
                                        Live tour feed is temporarily unstable. If a tour looks missing, use WhatsApp for
                                        instant manual options.
                                    </p>
                                )}
                            </div>
                            <Link href="/contact" className={`${styles.helpChoosingBtn} btn btn-accent`}>
                                Need Help Choosing?
                            </Link>
                        </div>

                        <div className={styles.statsRow}>
                            <article className={styles.statCard}>
                                <span>Total Tours</span>
                                <strong>{tours.length}</strong>
                            </article>
                            <article className={styles.statCard}>
                                <span>Featured</span>
                                <strong>{featuredCount}</strong>
                            </article>
                            <article className={styles.statCard}>
                                <span>From</span>
                                <strong>{minimumPrice ? formatPrice(minimumPrice) : "Custom"}</strong>
                            </article>
                            <article className={styles.statCard}>
                                <span>Strongest Hub</span>
                                <strong>{strongestCity}</strong>
                            </article>
                        </div>

                        <div className={styles.flowRow}>
                            <article className={styles.flowCard}>
                                <span>1</span>
                                <strong>Pick A Route</strong>
                                <p>Compare current tours quickly by duration, city, and starting budget.</p>
                            </article>
                            <article className={styles.flowCard}>
                                <span>2</span>
                                <strong>Send One Form</strong>
                                <p>Share dates, travelers, and contact preference once. We handle the rest.</p>
                            </article>
                            <article className={styles.flowCard}>
                                <span>3</span>
                                <strong>Confirm On WhatsApp</strong>
                                <p>Receive your final routing and operational details via your chosen channel.</p>
                            </article>
                        </div>

                        {tours.length > 0 ? (
                            <div className={styles.toursGrid}>
                                {tours.map((tour) => (
                                    <article key={tour.slug} className={styles.tourCard}>
                                        <Link href={`/tours/${tour.slug}`}>
                                            <div
                                                className={styles.tourImage}
                                                style={{
                                                    backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                                    backgroundColor: tour.image ? undefined : "var(--color-sand-dark)",
                                                }}
                                            >
                                                {tour.featured && <span className={styles.tourBadge}>Featured</span>}
                                            </div>
                                        </Link>

                                        <div className={styles.tourBody}>
                                            <div className={styles.tourMeta}>
                                                <span>{tour.duration || avgDays}</span>
                                                {tour.city && <span className={styles.tourCity}>{tour.city}</span>}
                                            </div>
                                            <h3>
                                                <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
                                            </h3>
                                            <p>{toSnippet(tour.description)}</p>
                                            <div className={styles.tourFooter}>
                                                <span className={styles.tourPrice}>
                                                    From <strong>{tour.price > 0 ? formatPrice(tour.price) : "Custom"}</strong>
                                                </span>
                                                <Link href={`/tours/${tour.slug}`} className={styles.tourDetailBtn}>
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <h3>Tours are being refreshed</h3>
                                <p>Use WhatsApp and we will send live options manually right away.</p>
                                <a
                                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_TEXT}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.whatsAppHeroBtn}
                                >
                                    Chat On WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
