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
        <div style={{ background: "#0f1923", minHeight: "100vh" }}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>🚗 Transport & Rentals</span>
                    <h1 className={styles.heroTitle}>
                        Travel Tanzania<br />
                        <span>Your Way</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Airport transfers, city rides, and self-drive car rentals.
                        Get where you need to be comfortably, safely, and at the best price.
                    </p>
                    {/* Tab Switcher */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "transfers" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("transfers")}
                        >
                            <span className={styles.tabIcon}>🛫</span>
                            Transfers
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "vehicles" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("vehicles")}
                        >
                            <span className={styles.tabIcon}>🚗</span>
                            Self-Drive
                        </button>
                    </div>
                </div>
            </section>

            {/* Transfers Section */}
            {/* Transfers Section */}
            {activeTab === "transfers" && (
                <section className={styles.transfersSection}>
                    <div className="container">
                        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                            <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 400, marginBottom: "1rem", fontFamily: "var(--font-serif)", color: "white" }}>
                                Popular Transfer Routes
                            </h2>
                            <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                                Safe, reliable, and comfortable transfers across Tanzania and Zanzibar.
                                All prices include meet & greet.
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem 0", color: "white" }}>
                                <p>Loading transfer routes...</p>
                            </div>
                        ) : (
                            <div className={styles.transfersGrid}>
                                {transfers.map((route) => (
                                    <Link
                                        key={route.slug}
                                        href={`/rentals/transfers/${route.slug}`}
                                        className={styles.transferCard}
                                    >
                                        <div
                                            className={styles.transferImage}
                                            style={{
                                                backgroundImage: route.image ? `url(${route.image})` : undefined,
                                                backgroundColor: route.image ? undefined : "#1a2d3d",
                                            }}
                                        >
                                            {!route.image && (
                                                <span style={{ fontSize: "3rem", position: "relative", zIndex: 2 }}>
                                                    {route.pickupLocation.includes("Airport") ? "✈️" : "🚗"}
                                                </span>
                                            )}
                                            {route.featured && (
                                                <div className={styles.transferBadge}>Popular</div>
                                            )}
                                        </div>
                                        <div className={styles.transferContent}>
                                            <div className={styles.transferRoute}>
                                                <span className={styles.transferLocationLabel}>From</span>
                                                <span className={styles.transferLocationName}>{route.pickupLocation}</span>
                                                <div className={styles.transferArrow}>↓</div>
                                                <span className={styles.transferLocationLabel}>To</span>
                                                <span className={styles.transferLocationName}>{route.dropoffLocation}</span>
                                            </div>
                                            <div className={styles.transferMeta}>
                                                <span className={styles.transferMetaItem}>
                                                    ⏱️ {route.duration}
                                                </span>
                                                <span className={styles.transferMetaItem}>
                                                    📏 {route.distance}
                                                </span>
                                            </div>
                                            <div className={styles.transferFooter}>
                                                <div className={styles.transferPrice}>
                                                    <span className={styles.transferPriceLabel}>One way</span>
                                                    <span className={styles.transferPriceAmount}>${route.price}</span>
                                                </div>
                                                <div className={styles.transferCta}>→</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Vehicles Section */}
            {activeTab === "vehicles" && (
                <section className={styles.vehiclesSection}>
                    <div className="container">
                        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                            <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 400, marginBottom: "1rem", fontFamily: "var(--font-serif)", color: "white" }}>
                                Self-Drive Fleet
                            </h2>
                            <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                                Explore Tanzania at your own pace. Choose from our fleet of well-maintained,
                                safari-ready vehicles.
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem 0", color: "white" }}>
                                <p>Loading vehicles...</p>
                            </div>
                        ) : (
                            <div className={styles.vehiclesGrid}>
                                {vehicles.filter(v => v.available).map((vehicle) => (
                                    <Link
                                        key={vehicle.slug}
                                        href={`/rentals/vehicles/${vehicle.slug}`}
                                        className={styles.vehicleCard}
                                    >
                                        <div
                                            className={styles.vehicleImage}
                                            style={{
                                                backgroundImage: vehicle.image ? `url(${vehicle.image})` : undefined,
                                                backgroundColor: vehicle.image ? undefined : "#1a2d3d",
                                            }}
                                        >
                                            {!vehicle.image && (
                                                <span style={{ fontSize: "4rem", position: "relative", zIndex: 2 }}>
                                                    {categoryIcons[vehicle.category] || "🚗"}
                                                </span>
                                            )}
                                            <div className={styles.vehicleCategoryBadge}>
                                                {vehicle.category}
                                            </div>
                                        </div>
                                        <div className={styles.vehicleContent}>
                                            <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                                            <div className={styles.vehicleSpecs}>
                                                <span className={styles.vehicleSpec}>
                                                    👤 {vehicle.seats}
                                                </span>
                                                <span className={styles.vehicleSpec}>
                                                    ⚙️ {vehicle.transmission}
                                                </span>
                                            </div>
                                            <div className={styles.vehicleFeatures}>
                                                {vehicle.features.slice(0, 3).map((f) => (
                                                    <span key={f} className={styles.vehicleFeature}>
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className={styles.vehicleFooter}>
                                                <div className={styles.vehiclePrice}>
                                                    <span className={styles.vehiclePriceLabel}>Daily Rate</span>
                                                    <span className={styles.vehiclePriceAmount}>
                                                        ${vehicle.pricePerDay}
                                                        <span>/day</span>
                                                    </span>
                                                </div>
                                                <div className={styles.transferCta}>→</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Why Choose Us CTA */}
            <section className={styles.ctaSection} style={{ background: "#0a1016", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <h2 className={styles.ctaTitle} style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>Why Travel With Us?</h2>
                    <p className={styles.ctaText}>
                        All vehicles are regularly maintained and insured. Our drivers are professional,
                        English-speaking, and know every corner of Tanzania.
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1.5rem",
                        maxWidth: "1000px",
                        margin: "0 auto 3rem",
                    }}>
                        {[
                            { icon: "🛡️", title: "Fully Insured", desc: "Comprehensive coverage" },
                            { icon: "⏰", title: "24/7 Support", desc: "Always here to help" },
                            { icon: "💰", title: "Best Prices", desc: "No hidden fees" },
                            { icon: "✅", title: "Flexible", desc: "Easy cancellation" },
                        ].map((item) => (
                            <div key={item.title} style={{
                                padding: "2rem",
                                borderRadius: "var(--radius-lg)",
                                background: "#16202a", // Solid dark background
                                border: "1px solid #2a3b4c",
                                textAlign: "center",
                                backdropFilter: "blur(10px)",
                            }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
                                <div style={{ color: "white", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem", fontFamily: "var(--font-serif)" }}>{item.title}</div>
                                <div style={{ color: "#a3b3c2", fontSize: "0.9rem" }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className={styles.submitBtn} style={{ width: "auto", padding: "1rem 2.5rem", margin: 0 }}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
