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

// Fallback data while Strapi content types are being set up
const FALLBACK_TRANSFERS: TransferRoute[] = [
    {
        name: "Zanzibar Airport to Nungwi Beach",
        slug: "zanzibar-airport-to-nungwi",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Nungwi Beach",
        distance: "58 km",
        duration: "1h 15min",
        price: 45,
        priceReturn: 80,
        vehicleType: "Sedan / Minivan",
        image: null,
        featured: true,
    },
    {
        name: "Zanzibar Airport to Stone Town",
        slug: "zanzibar-airport-to-stone-town",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Stone Town",
        distance: "8 km",
        duration: "20min",
        price: 20,
        priceReturn: 35,
        vehicleType: "Sedan",
        image: null,
        featured: true,
    },
    {
        name: "Zanzibar Airport to Paje Beach",
        slug: "zanzibar-airport-to-paje",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Paje Beach",
        distance: "42 km",
        duration: "55min",
        price: 40,
        priceReturn: 70,
        vehicleType: "Sedan / Minivan",
        image: null,
        featured: false,
    },
    {
        name: "Zanzibar Airport to Kendwa Beach",
        slug: "zanzibar-airport-to-kendwa",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Kendwa Beach",
        distance: "55 km",
        duration: "1h 10min",
        price: 45,
        priceReturn: 80,
        vehicleType: "Sedan / Minivan",
        image: null,
        featured: false,
    },
    {
        name: "Dar Airport to Masaki",
        slug: "dar-airport-to-masaki",
        pickupLocation: "Julius Nyerere Airport (DAR)",
        dropoffLocation: "Masaki, Dar es Salaam",
        distance: "15 km",
        duration: "30min",
        price: 35,
        priceReturn: 60,
        vehicleType: "Sedan / SUV",
        image: null,
        featured: true,
    },
    {
        name: "Dar Airport to City Center",
        slug: "dar-airport-to-city-center",
        pickupLocation: "Julius Nyerere Airport (DAR)",
        dropoffLocation: "Dar es Salaam City Center",
        distance: "12 km",
        duration: "25min",
        price: 30,
        priceReturn: 50,
        vehicleType: "Sedan",
        image: null,
        featured: false,
    },
];

const FALLBACK_VEHICLES: RentalVehicle[] = [
    {
        name: "Toyota Vitz",
        slug: "toyota-vitz",
        category: "sedan",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 40,
        pricePerWeek: 250,
        features: ["AC", "Bluetooth", "USB Charging", "Fuel Efficient"],
        image: null,
        featured: true,
        available: true,
    },
    {
        name: "Toyota RAV4",
        slug: "toyota-rav4",
        category: "suv",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 70,
        pricePerWeek: 450,
        features: ["AC", "4WD", "GPS", "Bluetooth", "Roof Rack"],
        image: null,
        featured: true,
        available: true,
    },
    {
        name: "Toyota Land Cruiser",
        slug: "toyota-land-cruiser",
        category: "4x4",
        transmission: "automatic",
        seats: 7,
        pricePerDay: 120,
        pricePerWeek: 750,
        features: ["AC", "4WD", "GPS", "Safari Ready", "Roof Hatch", "Cooler Box"],
        image: null,
        featured: true,
        available: true,
    },
    {
        name: "Toyota Hiace",
        slug: "toyota-hiace",
        category: "van",
        transmission: "manual",
        seats: 14,
        pricePerDay: 90,
        pricePerWeek: 550,
        features: ["AC", "Large Luggage Space", "USB Charging"],
        image: null,
        featured: false,
        available: true,
    },
    {
        name: "Suzuki Alto",
        slug: "suzuki-alto",
        category: "sedan",
        transmission: "manual",
        seats: 4,
        pricePerDay: 30,
        pricePerWeek: 180,
        features: ["AC", "Fuel Efficient", "Compact"],
        image: null,
        featured: false,
        available: true,
    },
    {
        name: "Toyota Fortuner",
        slug: "toyota-fortuner",
        category: "luxury",
        transmission: "automatic",
        seats: 7,
        pricePerDay: 100,
        pricePerWeek: 650,
        features: ["AC", "4WD", "Leather Seats", "GPS", "Bluetooth", "Premium Audio"],
        image: null,
        featured: false,
        available: true,
    },
];

type TabType = "transfers" | "vehicles";

