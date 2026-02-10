"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";
import ExperienceSelector, { type ExperienceType } from "./ExperienceSelector";
import type { HomePageData } from "../lib/homepage";

type ActiveExperience = Exclude<ExperienceType, null>;

interface ExperienceUiConfig {
    accent: string;
    softBackground: string;
    gradient: string;
    railLabel: string;
    railText: string;
    rentHint: string;
    guideLabel: string;
    guideText: string;
    destinationLabel: string;
}

const EXPERIENCE_CONFIG: Record<ActiveExperience, ExperienceUiConfig> = {
    beach: {
        accent: "var(--color-beach)",
        softBackground: "rgba(30, 107, 140, 0.12)",
        gradient: "linear-gradient(135deg, rgba(30, 107, 140, 0.92) 0%, rgba(14, 74, 99, 0.85) 100%)",
        railLabel: "Beachline Journeys",
        railText: "Coastal favorites are moved to the front so you can compare and keep scrolling quickly.",
        rentHint: "Fast beach transfers and island connectors are highlighted first.",
        guideLabel: "Coastal Briefings",
        guideText: "From tidal patterns to quiet bays, these reads keep your beach days smooth.",
        destinationLabel: "Coastal Hotspots",
    },
    safari: {
        accent: "var(--color-safari)",
        softBackground: "rgba(61, 107, 79, 0.12)",
        gradient: "linear-gradient(135deg, rgba(61, 107, 79, 0.94) 0%, rgba(42, 74, 54, 0.86) 100%)",
        railLabel: "Wildlife Circuits",
        railText: "Safari-led routes are surfaced first with fast access to duration and entry pricing.",
        rentHint: "Airport and park-route transfers are prioritized for safari planning.",
        guideLabel: "Field Notes",
        guideText: "Planning windows, migration timing, and route advice from local operations.",
        destinationLabel: "Safari Gateways",
    },
    city: {
        accent: "var(--color-city)",
        softBackground: "rgba(212, 133, 58, 0.14)",
        gradient: "linear-gradient(135deg, rgba(212, 133, 58, 0.95) 0%, rgba(166, 101, 40, 0.86) 100%)",
        railLabel: "Urban Culture Picks",
        railText: "City and culture experiences lead the row while keeping all tours in a scroll flow.",
        rentHint: "City pickups and heritage-area drop-offs are surfaced first.",
        guideLabel: "City Intelligence",
        guideText: "Neighborhoods, food routes, and culture-focused tips for efficient city days.",
        destinationLabel: "Culture Anchors",
    },
};

const DEFAULT_CONFIG: ExperienceUiConfig = {
    accent: "var(--color-terracotta)",
    softBackground: "rgba(181, 74, 50, 0.1)",
    gradient: "linear-gradient(135deg, rgba(181, 74, 50, 0.92) 0%, rgba(148, 61, 40, 0.85) 100%)",
    railLabel: "Signature Experiences",
    railText: "Compare tours side-by-side in a horizontal rail and jump into details without losing context.",
    rentHint: "Core transfer routes and rental options are visible in the left planning sidebar.",
    guideLabel: "Insider Knowledge",
    guideText: "Curated reads from local experts to help shape timing, pacing, and route decisions.",
    destinationLabel: "Popular Destinations",
};

const EXPERIENCE_KEYWORDS: Record<ActiveExperience, { tours: string[]; guides: string[]; destinations: string[]; transfers: string[] }> = {
    beach: {
        tours: ["beach", "coast", "coastal", "island", "zanzibar", "marine", "snorkel"],
        guides: ["beach", "coastal", "water", "zanzibar", "island"],
        destinations: ["zanzibar", "nungwi", "kendwa", "paje", "coast"],
        transfers: ["zanzibar", "beach", "nungwi", "kendwa", "paje", "airport"],
    },
    safari: {
        tours: ["safari", "wildlife", "serengeti", "ngorongoro", "kilimanjaro", "camp", "trek"],
        guides: ["safari", "wildlife", "adventure", "nature", "migration"],
        destinations: ["serengeti", "ngorongoro", "arusha", "kilimanjaro", "tarangire"],
        transfers: ["arusha", "park", "serengeti", "ngorongoro", "airport"],
    },
    city: {
        tours: ["city", "culture", "stone town", "heritage", "dar", "urban", "food"],
        guides: ["culture", "urban", "city", "food", "history"],
        destinations: ["dar", "stone town", "town", "city", "heritage"],
        transfers: ["stone town", "dar", "city", "town", "airport"],
    },
};

