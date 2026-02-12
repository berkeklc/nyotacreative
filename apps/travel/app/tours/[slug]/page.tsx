import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./tour.module.css";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";
import BookingForm from "../../../components/BookingForm";

const WHATSAPP_PHONE = "255794094733";

function toText(value: unknown) {
    if (typeof value !== "string") return "";
    return value.trim();
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toSnippet(value: string, max = 160) {
    if (!value) return "";
    return `${value.slice(0, max)}${value.length > max ? "..." : ""}`;
}

function normalizeHighlights(value: unknown) {
    if (!Array.isArray(value)) return [] as string[];
    return value
        .map((item) => {
            if (typeof item === "string") return item.trim();
            if (item && typeof item === "object") {
                const title = toText((item as { title?: unknown }).title);
                const description = toText((item as { description?: unknown }).description);
                return title || description;
            }
            return "";
        })
        .filter(Boolean);
}

function normalizeItinerary(value: unknown) {
    if (!Array.isArray(value)) return [] as Array<{ day: string; title: string; description: string }>;
    return value
        .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const dayNumber = (item as { dayNumber?: unknown }).dayNumber;
            const title = toText((item as { title?: unknown }).title) || `Day ${index + 1}`;
            const description = stripHtml(toText((item as { description?: unknown }).description));
            return {
                day: dayNumber ? `Day ${dayNumber}` : `Day ${index + 1}`,
                title,
                description,
            };
        })
        .filter((entry): entry is { day: string; title: string; description: string } => Boolean(entry));
}

interface RelatedTourData {
    title: string;
    slug: string;
    duration: string;
    city: string;
    image: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetchAPI("/tours", { filters: { slug: { $eq: slug } } });
    const tour = Array.isArray(res?.data) ? res.data[0] : null;

    const title = toText(tour?.name) || "Tour Detail";
    const descriptionRaw = stripHtml(toText(tour?.description));

    return {
        title: `${title} | RushZanzibar`,
        description:
            toSnippet(descriptionRaw, 160) || "Explore this tour itinerary and contact RushZanzibar for a custom booking plan.",
    };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetchAPI("/tours", {
        filters: { slug: { $eq: slug } },
        populate: ["heroImage", "gallery", "city", "itinerary", "seoMetadata"],
    });

    const tour = Array.isArray(res?.data) ? res.data[0] : null;
    if (!tour) return notFound();

    const heroImage = getStrapiMedia((tour.heroImage as { url?: string } | undefined)?.url);
    const title = toText(tour.name);
    const description = stripHtml(toText(tour.description));
    const duration = toText(tour.duration);
    const difficulty = toText(tour.difficulty);
    const city = toText((tour.city as { name?: unknown } | undefined)?.name);
    const price = Number(tour.priceAdult || 0);

    const highlights = normalizeHighlights(tour.highlights);
    const itinerary = normalizeItinerary(tour.itinerary);

    const relatedRes = await fetchAPI("/tours", {
        filters: { slug: { $ne: slug } },
        populate: ["heroImage", "city"],
        pagination: { limit: 3 },
        sort: ["featured:desc", "priceAdult:asc"],
    });

    const relatedRawTours: Record<string, unknown>[] = Array.isArray(relatedRes?.data) ? relatedRes.data : [];
    const relatedTours: RelatedTourData[] = relatedRawTours
        .map((item): RelatedTourData => ({
                  title: toText(item.name),
                  slug: toText(item.slug),
                  duration: toText(item.duration),
                  city: toText((item.city as { name?: unknown } | undefined)?.name),
                  image: getStrapiMedia((item.heroImage as { url?: string } | undefined)?.url),
              }))
        .filter((item): item is RelatedTourData => Boolean(item.title && item.slug));

    const whatsAppMessage = encodeURIComponent(
        `Hi RushZanzibar, I want to book ${title || "this tour"}. Please share details.`
    );
    const displayPrice = price > 0 ? `$${price}` : "Custom Quote";
    const displayPace = difficulty || "All levels";

