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
        railLabel: "Coastal Route Planner",
        railText: "Compare coastal routes with clear duration and budget signals before booking.",
        rentHint: "Professional private transfer and self-drive rental support across coastal hotels, ferry points, and airports.",
        guideLabel: "Coastal Briefings",
        guideText: "From tidal patterns to quiet bays, these reads keep your beach days smooth.",
        destinationLabel: "Coastal Stops",
    },
    safari: {
        accent: "var(--color-safari)",
        softBackground: "rgba(61, 107, 79, 0.12)",
        gradient: "linear-gradient(135deg, rgba(61, 107, 79, 0.94) 0%, rgba(42, 74, 54, 0.86) 100%)",
        railLabel: "Safari Route Planner",
        railText: "Review wildlife routes with practical timing, budget, and category clarity.",
        rentHint: "Dedicated transfer and rent-a-car operations for airport pickups, lodge drops, and intercity movement.",
        guideLabel: "Field Notes",
        guideText: "Planning windows, migration timing, and route advice from local operations.",
        destinationLabel: "Safari Gateways",
    },
    city: {
        accent: "var(--color-city)",
        softBackground: "rgba(212, 133, 58, 0.14)",
        gradient: "linear-gradient(135deg, rgba(212, 133, 58, 0.95) 0%, rgba(166, 101, 40, 0.86) 100%)",
        railLabel: "City Route Planner",
        railText: "Sort urban routes by duration, budget, and experience theme in one clean rail.",
        rentHint: "City transfer desk and self-drive fleet for airport links, business rides, and flexible daily rental.",
        guideLabel: "City Intelligence",
        guideText: "Neighborhoods, food routes, and culture-focused tips for efficient city days.",
        destinationLabel: "Culture Anchors",
    },
};

