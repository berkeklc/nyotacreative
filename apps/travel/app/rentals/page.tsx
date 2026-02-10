"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./rentals.module.css";

interface TransferRoute {
    name: string;
    slug: string;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    duration: string;
    price: number;
    priceReturn: number;
    vehicleType: string;
    image: string | null;
    featured: boolean;
}

interface RentalVehicle {
    name: string;
    slug: string;
    category: string;
    transmission: string;
    seats: number;
    pricePerDay: number;
    pricePerWeek: number;
    features: string[];
    image: string | null;
    featured: boolean;
    available: boolean;
}

type TabType = "transfers" | "vehicles";

export default function RentalsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("transfers");
    const [transfers, setTransfers] = useState<TransferRoute[]>([]);
    const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/rentals");
                if (res.ok) {
                    const json = await res.json();
                    setTransfers(json.transfers || []);
                    setVehicles(json.vehicles || []);
                }
            } catch (err) {
                console.error("Failed to fetch rental data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const categoryIcons: Record<string, string> = {
        sedan: "🚗",
        suv: "🚙",
        offroad: "🛻",
        van: "🚐",
        luxury: "✨",
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <img
                        src="/hero-safari.jpg"
                        alt="Background"
                        className={styles.heroBgImage}
                    />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Travel Tanzania<br />
                        <span>In Style</span>
                    </h1>

                    {/* Floating Tabs */}
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

            {/* Transfers Section */}
            {activeTab === "transfers" && (
                <section className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Premium Transfers</h2>
                        <p>Relax in comfort with our professional chauffeur service. Fixed rates, reliable drivers.</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "4rem 0" }}>
                            <p>Loading transfer routes...</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {transfers.map((route) => (
                                <Link
                                    key={route.slug}
                                    href={`/rentals/transfers/${route.slug}`}
                                    className={styles.card}
                                >
                                    <div className={styles.cardImageContainer}>
                                        <div
                                            className={styles.cardImage}
                                            style={{ backgroundImage: route.image ? `url(${route.image})` : undefined, backgroundColor: '#eee' }}
                                        />
                                        <div className={styles.cardOverlay} />
                                        {route.featured && <span className={styles.cardBadge}>Popular</span>}
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardSubtitle}>Private Transfer</div>
                                        <h3 className={styles.cardTitle}>{route.pickupLocation} to {route.dropoffLocation}</h3>

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
                    )}
                </section>
            )}

            {/* Vehicles Section */}
            {activeTab === "vehicles" && (
                <section className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Self-Drive Fleet</h2>
                        <p>Explore at your own pace with our fully equipped 4x4 vehicles.</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "4rem 0" }}>
                            <p>Loading vehicles...</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {vehicles.filter(v => v.available).map((vehicle) => (
                                <Link
                                    key={vehicle.slug}
                                    href={`/rentals/vehicles/${vehicle.slug}`}
                                    className={styles.card}
                                >
                                    <div className={styles.cardImageContainer}>
                                        <div
                                            className={styles.cardImage}
                                            style={{ backgroundImage: vehicle.image ? `url(${vehicle.image})` : undefined, backgroundColor: '#eee' }}
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
                    )}
                </section>
            )}

            {/* CTA Section */}
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
                        <a href="https://wa.me/255XXXXXXXXX" className={styles.ctaBtnPrimary} target="_blank" rel="noopener noreferrer">
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
