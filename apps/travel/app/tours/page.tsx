import Link from "next/link";
import styles from "./tours.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";
import TourPlannerForm from "../../components/TourPlannerForm";

export const metadata = {
    title: "Tours & Experiences | RushZanzibar",
    description:
        "Explore premium Tanzania and Zanzibar tours. Compare routes quickly, send one planner form, and confirm with local advisors.",
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
    if (!text) return "Curated by local experts with smooth timing, balanced pacing, and flexible private planning.";
    return `${text.slice(0, 120)}${text.length > 120 ? "..." : ""}`;
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

function normalizeDifficulty(value: string) {
    if (!value) return "Moderate";
    const normalized = value.toLowerCase();
    if (normalized.includes("easy")) return "Easy";
    if (normalized.includes("hard") || normalized.includes("advanced")) return "Challenging";
    if (normalized.includes("medium")) return "Moderate";
    return value;
}

function getTourSignal(tour: TourCardData, index: number) {
    const difficulty = normalizeDifficulty(tour.difficulty).toLowerCase();
    if (difficulty === "easy") return "Family Friendly";
    if (difficulty === "challenging") return "Adventure Ready";
    if (tour.featured) return "Local Favorite";
    if (tour.city) return `${tour.city} Highlight`;
    return index % 2 === 0 ? "Flexible Schedule" : "Private Option Ready";
}

function getRouteSummary(tour: TourCardData) {
    const cityText = tour.city ? `${tour.city} route` : "Signature route";
    const difficultyText = normalizeDifficulty(tour.difficulty);
    return `${cityText} · ${difficultyText} pace`;
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

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={`container ${styles.heroInner}`}>
                    <span className={styles.heroEyebrow}>Tanzania Tour Planning Desk</span>
                    <h1>Plan Your Tour In One Simple Form</h1>
                    <p>
                        No long questionnaire. Compare routes, share essentials, and get a practical plan from local
                        advisors quickly.
                    </p>
                    <div className={styles.heroQuickStats}>
                        <span>{tours.length} active tours</span>
                        <span>{featuredCount} featured picks</span>
                        <span>{minimumPrice ? `From ${formatPrice(minimumPrice)}` : "Custom budget plans"}</span>
                    </div>
                    <div className={styles.heroActions}>
                        <a href="#tour-planner-modal" className={`${styles.quickPlannerBtn} btn btn-primary`}>
                            Get My Tour Plan
                        </a>
                        <a
                            href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_TEXT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsAppHeroBtn}
                        >
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            <section className={styles.mainSection}>
                <div className={`container ${styles.layout}`}>
                    <div id="tour-collection" className={styles.listPanel}>
                        <div className={styles.listHeader}>
                            <div>
                                <h2>Tour Collection</h2>
                                <p>
                                    Featured routes appear first. Every card is optimized for quick comparison by
                                    duration, location, pace, and starting budget.
                                </p>
                                {hasFetchError && (
                                    <p className={styles.dataWarning}>
                                        Live tour feed is temporarily unstable. If a tour looks missing, use WhatsApp for
                                        instant manual options.
                                    </p>
                                )}
                            </div>
                            <Link href="/contact" className={`${styles.helpChoosingBtn} btn btn-accent`}>
                                Talk To Advisor
                            </Link>
                        </div>

                        {tours.length > 0 ? (
                            <div className={styles.toursGrid}>
                                {tours.map((tour, index) => (
                                    <article
                                        key={tour.slug}
                                        className={`${styles.tourCard} ${tour.featured ? styles.tourCardFeatured : ""}`}
                                    >
                                        <Link href={`/tours/${tour.slug}`} className={styles.tourImageLink}>
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
                                            <div className={styles.tourCardHead}>
                                                <div className={styles.tourMetaTop}>
                                                    <span className={styles.tourDuration}>{tour.duration || avgDays}</span>
                                                    {tour.city && <span className={styles.tourCity}>{tour.city}</span>}
                                                    <span className={styles.tourDifficulty}>{normalizeDifficulty(tour.difficulty)}</span>
                                                </div>
                                                <span className={styles.tourCardIndex}>
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <h3>
                                                <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
                                            </h3>
                                            <p className={styles.tourCardSnippet}>{toSnippet(tour.description)}</p>
                                            <div className={styles.tourSignalRow}>
                                                <span className={styles.tourSignalPrimary}>{getTourSignal(tour, index)}</span>
                                                <span className={styles.tourSignalSecondary}>{getRouteSummary(tour)}</span>
                                            </div>
                                            <div className={styles.tourFooter}>
                                                <div className={styles.tourPriceWrap}>
                                                    <span className={styles.tourPriceLabel}>From</span>
                                                    <span className={styles.tourPriceValue}>
                                                        {tour.price > 0 ? formatPrice(tour.price) : "Custom"}
                                                    </span>
                                                </div>
                                                <Link href={`/tours/${tour.slug}`} className={styles.tourDetailBtn}>
                                                    View Tour
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

            <div id="tour-planner-modal" className={styles.plannerModal}>
                <a href="#tour-collection" className={styles.plannerModalBackdrop} aria-label="Close planner form" />
                <div
                    className={`${styles.plannerPanel} ${styles.plannerModalDialog}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tour-planner-modal-title"
                >
                    <div className={styles.plannerHead}>
                        <div className={styles.plannerHeadTop}>
                            <span>Trip Planner</span>
                            <a href="#tour-collection" className={styles.plannerModalClose} aria-label="Close planner form">
                                Close
                            </a>
                        </div>
                        <h2 id="tour-planner-modal-title">Share Your Dates, Get A Smart Route</h2>
                        <p>A real planner reviews your request and sends clear options you can compare fast.</p>
                    </div>

                    <div className={styles.plannerBody}>
                        <TourPlannerForm tourOptions={plannerOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