function keywordScore(value: string, keywords: string[]) {
    const normalized = value.toLowerCase();
    return keywords.reduce((score, keyword) => (normalized.includes(keyword) ? score + 1 : score), 0);
}

function rankByKeywords<T>(items: T[], keywords: string[], toSearchText: (item: T) => string) {
    if (keywords.length === 0) return items;
    return [...items]
        .map((item, index) => ({
            item,
            index,
            score: keywordScore(toSearchText(item), keywords),
        }))
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map(({ item }) => item);
}

function titleCase(value: string) {
    if (!value) return "";
    return value
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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

function formatMoney(value: number) {
    return `$${value.toLocaleString("en-US")}`;
}

function getTourExcerpt(tourCategory: string, selectedExperience: ExperienceType) {
    const categoryLabel = tourCategory ? titleCase(tourCategory.replace("-", " ")) : "Curated Route";
    if (selectedExperience === "beach") {
        return `${categoryLabel} with sea-facing pacing, lighter adventure rhythm, and sunset-focused stops.`;
    }
    if (selectedExperience === "safari") {
        return `${categoryLabel} tuned for wildlife windows, park timing, and immersive overland flow.`;
    }
    if (selectedExperience === "city") {
        return `${categoryLabel} built around culture, food, and heritage-friendly urban pacing.`;
    }
    return `${categoryLabel} planned by local specialists with balanced timing and flexible options.`;
}

export default function HomePageClient({ initialData }: { initialData: HomePageData }) {
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType>(null);
    const [sliderStep, setSliderStep] = useState(0);
    const [slideConfig, setSlideConfig] = useState({ perView: 3, gap: 16, width: 300 });
    const sliderViewportRef = useRef<HTMLDivElement | null>(null);

    const { destinations, tours, articles, transfers: displayTransfers } = initialData;
    const activeConfig = selectedExperience ? EXPERIENCE_CONFIG[selectedExperience] : DEFAULT_CONFIG;
    const activeKeywords = selectedExperience ? EXPERIENCE_KEYWORDS[selectedExperience] : null;

    const prioritizedTours = useMemo(() => {
        if (!activeKeywords) return tours;
        return rankByKeywords(tours, activeKeywords.tours, (tour) => `${tour.title} ${tour.category || ""}`);
    }, [activeKeywords, tours]);

    const prioritizedArticles = useMemo(() => {
        if (!activeKeywords) return articles;
        return rankByKeywords(
            articles,
            activeKeywords.guides,
            (article) => `${article.title} ${article.category || ""} ${article.author || ""}`
        );
    }, [activeKeywords, articles]);

    const prioritizedDestinations = useMemo(() => {
        if (!activeKeywords) return destinations;
        return rankByKeywords(
            destinations,
            activeKeywords.destinations,
            (destination) => `${destination.name} ${destination.tagline || ""}`
        );
    }, [activeKeywords, destinations]);

    const prioritizedTransfers = useMemo(() => {
        if (!activeKeywords) return displayTransfers;
        return rankByKeywords(
            displayTransfers,
            activeKeywords.transfers,
            (transfer) => `${transfer.name || ""} ${transfer.pickupLocation || ""} ${transfer.dropoffLocation || ""}`
        );
    }, [activeKeywords, displayTransfers]);

    const featuredGuide = prioritizedArticles[0];
    const sideGuides = prioritizedArticles.slice(1, 5);
    const sidebarTransfers = prioritizedTransfers.slice(0, 3);
    const extraTransferCount = Math.max(prioritizedTransfers.length - sidebarTransfers.length, 0);
    const sliderTours = prioritizedTours.slice(0, 8);

    const tourStats = useMemo(() => {
        const pricedTours = sliderTours.filter((tour) => tour.price > 0);
        const averagePrice = pricedTours.length
            ? Math.round(pricedTours.reduce((sum, tour) => sum + tour.price, 0) / pricedTours.length)
            : null;

        const durationDays = sliderTours
            .map((tour) => parseDurationDays(tour.duration || ""))
            .filter((value): value is number => value !== null);
        const averageDays = durationDays.length
            ? Number((durationDays.reduce((sum, value) => sum + value, 0) / durationDays.length).toFixed(1))
            : null;

        const categoryCounts = sliderTours.reduce<Record<string, number>>((acc, tour) => {
            const category = tour.category ? titleCase(tour.category.replace("-", " ")) : "General";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Signature";

        return {
            total: sliderTours.length,
            averagePrice: averagePrice ? formatMoney(averagePrice) : "Custom",
            averageDays: averageDays ? `${averageDays} days` : "Flexible",
            topCategory,
        };
    }, [sliderTours]);

    useEffect(() => {
        const element = sliderViewportRef.current;
        if (!element) return;

        const updateLayout = () => {
            const width = element.clientWidth;
            const perView = width < 760 ? 1 : width < 1180 ? 2 : 3;
            const gap = width < 760 ? 12 : 16;
            const itemWidth = Math.max((width - gap * (perView - 1)) / perView, 220);
            setSlideConfig({ perView, gap, width: itemWidth });
        };

        updateLayout();
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateLayout);
            return () => window.removeEventListener("resize", updateLayout);
        }

        const observer = new ResizeObserver(updateLayout);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const maxSliderStep = Math.max(sliderTours.length - slideConfig.perView, 0);
    const sliderPages = maxSliderStep + 1;
    const sliderProgress = sliderPages > 1 ? (sliderStep / (sliderPages - 1)) * 100 : 100;

    useEffect(() => {
        setSliderStep(0);
    }, [selectedExperience, slideConfig.perView]);

    useEffect(() => {
        setSliderStep((prev) => Math.min(prev, maxSliderStep));
    }, [maxSliderStep]);

    useEffect(() => {
        if (maxSliderStep <= 0) return;
        const timer = window.setInterval(() => {
            setSliderStep((prev) => (prev >= maxSliderStep ? 0 : prev + 1));
        }, 6500);
        return () => window.clearInterval(timer);
    }, [maxSliderStep, selectedExperience]);

    const experienceVars = {
        "--experience-accent": activeConfig.accent,
        "--experience-soft": activeConfig.softBackground,
        "--experience-gradient": activeConfig.gradient,
    } as CSSProperties;

    return (
        <div className={styles.page} style={experienceVars}>
            <ExperienceSelector selected={selectedExperience} onSelect={setSelectedExperience} />

            <section id="content-section" className={`section ${styles.experienceFlowSection}`}>
                <div className={`container ${styles.experienceFlowLayout}`}>
                    <aside className={styles.rentsSidebar}>
                        <div className={styles.experienceSnapshot}>
                            <span className={styles.experienceSnapshotLabel}>
                                {selectedExperience ? `${titleCase(selectedExperience)} Mode` : "Smart Planner"}
                            </span>
                            <h3 className={styles.experienceSnapshotTitle}>{activeConfig.railLabel}</h3>
                            <p className={styles.experienceSnapshotText}>{activeConfig.rentHint}</p>
                            {selectedExperience && (
                                <button
                                    type="button"
                                    className={styles.experienceResetBtn}
                                    onClick={() => setSelectedExperience(null)}
                                >
                                    Clear Selection
                                </button>
                            )}
                        </div>

                        <div className={styles.rentsPanel}>
                            <div className={styles.rentsPanelHeader}>
                                <span>Rents Sidebar</span>
                                <h3>Transfers & Rentals</h3>
                            </div>
                            {prioritizedTransfers.length > 0 ? (
                                <div className={styles.rentsMiniList}>
                                    {sidebarTransfers.map((transfer) => (
                                        <Link
                                            key={transfer.slug}
                                            href={`/rentals/transfers/${transfer.slug}`}
                                            className={styles.rentMiniCard}
                                        >
                                            <div className={styles.rentMiniRoute}>
                                                <span>{transfer.pickupLocation || "Pickup"}</span>
                                                <span className={styles.rentMiniArrow}>→</span>
                                                <span>{transfer.dropoffLocation || "Drop-off"}</span>
                                            </div>
                                            <div className={styles.rentMiniMeta}>
                                                <span>{transfer.duration || "Custom timing"}</span>
                                                <strong>{transfer.price > 0 ? `$${transfer.price}` : "Quote"}</strong>
                                            </div>
                                        </Link>
                                    ))}
                                    {extraTransferCount > 0 && (
                                        <Link href="/rentals" className={styles.moreRoutesNote}>
                                            +{extraTransferCount} more routes in rentals
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.tourRailEmpty}>
                                    <p>Transfer data is syncing. Rentals menu remains available.</p>
                                </div>
                            )}
                            <div className={styles.rentsPanelActions}>
                                <Link href="/rentals" className="btn btn-secondary">
                                    All Services
                                </Link>
                                <Link href="/rentals" className="btn btn-accent">
                                    Browse Cars
                                </Link>
                            </div>
                        </div>
                    </aside>

                    <div className={styles.tourRailWrap}>
                        <div className={styles.tourRailHeader}>
                            <div>
                                <span className={styles.sectionLabel}>{activeConfig.railLabel}</span>
                                <h2>Compare Faster, Decide Cleaner</h2>
                                <p className={styles.tourRailText}>{activeConfig.railText}</p>
                            </div>
                            <div className={styles.tourRailHeaderActions}>
                                <div className={styles.tourSliderControls}>
                                    <button
                                        type="button"
                                        className={styles.tourSliderBtn}
                                        onClick={() => setSliderStep((prev) => (prev <= 0 ? maxSliderStep : prev - 1))}
                                        aria-label="Previous tours"
                                        disabled={maxSliderStep === 0}
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.tourSliderBtn}
                                        onClick={() => setSliderStep((prev) => (prev >= maxSliderStep ? 0 : prev + 1))}
                                        aria-label="Next tours"
                                        disabled={maxSliderStep === 0}
                                    >
                                        →
                                    </button>
                                </div>
                                <Link href="/tours" className="btn btn-secondary">
                                    All Tours →
                                </Link>
                            </div>
                        </div>

                        {sliderTours.length > 0 ? (
                            <>
                                <div className={styles.tourMetaStrip}>
                                    <article className={styles.tourMetaChip}>
                                        <span>Live Routes</span>
                                        <strong>{tourStats.total}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Average Duration</span>
                                        <strong>{tourStats.averageDays}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Average Budget</span>
                                        <strong>{tourStats.averagePrice}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Strongest Theme</span>
                                        <strong>{tourStats.topCategory}</strong>
                                    </article>
                                </div>

                                <div className={styles.tourSliderShell}>
                                    <div className={styles.tourSliderViewport} ref={sliderViewportRef}>
                                        <div
                                            className={styles.tourSliderTrack}
                                            style={{
                                                gap: `${slideConfig.gap}px`,
                                                transform: `translate3d(-${sliderStep * (slideConfig.width + slideConfig.gap)}px, 0, 0)`,
                                            }}
                                        >
                                            {sliderTours.map((tour, index) => (
                                                <article
                                                    key={tour.slug}
                                                    className={styles.tourSlideCard}
                                                    style={{ minWidth: `${slideConfig.width}px`, width: `${slideConfig.width}px` }}
                                                >
                                                    <div className={styles.tourSlideImageWrap}>
                                                        <div
                                                            className={styles.tourRailImage}
                                                            style={{
                                                                backgroundImage: tour.image ? `url(${tour.image})` : "none",
                                                                backgroundColor: "var(--color-sand-dark)",
                                                            }}
                                                        />
                                                        {index < 2 && <span className={styles.tourSlideBadge}>Top Pick</span>}
                                                    </div>
                                                    <div className={styles.tourRailBody}>
                                                        <div className={styles.tourRailTags}>
                                                            <span className={styles.tourRailCategory}>
                                                                {tour.category ? titleCase(tour.category.replace("-", " ")) : "Signature"}
                                                            </span>
                                                            {tour.duration && (
                                                                <span className={styles.tourRailDuration}>{tour.duration}</span>
                                                            )}
                                                        </div>
                                                        <h3>{tour.title}</h3>
                                                        <p className={styles.tourRailExcerpt}>
                                                            {getTourExcerpt(tour.category || "", selectedExperience)}
                                                        </p>
                                                        <div className={styles.tourRailFooter}>
                                                            <span>{tour.price > 0 ? `From ${formatMoney(tour.price)}` : "Custom quote"}</span>
                                                            <Link href={`/tours/${tour.slug}`} className="btn btn-accent">
                                                                Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.tourSliderFooter}>
                                    <div className={styles.tourSliderDots}>
                                        {Array.from({ length: sliderPages }).map((_, index) => (
                                            <button
                                                type="button"
                                                key={`slider-dot-${index}`}
                                                aria-label={`Go to slider page ${index + 1}`}
                                                className={`${styles.tourSliderDot} ${index === sliderStep ? styles.tourSliderDotActive : ""}`}
                                                onClick={() => setSliderStep(index)}
                                            />
                                        ))}
                                    </div>
                                    <span className={styles.tourSliderCount}>
                                        {Math.min(sliderStep + slideConfig.perView, sliderTours.length)} / {sliderTours.length}
                                    </span>
                                </div>
                                <div className={styles.tourSliderProgress} aria-hidden="true">
                                    <span style={{ width: `${sliderProgress}%` }} />
                                </div>
                                <div className={styles.tourRailBottomRow}>
                                    <p>
                                        Need a custom route instead of preset cards? Open the planner and get a
                                        personalized itinerary with transfer pairing.
                                    </p>
                                    <Link href="/tours#tour-planner" className={styles.tourRailPlannerLink}>
                                        Open Quick Planner
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className={styles.tourRailEmpty}>
                                <p>No tours available at this time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={`section ${styles.guidesEditorialSection}`}>
                <div className="container">
                    <div className={styles.guidesEditorialHeader}>
                        <div>
                            <span className={styles.sectionLabel}>{activeConfig.guideLabel}</span>
                            <h2>Editorial Desk</h2>
                            <p>{activeConfig.guideText}</p>
                        </div>
                        <Link href="/guides" className="btn btn-secondary">
                            All Guides →
                        </Link>
                    </div>

                    {featuredGuide ? (
                        <div className={styles.guidesEditorialLayout}>
                            <article className={styles.guideHeroCard}>
                                <div
                                    className={styles.guideHeroImage}
                                    style={{
                                        backgroundImage: featuredGuide.image ? `url(${featuredGuide.image})` : "none",
                                        backgroundColor: "var(--color-sand-dark)",
                                    }}
                                />
                                <div className={styles.guideHeroShade} />
                                <div className={styles.guideHeroContent}>
                                    <span className={styles.guideHeroCategory}>
                                        {featuredGuide.category || "Travel Guide"}
                                    </span>
                                    <h3>
                                        <Link href={`/guides/${featuredGuide.slug}`}>{featuredGuide.title}</Link>
                                    </h3>
                                    <div className={styles.guideHeroMeta}>
                                        {featuredGuide.author ? `By ${featuredGuide.author}` : "RushZanzibar Editorial"}
                                        {featuredGuide.date ? ` • ${featuredGuide.date}` : ""}
                                    </div>
                                    <Link href={`/guides/${featuredGuide.slug}`} className="btn btn-accent">
                                        Read Feature
                                    </Link>
                                </div>
                            </article>

                            <div className={styles.guideListPanel}>
                                <div className={styles.guideStackIntro}>
                                    <span>Fresh Reads</span>
                                    <strong>Operational tips and real route context from our local desk.</strong>
                                </div>
                                {sideGuides.map((guide) => (
                                    <article key={guide.slug} className={styles.guideListCard}>
                                        <div
                                            className={styles.guideListThumb}
                                            style={{
                                                backgroundImage: guide.image ? `url(${guide.image})` : "none",
                                                backgroundColor: "var(--color-sand-dark)",
                                            }}
                                        />
                                        <div className={styles.guideListBody}>
                                            <span className={styles.guideListCategory}>{guide.category || "Guide"}</span>
                                            <h3>
                                                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                                            </h3>
                                            <div className={styles.guideListMeta}>
                                                {guide.author ? `By ${guide.author}` : "Editorial"}
                                                {guide.date ? ` • ${guide.date}` : ""}
                                            </div>
                                        </div>
                                    </article>
                                ))}

                                <div className={styles.guideListCta}>
                                    <span>Need trip-specific recommendations?</span>
                                    <Link href="/contact" className="btn btn-secondary">
                                        Talk to an Advisor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.tourRailEmpty}>
                            <p>No articles available at this time.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className={`${styles.destinations} section`} style={{ background: "var(--color-sand)" }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>{selectedExperience ? activeConfig.destinationLabel : "Explore"}</span>
                            <h2>{selectedExperience ? "Matched Destinations" : "Popular Destinations"}</h2>
                        </div>
                        <Link href="/tanzania" className="btn btn-secondary">
                            View All →
                        </Link>
                    </div>
                    {destinations.length > 0 ? (
                        <div className={styles.destinationsGrid}>
                            {prioritizedDestinations.map((destination) => (
                                <Link key={destination.slug} href={`/tanzania/${destination.slug}`} className={styles.destinationCard}>
                                    <div
                                        className={styles.destinationImage}
                                        style={{
                                            backgroundImage: destination.image ? `url(${destination.image})` : "none",
                                            backgroundColor: "var(--color-sand-dark)",
                                        }}
                                    />
                                    <div className={styles.destinationInfo}>
                                        <h3>{destination.name}</h3>
                                        {destination.tagline && <p>{destination.tagline}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "4rem 0" }}>
                            <p>No destinations available at this time.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