const DEFAULT_CONFIG: ExperienceUiConfig = {
    accent: "var(--color-terracotta)",
    softBackground: "rgba(181, 74, 50, 0.1)",
    gradient: "linear-gradient(135deg, rgba(181, 74, 50, 0.92) 0%, rgba(148, 61, 40, 0.85) 100%)",
    railLabel: "Routes-First Planner",
    railText: "Compare signature routes side-by-side with clear duration, price, and category context.",
    rentHint: "Ground Mobility Desk for private transfer services and fully supported self-drive rentals.",
    guideLabel: "Local Planning Notes",
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

function parseDurationMinutes(duration: string) {
    if (!duration) return null;
    const normalized = duration.toLowerCase();
    let total = 0;
    let matched = false;

    const hours = normalized.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
    const minutes = normalized.match(/(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes)/);

    if (hours) {
        total += Number(hours[1]) * 60;
        matched = true;
    }
    if (minutes) {
        total += Number(minutes[1]);
        matched = true;
    }

    if (!matched) {
        const numeric = normalized.match(/(\d+(?:\.\d+)?)/);
        if (!numeric) return null;
        total = Number(numeric[1]);
    }

    return Number.isFinite(total) && total > 0 ? Math.round(total) : null;
}

function formatDurationMinutes(totalMinutes: number | null) {
    if (!totalMinutes) return "Flexible";
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
}

function formatMoney(value: number) {
    return `$${value.toLocaleString("en-US")}`;
}

function getTourExcerpt(tourCategory: string, selectedExperience: ExperienceType) {
    const categoryLabel = tourCategory ? titleCase(tourCategory.replace("-", " ")) : "Curated Route";
    if (selectedExperience === "beach") {
        return `${categoryLabel} with sea-facing pacing, blue-water windows, and curated coastal stop balance.`;
    }
    if (selectedExperience === "safari") {
        return `${categoryLabel} tuned for wildlife windows, park timing, and immersive overland rhythm.`;
    }
    if (selectedExperience === "city") {
        return `${categoryLabel} built around culture, food districts, and heritage-friendly urban pacing.`;
    }
    return `${categoryLabel} structured by local specialists with balanced timing and flexible route options.`;
}

function getTourTravelVibe(tourCategory: string, selectedExperience: ExperienceType, index: number) {
    if (selectedExperience === "beach") {
        return index % 2 === 0 ? "Sunset Coastline" : "Marine Day Rhythm";
    }
    if (selectedExperience === "safari") {
        return index % 2 === 0 ? "Wildlife Prime Time" : "Lodge-to-Game Flow";
    }
    if (selectedExperience === "city") {
        return index % 2 === 0 ? "Heritage Streets" : "Culture & Food Loop";
    }
    const normalized = tourCategory.toLowerCase();
    if (normalized.includes("safari")) return "Wildlife Signature";
    if (normalized.includes("beach") || normalized.includes("coast")) return "Coastal Signature";
    if (normalized.includes("city") || normalized.includes("culture")) return "Urban Signature";
    return "Signature Route";
}

function getTourPlanningSignal(duration: string, selectedExperience: ExperienceType) {
    const normalized = duration.toLowerCase();
    if (normalized.includes("hour") || normalized.includes("min") || normalized.includes("hr")) {
        const minutes = parseDurationMinutes(duration);
        if (minutes && minutes <= 180) return "Easy same-day add-on";
        if (minutes && minutes <= 360) return "Half-day itinerary fit";
        if (minutes) return "Extended day activity";
    }

    const days = parseDurationDays(duration);
    if (days && days >= 5) return "Immersive multi-day stay";
    if (days && days >= 2) return "Balanced short itinerary";

    if (selectedExperience === "beach") return "Pairs with hotel transfer plans";
    if (selectedExperience === "safari") return "Pairs with lodge transfer timing";
    if (selectedExperience === "city") return "Pairs with urban pickup routing";
    return "Flexible planning window";
}

export default function HomePageClient({ initialData }: { initialData: HomePageData }) {
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType>(null);
    const [sliderStep, setSliderStep] = useState(0);
    const [slideConfig, setSlideConfig] = useState({ perView: 3, gap: 16, width: 300 });
    const sliderViewportRef = useRef<HTMLDivElement | null>(null);
    const transferZoneRef = useRef<HTMLDivElement | null>(null);
    const [showTransferAssist, setShowTransferAssist] = useState(false);
    const [dismissedTransferAssist, setDismissedTransferAssist] = useState(false);

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

    const transferSnapshot = useMemo(() => {
        const pricedTransfers = prioritizedTransfers.filter((transfer) => transfer.price > 0);
        const entryFare = pricedTransfers.length
            ? Math.min(...pricedTransfers.map((transfer) => transfer.price))
            : null;
        const fastestTransferMinutes = prioritizedTransfers
            .map((transfer) => parseDurationMinutes(transfer.duration || ""))
            .filter((value): value is number => value !== null)
            .sort((a, b) => a - b)[0] ?? null;
        const servicePoints = new Set(
            prioritizedTransfers.flatMap((transfer) => [transfer.pickupLocation, transfer.dropoffLocation].filter(Boolean))
        ).size;

        return {
            routeCount: prioritizedTransfers.length,
            entryFare: entryFare ? formatMoney(entryFare) : "Quote",
            fastestRide: formatDurationMinutes(fastestTransferMinutes),
            servicePoints: servicePoints > 0 ? `${servicePoints}+ points` : "Island-wide",
        };
    }, [prioritizedTransfers]);

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

    useEffect(() => {
        if (dismissedTransferAssist) return;
        const zone = transferZoneRef.current;
        if (!zone) return;

        if (typeof IntersectionObserver === "undefined") {
            const timer = window.setTimeout(() => setShowTransferAssist(true), 420);
            return () => window.clearTimeout(timer);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShowTransferAssist(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(zone);
        return () => observer.disconnect();
    }, [dismissedTransferAssist]);

    const experienceVars = {
        "--experience-accent": activeConfig.accent,
        "--experience-soft": activeConfig.softBackground,
        "--experience-gradient": activeConfig.gradient,
    } as CSSProperties;
    const transferAssistUrl = `https://wa.me/255794094733?text=${encodeURIComponent(
        "Hello! I need help with the most accurate transfer and rent a car planning."
    )}`;

    return (
        <div className={styles.page} style={experienceVars}>
            <ExperienceSelector selected={selectedExperience} onSelect={setSelectedExperience} />

            <section id="content-section" className={`section ${styles.experienceFlowSection}`}>
                <div className={styles.experienceFlowLayout}>
                    <div className={styles.transferZone} ref={transferZoneRef}>
                        <div className={styles.transferIntro}>
                            <div className={styles.transferIntroTopRow}>
                                <div>
                                    <span className={styles.transferIntroLabel}>
                                        Ground Mobility Services
                                    </span>
                                    <h3 className={styles.transferIntroTitle}>Private Transfers & Rent A Car Desk</h3>
                                    <p className={styles.transferIntroText}>{activeConfig.rentHint}</p>
                                </div>
                                {selectedExperience && (
                                    <button
                                        type="button"
                                        className={styles.transferResetBtn}
                                        onClick={() => setSelectedExperience(null)}
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                            <div className={styles.transferSnapshotRow}>
                                <article className={styles.transferSnapshotItem}>
                                    <strong>{transferSnapshot.routeCount}</strong>
                                    <span>Live routes</span>
                                </article>
                                <article className={styles.transferSnapshotItem}>
                                    <strong>{transferSnapshot.fastestRide}</strong>
                                    <span>Fastest ride</span>
                                </article>
                                <article className={styles.transferSnapshotItem}>
                                    <strong>{transferSnapshot.entryFare}</strong>
                                    <span>Entry fare</span>
                                </article>
                                <article className={styles.transferSnapshotItem}>
                                    <strong>{transferSnapshot.servicePoints}</strong>
                                    <span>Service coverage</span>
                                </article>
                            </div>
                        </div>

                        <div className={styles.transferBody}>
                            <div className={styles.transferServicesColumn}>
                                <article className={`${styles.mobilityServiceCard} ${styles.mobilityServiceTransfer}`}>
                                    <div className={styles.mobilityServiceHeader}>
                                        <span className={styles.mobilityServiceType}>Private Chauffeur Transfers</span>
                                        <strong className={styles.mobilityServiceHighlight}>Airport / Hotel / Ferry / City</strong>
                                    </div>
                                    <p className={styles.mobilityServiceText}>
                                        Point-to-point transfer operations with licensed local drivers and dispatch
                                        control for arrivals, departures, and intercity moves.
                                    </p>
                                    <ul className={styles.mobilityServiceList}>
                                        <li>Flight tracking and delay-aware pickup coordination</li>
                                        <li>Meet and greet with name-board on airport arrivals</li>
                                        <li>Fixed transparent fares and 24/7 operations support</li>
                                    </ul>
                                    <div className={styles.mobilityServiceFooter}>
                                        <span>From {transferSnapshot.entryFare}</span>
                                        <Link href="/rentals" className={styles.mobilityOptionLink}>
                                            Explore Transfer Routes
                                        </Link>
                                    </div>
                                </article>

                                <article className={`${styles.mobilityServiceCard} ${styles.mobilityServiceRental}`}>
                                    <div className={styles.mobilityServiceHeader}>
                                        <span className={styles.mobilityServiceType}>Self-Drive Car Rentals</span>
                                        <strong className={styles.mobilityServiceHighlight}>Daily / Weekly / Long Stay</strong>
                                    </div>
                                    <p className={styles.mobilityServiceText}>
                                        Professional rent-a-car service with insured vehicles, category-based pricing,
                                        and optional delivery to airport or hotel locations.
                                    </p>
                                    <ul className={styles.mobilityServiceList}>
                                        <li>Automatic and manual fleet options by budget tier</li>
                                        <li>Flexible pickup and return points across key zones</li>
                                        <li>Roadside support and quick replacement workflow</li>
                                    </ul>
                                    <div className={styles.mobilityServiceFooter}>
                                        <span>Insured and maintained fleet</span>
                                        <Link href="/rentals" className={styles.mobilityOptionLink}>
                                            Browse Rental Fleet
                                        </Link>
                                    </div>
                                </article>
                            </div>

                            <div className={styles.rentsPanel}>
                                <div className={styles.rentsPanelHeader}>
                                    <span>Live Transfer Routes</span>
                                    <h3>Most booked point-to-point services</h3>
                                    <p className={styles.rentsPanelNote}>
                                        Real route pairs with current duration and starting fare visibility.
                                    </p>
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
                                                +{extraTransferCount} more transfer routes available
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.tourRailEmpty}>
                                        <p>Transfer routes are being refreshed. Rental options remain available now.</p>
                                    </div>
                                )}
                                <div className={styles.rentsPanelActions}>
                                    <Link href="/rentals" className="btn btn-secondary">
                                        See All Transfer Routes
                                    </Link>
                                    <Link href="/rentals" className="btn btn-accent">
                                        Browse Self-Drive Fleet
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.tourRailWrap}>
                        <div className={styles.tourRailHeader}>
                            <div>
                                <span className={styles.sectionLabel}>{activeConfig.railLabel}</span>
                                <h2>Compare Signature Tours with Full Route Context</h2>
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
                                    View All Tours →
                                </Link>
                            </div>
                        </div>

                        {sliderTours.length > 0 ? (
                            <>
                                <div className={styles.tourMetaStrip}>
                                    <article className={styles.tourMetaChip}>
                                        <span>Routes Live Now</span>
                                        <strong>{tourStats.total}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Typical Duration</span>
                                        <strong>{tourStats.averageDays}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Typical Budget</span>
                                        <strong>{tourStats.averagePrice}</strong>
                                    </article>
                                    <article className={styles.tourMetaChip}>
                                        <span>Leading Theme</span>
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
                                                        <div className={styles.tourRailSignalRow}>
                                                            <span className={styles.tourSignalChip}>
                                                                {getTourTravelVibe(tour.category || "", selectedExperience, index)}
                                                            </span>
                                                            <span className={styles.tourSignalChipMuted}>
                                                                {getTourPlanningSignal(tour.duration || "", selectedExperience)}
                                                            </span>
                                                        </div>
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
                                        Need custom planning? Share travel dates and location points to receive a
                                        tailored itinerary proposal with operational recommendations.
                                    </p>
                                    <Link href="/tours#tour-planner" className={styles.tourRailPlannerLink}>
                                        Build Route Plan
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

            {showTransferAssist && !dismissedTransferAssist && (
                <aside className={styles.transferAssistBubble} aria-live="polite">
                    <button
                        type="button"
                        className={styles.transferAssistClose}
                        aria-label="Close transfer planning helper"
                        onClick={() => {
                            setDismissedTransferAssist(true);
                            setShowTransferAssist(false);
                        }}
                    >
                        ×
                    </button>
                    <span className={styles.transferAssistLabel}>Need the best transfer plan?</span>
                    <p className={styles.transferAssistText}>
                        Talk to our operations advisor for the most accurate route, pickup time, and
                        vehicle recommendation.
                    </p>
                    <a
                        href={transferAssistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.transferAssistCta}
                    >
                        Chat on WhatsApp
                    </a>
                </aside>
            )}

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