export default function RentalsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("transfers");
    const [transfers, setTransfers] = useState<TransferRoute[]>(FALLBACK_TRANSFERS);
    const [vehicles, setVehicles] = useState<RentalVehicle[]>(FALLBACK_VEHICLES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/rentals");
                if (res.ok) {
                    const json = await res.json();
                    if (json.transfers?.length > 0) setTransfers(json.transfers);
                    if (json.vehicles?.length > 0) setVehicles(json.vehicles);
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
        "4x4": "🛻",
        van: "🚐",
        luxury: "✨",
    };

    return (
        <div>
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
            {activeTab === "transfers" && (
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
                                Popular Transfer Routes
                            </h2>
                            <p style={{ color: "var(--color-slate)", fontSize: "1.05rem", maxWidth: "600px" }}>
                                Safe, reliable, and affordable transfers across Tanzania and Zanzibar.
                                All prices include meet & greet and luggage assistance.
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem 0" }}>
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
                                                backgroundSize: "cover",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
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
                                                <div className={styles.transferLocation}>
                                                    <span className={styles.transferLocationLabel}>Pickup</span>
                                                    <span className={styles.transferLocationName}>{route.pickupLocation}</span>
                                                </div>
                                                <div className={styles.transferArrow}>
                                                    <div className={styles.transferArrowLine} />
                                                </div>
                                                <div className={styles.transferLocation}>
                                                    <span className={styles.transferLocationLabel}>Drop-off</span>
                                                    <span className={styles.transferLocationName}>{route.dropoffLocation}</span>
                                                </div>
                                            </div>
                                            <div className={styles.transferMeta}>
                                                <span className={styles.transferMetaItem}>
                                                    <span className={styles.transferMetaIcon}>⏱️</span>
                                                    {route.duration}
                                                </span>
                                                <span className={styles.transferMetaItem}>
                                                    <span className={styles.transferMetaIcon}>📏</span>
                                                    {route.distance}
                                                </span>
                                                <span className={styles.transferMetaItem}>
                                                    <span className={styles.transferMetaIcon}>🚗</span>
                                                    {route.vehicleType}
                                                </span>
                                            </div>
                                            <div className={styles.transferFooter}>
                                                <div className={styles.transferPrice}>
                                                    <span className={styles.transferPriceLabel}>One way</span>
                                                    <span className={styles.transferPriceAmount}>${route.price}</span>
                                                </div>
                                                <span className={styles.transferCta}>Book Now</span>
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
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
                                Self-Drive Cars
                            </h2>
                            <p style={{ color: "var(--color-slate)", fontSize: "1.05rem", maxWidth: "600px" }}>
                                Explore Tanzania at your own pace. Choose from our fleet of well-maintained vehicles,
                                from compact city cars to safari-ready 4x4s.
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem 0" }}>
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
                                                backgroundColor: vehicle.image ? undefined : "#e8e4db",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {!vehicle.image && (
                                                <span style={{ fontSize: "4rem" }}>
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
                                                    <span className={styles.vehicleSpecIcon}>👤</span>
                                                    {vehicle.seats} seats
                                                </span>
                                                <span className={styles.vehicleSpec}>
                                                    <span className={styles.vehicleSpecIcon}>⚙️</span>
                                                    {vehicle.transmission}
                                                </span>
                                            </div>
                                            <div className={styles.vehicleFeatures}>
                                                {vehicle.features.slice(0, 4).map((f) => (
                                                    <span key={f} className={styles.vehicleFeature}>
                                                        {f}
                                                    </span>
                                                ))}
                                                {vehicle.features.length > 4 && (
                                                    <span className={styles.vehicleFeature}>
                                                        +{vehicle.features.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.vehicleFooter}>
                                                <div className={styles.vehiclePrice}>
                                                    <span className={styles.vehiclePriceLabel}>From</span>
                                                    <span className={styles.vehiclePriceAmount}>
                                                        ${vehicle.pricePerDay}
                                                        <span className={styles.vehiclePriceSuffix}>/day</span>
                                                    </span>
                                                </div>
                                                <span className={styles.transferCta}>View Details</span>
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
            <section className={styles.ctaSection}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Why Travel With Us?</h2>
                    <p className={styles.ctaText}>
                        All vehicles are regularly maintained and insured. Our drivers are professional,
                        English-speaking, and know every corner of Tanzania.
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1.5rem",
                        maxWidth: "800px",
                        margin: "0 auto 3rem",
                    }}>
                        {[
                            { icon: "🛡️", title: "Fully Insured", desc: "All vehicles covered" },
                            { icon: "⏰", title: "24/7 Support", desc: "Help whenever you need" },
                            { icon: "💰", title: "Best Prices", desc: "No hidden fees" },
                            { icon: "✅", title: "Free Cancellation", desc: "Up to 24h before" },
                        ].map((item) => (
                            <div key={item.title} style={{
                                padding: "1.5rem",
                                borderRadius: "var(--radius-md)",
                                background: "rgba(255,255,255,0.06)",
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                                <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{item.title}</div>
                                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className="btn btn-primary">Contact Us</Link>
                        <a
                            href="https://wa.me/255123456789?text=Hi!%20I%27m%20interested%20in%20your%20car%20rental%20services"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