    return (
        <div className={styles.tourPage}>
            <main>
                <section className={styles.hero} style={{ backgroundColor: heroImage ? undefined : "var(--color-charcoal)" }}>
                    {heroImage && (
                        <Image
                            src={heroImage}
                            alt={title || "Tour"}
                            fill
                            className={styles.heroImage}
                            priority
                            sizes="100vw"
                        />
                    )}
                    <div className={styles.heroOverlay} />

                    <div className={`container ${styles.heroContent}`}>
                        <nav className={styles.breadcrumb}>
                            <Link href="/tours">Tours</Link>
                            <span>/</span>
                            <span>{title}</span>
                        </nav>

                        <span className={styles.heroBadge}>Signature Tour</span>
                        <h1>{title}</h1>

                        <div className={styles.heroMetaRow}>
                            {duration && <span>{duration}</span>}
                            {city && <span>{city}</span>}
                            {difficulty && <span>{difficulty}</span>}
                        </div>
                        <p className={styles.heroLead}>
                            Share your dates and interests once. Our team sends the best route plan with clear timing and
                            practical pricing before you confirm.
                        </p>

                        <div className={styles.heroInfoStrip}>
                            <article>
                                <span>Starting From</span>
                                <strong>{displayPrice}</strong>
                            </article>
                            <article>
                                <span>Route Pace</span>
                                <strong>{displayPace}</strong>
                            </article>
                            <article>
                                <span>Advisor Reply</span>
                                <strong>Usually under 24h</strong>
                            </article>
                        </div>

                        <div className={styles.heroActions}>
                            <a
                                href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsAppMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsAppBtn}
                            >
                                WhatsApp Booking
                            </a>
                            <a href="#book-now" className={`btn btn-primary ${styles.heroFormBtn}`}>
                                Fill Quick Form
                            </a>
                        </div>
                    </div>
                </section>

                <section className={styles.mainSection}>
                    <div className={`container ${styles.contentGrid}`}>
                        <div className={styles.overview}>
                            <h2>Overview</h2>
                            <p>{description || "Tour details will be shared by our advisor shortly."}</p>

                            {highlights.length > 0 && (
                                <>
                                    <h3>Highlights</h3>
                                    <div className={styles.includesGrid}>
                                        {highlights.map((highlight, idx) => (
                                            <div key={`${highlight}-${idx}`} className={styles.includeCard}>
                                                <span className={styles.includeIcon} aria-hidden="true">
                                                    ✦
                                                </span>
                                                <div className={styles.includeText}>
                                                    <strong>Included Experience</strong>
                                                    <span>{highlight}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {itinerary.length > 0 && (
                                <>
                                    <h3>Itinerary</h3>
                                    <div className={styles.itinerary}>
                                        {itinerary.map((item, idx) => (
                                            <div key={`${item.day}-${idx}`} className={styles.itineraryItem}>
                                                <div className={styles.dayBadge}>{item.day}</div>
                                                <div className={styles.itineraryContent}>
                                                    <h4>{item.title}</h4>
                                                    <p>{item.description || "Detailed plan will be finalized with your advisor."}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {relatedTours.length > 0 && (
                                <>
                                    <h3>Similar Tours</h3>
                                    <div className={styles.relatedGrid}>
                                        {relatedTours.map((item) => (
                                            <Link key={item.slug} href={`/tours/${item.slug}`} className={styles.relatedCard}>
                                                <div
                                                    className={styles.relatedImage}
                                                    style={{
                                                        backgroundImage: item.image ? `url(${item.image})` : undefined,
                                                        backgroundColor: item.image ? undefined : "var(--color-sand-dark)",
                                                    }}
                                                />
                                                <div className={styles.relatedBody}>
                                                    <strong>{item.title}</strong>
                                                    <span>
                                                        {item.duration || "Flexible"}
                                                        {item.city ? ` • ${item.city}` : ""}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <aside id="book-now" className={styles.sidebar}>
                            <div className={styles.bookingCard}>
                                <div className={styles.priceHeader}>
                                    <span className={styles.priceLabel}>Starting from</span>
                                    <div className={styles.priceValue}>{price > 0 ? `$${price}` : "Custom"}</div>
                                </div>

                                <a
                                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsAppMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.whatsAppBtnSecondary}
                                >
                                    Chat On WhatsApp
                                </a>

                                <p className={styles.sidebarHint}>
                                    For fastest response, start with WhatsApp. Or submit the form below and we will reply
                                    with your full itinerary.
                                </p>

                                <BookingForm tourTitle={title} tourSlug={slug} />
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}
