"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../rentals.module.css";
import RentalBookingForm from "../../../../components/RentalBookingForm";

interface RentalVehicle {
    name: string;
    slug: string;
    description: string;
    category: string;
    transmission: string;
    seats: number;
    pricePerDay: number;
    pricePerWeek: number;
    features: string[];
    image: string | null;
    available: boolean;
}

const FALLBACK_VEHICLES: Record<string, RentalVehicle> = {
    "toyota-vitz": {
        name: "Toyota Vitz",
        slug: "toyota-vitz",
        description: "The Toyota Vitz is a perfect city companion — compact, fuel-efficient, and easy to park. Ideal for short trips around Stone Town, Dar es Salaam, or getting to the beach without the fuss. Comes with air conditioning and Bluetooth connectivity.",
        category: "sedan",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 40,
        pricePerWeek: 250,
        features: ["AC", "Bluetooth", "USB Charging", "Fuel Efficient"],
        image: null,
        available: true,
    },
    "toyota-rav4": {
        name: "Toyota RAV4",
        slug: "toyota-rav4",
        description: "The Toyota RAV4 offers the perfect balance between comfort and capability. With 4WD and generous cargo space, it handles both city roads and unpaved tracks with ease. Great for exploring more rural areas while still enjoying a comfortable ride.",
        category: "suv",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 70,
        pricePerWeek: 450,
        features: ["AC", "4WD", "GPS", "Bluetooth", "Roof Rack"],
        image: null,
        available: true,
    },
    "toyota-land-cruiser": {
        name: "Toyota Land Cruiser",
        slug: "toyota-land-cruiser",
        description: "The legendary Toyota Land Cruiser — the king of African safari vehicles. Built for the toughest terrain, this 4x4 comes equipped with everything you need for a self-drive safari adventure, including a pop-up roof hatch for wildlife viewing.",
        category: "4x4",
        transmission: "automatic",
        seats: 7,
        pricePerDay: 120,
        pricePerWeek: 750,
        features: ["AC", "4WD", "GPS", "Safari Ready", "Roof Hatch", "Cooler Box"],
        image: null,
        available: true,
    },
    "toyota-hiace": {
        name: "Toyota Hiace",
        slug: "toyota-hiace",
        description: "Need to move a group? The Toyota Hiace is your answer. With seating for up to 14 passengers and ample luggage space, it's perfect for team travel, airport transfers for large groups, or family road trips across Tanzania.",
        category: "van",
        transmission: "manual",
        seats: 14,
        pricePerDay: 90,
        pricePerWeek: 550,
        features: ["AC", "Large Luggage Space", "USB Charging"],
        image: null,
        available: true,
    },
    "suzuki-alto": {
        name: "Suzuki Alto",
        slug: "suzuki-alto",
        description: "Budget-friendly and extremely fuel-efficient. The Suzuki Alto is perfect for solo travelers or couples looking to save on transportation costs while maintaining independence.",
        category: "sedan",
        transmission: "manual",
        seats: 4,
        pricePerDay: 30,
        pricePerWeek: 180,
        features: ["AC", "Fuel Efficient", "Compact"],
        image: null,
        available: true,
    },
    "toyota-fortuner": {
        name: "Toyota Fortuner",
        slug: "toyota-fortuner",
        description: "Premium comfort meets rugged capability. The Toyota Fortuner offers leather seating, advanced audio, and 4WD capability in a stylish package. Perfect for those who want to explore in luxury.",
        category: "luxury",
        transmission: "automatic",
        seats: 7,
        pricePerDay: 100,
        pricePerWeek: 650,
        features: ["AC", "4WD", "Leather Seats", "GPS", "Bluetooth", "Premium Audio"],
        image: null,
        available: true,
    },
};

const categoryIcons: Record<string, string> = {
    sedan: "🚗",
    suv: "🚙",
    "4x4": "🛻",
    van: "🚐",
    luxury: "✨",
};

