"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";
import ExperienceSelector, { type ExperienceType } from "./ExperienceSelector";
import type { HomePageData } from "../lib/homepage";

export default function HomePageClient({ initialData }: { initialData: HomePageData }) {
    const [selectedExperience, setSelectedExperience] = useState<ExperienceType>(null);

    const { destinations, tours, articles, transfers: displayTransfers } = initialData;

    const getFilteredTours = () => {
        if (!selectedExperience) return tours;

        const categoryMap: Record<string, string[]> = {
            beach: ["beach", "coastal", "island", "zanzibar"],
            safari: ["safari", "wildlife", "mountain", "camping", "serengeti", "ngorongoro"],
            city: ["city", "cultural", "urban", "stone town", "dar"],
        };

        const keywords = categoryMap[selectedExperience] || [];
        const filtered = tours.filter((tour) =>
            keywords.some(
                (keyword) =>
                    tour.title?.toLowerCase().includes(keyword) ||
                    tour.category?.toLowerCase().includes(keyword)
            )
        );
        const others = tours.filter((tour) => !filtered.includes(tour));
        return [...filtered, ...others];
    };

    const getFilteredArticles = () => {
        if (!selectedExperience) return articles;

        const categoryMap: Record<string, string[]> = {
            beach: ["beaches", "beach", "coastal", "water"],
            safari: ["safari", "adventure", "wildlife", "nature"],
            city: ["culture", "food", "urban", "tips"],
        };

        const keywords = categoryMap[selectedExperience] || [];
        const filtered = articles.filter((article) =>
            keywords.some((keyword) => article.category?.toLowerCase().includes(keyword))
        );
        const others = articles.filter((article) => !filtered.includes(article));
        return [...filtered, ...others];
    };

    const filteredTours = getFilteredTours();
    const filteredArticles = getFilteredArticles();

    return (
        <div className={styles.page}>
            <ExperienceSelector selected={selectedExperience} onSelect={setSelectedExperience} />

            <section id="content-section" className={`${styles.tours} section`} style={{ background: "var(--color-sand)" }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>
                                {selectedExperience
                                    ? `${selectedExperience.charAt(0).toUpperCase() + selectedExperience.slice(1)} Tours`
                                    : "Recommendations"}
                            </span>
                            <h2>Signature Experiences</h2>
                        </div>
                        <Link href="/tours" className="btn btn-secondary">
                            All Tours →
                        </Link>
                    </div>
                    {filteredTours.length > 0 ? (
                        <div className={styles.toursGrid}>
                            {filteredTours.slice(0, 4).map((tour) => (
                                <article key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : "none",
                                            backgroundColor: "var(--color-sand-dark)",
                                        }}
                                    />
                                    <div className={styles.tourContent}>
                                        <div className={styles.tourMeta}>
                                            {tour.duration && <span>⏱️ {tour.duration}</span>}
                                        </div>
                                        <h3>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <span>
                                                    From <strong>${tour.price}</strong>
                                                </span>
                                            )}
                                            <Link href={`/tours/${tour.slug}`} className="btn btn-accent">
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "4rem 0" }}>
                            <p>No tours available at this time.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className={`${styles.tours} section`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>🚗 Transport</span>
                            <h2>Transfers & Car Rental</h2>
                        </div>
                        <Link href="/rentals" className="btn btn-secondary">
                            All Services →
                        </Link>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        {displayTransfers.slice(0, 3).map((transfer) => (
                            <Link
                                key={transfer.slug}
                                href={`/rentals/transfers/${transfer.slug}`}
                                className="card"
                                style={{ padding: "1.5rem", textDecoration: "none", color: "inherit" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: "0.65rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                color: "var(--color-slate)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Pickup
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{transfer.pickupLocation}</div>
                                    </div>
                                    <div style={{ color: "var(--color-terracotta)", fontSize: "1.2rem" }}>→</div>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: "0.65rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                color: "var(--color-slate)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Drop-off
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{transfer.dropoffLocation}</div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingTop: "0.75rem",
                                        borderTop: "1px solid var(--color-sand-dark)",
                                    }}
                                >
                                    <span style={{ fontSize: "0.85rem", color: "var(--color-slate)" }}>⏱️ {transfer.duration}</span>
                                    <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--color-terracotta)" }}>
                                        From ${transfer.price}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <Link href="/rentals" className="btn btn-accent">
                            Browse Self-Drive Cars →
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${styles.guides} section`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>Local Insights</span>
                            <h2>Insider Knowledge</h2>
                        </div>
                        <Link href="/guides" className="btn btn-secondary">
                            All Guides →
                        </Link>
                    </div>
                    {filteredArticles.length > 0 ? (
                        <div className={styles.guidesGrid}>
                            {filteredArticles.slice(0, 3).map((guide) => (
                                <article key={guide.slug} className={`${styles.guideCard} card`}>
                                    <div
                                        className={styles.guideImage}
                                        style={{
                                            backgroundImage: guide.image ? `url(${guide.image})` : "none",
                                            backgroundColor: "var(--color-sand-dark)",
                                        }}
                                    />
                                    <div className={styles.guideContent}>
                                        {guide.category && <span className={styles.guideCategory}>{guide.category}</span>}
                                        <h3>
                                            <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                                        </h3>
                                        <div className={styles.guideMeta}>
                                            {(guide.author || guide.date) && (
                                                <span>
                                                    {guide.author ? `By ${guide.author}` : ""}
                                                    {guide.author && guide.date ? " • " : ""}
                                                    {guide.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "4rem 0" }}>
                            <p>No articles available at this time.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className={`${styles.destinations} section`} style={{ background: "var(--color-sand)" }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>Explore</span>
                            <h2>Popular Destinations</h2>
                        </div>
                        <Link href="/tanzania" className="btn btn-secondary">
                            View All →
                        </Link>
                    </div>
                    {destinations.length > 0 ? (
                        <div className={styles.destinationsGrid}>
                            {destinations.map((destination) => (
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
