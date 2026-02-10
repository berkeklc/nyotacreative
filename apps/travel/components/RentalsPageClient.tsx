"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../app/rentals/rentals.module.css";
import type { TransferRoute, RentalVehicle } from "../lib/rentals";

type TabType = "transfers" | "vehicles";

export default function RentalsPageClient({
    transfers,
    vehicles,
}: {
    transfers: TransferRoute[];
    vehicles: RentalVehicle[];
}) {
    const [activeTab, setActiveTab] = useState<TabType>("transfers");

    return (
        <div className={styles.pageWrapper}>
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <Image src="/hero-safari.jpg" alt="Background" fill className={styles.heroBgImage} sizes="100vw" priority />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Travel Tanzania
                        <br />
                        <span>In Style</span>
                    </h1>

                    <div className={styles.tabsContainer}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === "transfers" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("transfers")}
                        >
                            Chauffeur & Transfers
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === "vehicles" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("vehicles")}
                        >
                            Self-Drive Fleet
                        </button>
                    </div>
                </div>
            </section>

            {activeTab === "transfers" && (
                <section className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Premium Transfers</h2>
                        <p>Relax in comfort with our professional chauffeur service. Fixed rates, reliable drivers.</p>
                    </div>

                    <div className={styles.grid}>
                        {transfers.map((route) => (
                            <Link key={route.slug} href={`/rentals/transfers/${route.slug}`} className={styles.card}>
                                <div className={styles.cardImageContainer}>
                                    <div
                                        className={styles.cardImage}
                                        style={{ backgroundImage: route.image ? `url(${route.image})` : undefined, backgroundColor: "#eee" }}
                                    />
                                    <div className={styles.cardOverlay} />
                                    {route.featured && <span className={styles.cardBadge}>Popular</span>}
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardSubtitle}>Private Transfer</div>
                                    <h3 className={styles.cardTitle}>
                                        {route.pickupLocation} to {route.dropoffLocation}
                                    </h3>

                                    <div className={styles.cardSpecs}>
                                        <span className={styles.specItem}>⏱️ {route.duration}</span>
                                        <span className={styles.specItem}>📏 {route.distance}</span>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.price}>
                                            <span className={styles.priceValue}>${route.price}</span>
                                            <span className={styles.priceLabel}>One Way</span>
                                        </div>
                                        <div className={styles.cardArrow}>→</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === "vehicles" && (
                <section className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Self-Drive Fleet</h2>
                        <p>Explore at your own pace with our fully equipped 4x4 vehicles.</p>
                    </div>

                    <div className={styles.grid}>
                        {vehicles
                            .filter((vehicle) => vehicle.available)
                            .map((vehicle) => (
                                <Link key={vehicle.slug} href={`/rentals/vehicles/${vehicle.slug}`} className={styles.card}>
                                    <div className={styles.cardImageContainer}>
                                        <div
                                            className={styles.cardImage}
                                            style={{
                                                backgroundImage: vehicle.image ? `url(${vehicle.image})` : undefined,
                                                backgroundColor: "#eee",
                                            }}
                                        />
                                        <div className={styles.cardOverlay} />
                                        <span className={styles.cardBadge}>{vehicle.category}</span>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardSubtitle}>Self-Drive</div>
                                        <h3 className={styles.cardTitle}>{vehicle.name}</h3>

                                        <div className={styles.cardSpecs}>
                                            <span className={styles.specItem}>👤 {vehicle.seats} Seats</span>
                                            <span className={styles.specItem}>⚙️ {vehicle.transmission}</span>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.price}>
                                                <span className={styles.priceValue}>${vehicle.pricePerDay}</span>
                                                <span className={styles.priceLabel}>Per Day</span>
                                            </div>
                                            <div className={styles.cardArrow}>→</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </section>
            )}

            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Start Your Adventure</h2>
                    <p className={styles.ctaText}>
                        Ready to hit the road? Our team is available 24/7 to help you plan your perfect trip.
                    </p>
                    <span className={styles.ctaGuidingText}>
                        (If you would like to rent a private vehicle, contact us immediately)
                    </span>
                    <div className={styles.ctaButtons}>
                        <a href="https://wa.me/255794094733" className={styles.ctaBtnPrimary} target="_blank" rel="noopener noreferrer">
                            <span>💬</span> Chat on WhatsApp
                        </a>
                        <Link href="/contact" className={styles.ctaBtnSecondary}>
                            <span>📞</span> Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