export default function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>("");
    const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchVehicle() {
            try {
                const res = await fetch(`/api/rentals`);
                if (res.ok) {
                    const json = await res.json();
                    const found = json.vehicles?.find((v: any) => v.slug === slug);
                    if (found) {
                        setVehicle({ ...found, description: found.description || "" });
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch vehicle:", err);
            }

            // Fallback
            const fallback = FALLBACK_VEHICLES[slug];
            if (fallback) {
                setVehicle(fallback);
            }
            setLoading(false);
        }

        fetchVehicle();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div style={{ minHeight: "100vh", paddingTop: "120px", textAlign: "center" }}>
                <div className="container">
                    <h1>Vehicle Not Found</h1>
                    <p style={{ marginTop: "1rem", color: "var(--color-slate)" }}>
                        The vehicle you're looking for is not available.
                    </p>
                    <Link href="/rentals" className="btn btn-primary" style={{ marginTop: "2rem" }}>
                        ← Back to Rentals
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Hero */}
            <div
                className={styles.detailHero}
                style={{
                    backgroundImage: vehicle.image ? `url(${vehicle.image})` : undefined,
                    backgroundColor: vehicle.image ? undefined : "#1a2d3d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {!vehicle.image && (
                    <div style={{
                        position: "absolute",
                        zIndex: 1,
                        fontSize: "8rem",
                        opacity: 0.15,
                    }}>
                        {categoryIcons[vehicle.category] || "🚗"}
                    </div>
                )}
                <div className="container">
                    <div className={styles.detailHeroContent}>
                        <div className={styles.detailBreadcrumb}>
                            <Link href="/rentals">Rentals</Link>
                            <span>›</span>
                            <Link href="/rentals">Self-Drive</Link>
                            <span>›</span>
                            <span style={{ color: "white" }}>{vehicle.name}</span>
                        </div>
                        <h1 className={styles.detailTitle}>{vehicle.name}</h1>
                        <p className={styles.detailSubtitle}>
                            {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)} • {vehicle.seats} Seats • {vehicle.transmission}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className={styles.detailBody}>
                <div className={styles.detailMain}>
                    {/* Specs */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>📋 Vehicle Specifications</h2>
                        <div className={styles.specsGrid}>
                            <div className={styles.specCard}>
                                <div className={styles.specCardIcon}>👤</div>
                                <div className={styles.specCardLabel}>Seats</div>
                                <div className={styles.specCardValue}>{vehicle.seats}</div>
                            </div>
                            <div className={styles.specCard}>
                                <div className={styles.specCardIcon}>⚙️</div>
                                <div className={styles.specCardLabel}>Transmission</div>
                                <div className={styles.specCardValue}>{vehicle.transmission}</div>
                            </div>
                            <div className={styles.specCard}>
                                <div className={styles.specCardIcon}>{categoryIcons[vehicle.category] || "🚗"}</div>
                                <div className={styles.specCardLabel}>Category</div>
                                <div className={styles.specCardValue}>{vehicle.category}</div>
                            </div>
                            <div className={styles.specCard}>
                                <div className={styles.specCardIcon}>✅</div>
                                <div className={styles.specCardLabel}>Status</div>
                                <div className={styles.specCardValue}>
                                    {vehicle.available ? "Available" : "Unavailable"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>ℹ️ About This Vehicle</h2>
                        <div className={styles.detailDescription}>
                            <p>{vehicle.description}</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>⭐ Features & Equipment</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            {vehicle.features.map((feature) => (
                                <div key={feature} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                                    <span style={{ color: "var(--color-sage)" }}>✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rental Terms */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>📜 Rental Terms</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            {[
                                "Valid driving license required",
                                "Minimum age: 23 years",
                                "Security deposit required",
                                "Fuel policy: full-to-full",
                                "Unlimited mileage",
                                "Basic insurance included",
                                "24/7 roadside assistance",
                                "Free delivery in city",
                            ].map((term) => (
                                <div key={term} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-slate)" }}>
                                    <span>•</span>
                                    <span>{term}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar — Booking */}
                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.bookingCardHeader}>
                            <div className={styles.bookingCardLabel}>Daily rate</div>
                            <div className={styles.bookingCardPrice}>
                                ${vehicle.pricePerDay}
                                <span className={styles.bookingCardPriceSuffix}>/day</span>
                            </div>
                            {vehicle.pricePerWeek > 0 && (
                                <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
                                    Weekly: ${vehicle.pricePerWeek}/week
                                </div>
                            )}
                        </div>
                        <div className={styles.bookingCardBody}>
                            <RentalBookingForm
                                type="car-rental"
                                itemTitle={vehicle.name}
                                itemSlug={vehicle.slug}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
