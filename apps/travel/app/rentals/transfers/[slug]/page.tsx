"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../rentals.module.css";
import RentalBookingForm from "../../../../components/RentalBookingForm";

interface TransferRoute {
    name: string;
    slug: string;
    description: string;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    duration: string;
    price: number;
    priceReturn: number;
    vehicleType: string;
    image: string | null;
}

// Fallback data
const FALLBACK_TRANSFERS: Record<string, TransferRoute> = {
    "zanzibar-airport-to-nungwi": {
        name: "Zanzibar Airport to Nungwi Beach",
        slug: "zanzibar-airport-to-nungwi",
        description: "Enjoy a comfortable and scenic drive from Zanzibar Airport to the stunning Nungwi Beach on the northern tip of the island. Our professional drivers will ensure you arrive relaxed and ready to enjoy paradise. The route passes through local villages and spice plantations, giving you a first taste of Zanzibar's culture.",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Nungwi Beach",
        distance: "58 km",
        duration: "1h 15min",
        price: 45,
        priceReturn: 80,
        vehicleType: "Sedan / Minivan",
        image: null,
    },
    "zanzibar-airport-to-stone-town": {
        name: "Zanzibar Airport to Stone Town",
        slug: "zanzibar-airport-to-stone-town",
        description: "Quick and convenient transfer from Zanzibar Airport to the historic Stone Town, a UNESCO World Heritage Site. Our drivers know the narrow streets well and will drop you as close to your hotel as possible.",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Stone Town",
        distance: "8 km",
        duration: "20min",
        price: 20,
        priceReturn: 35,
        vehicleType: "Sedan",
        image: null,
    },
    "zanzibar-airport-to-paje": {
        name: "Zanzibar Airport to Paje Beach",
        slug: "zanzibar-airport-to-paje",
        description: "Relax as we drive you from Zanzibar Airport to the beautiful Paje Beach on the east coast. Known for its kitesurfing and powdery white sand, Paje is a favorite among adventurous travelers.",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Paje Beach",
        distance: "42 km",
        duration: "55min",
        price: 40,
        priceReturn: 70,
        vehicleType: "Sedan / Minivan",
        image: null,
    },
    "zanzibar-airport-to-kendwa": {
        name: "Zanzibar Airport to Kendwa Beach",
        slug: "zanzibar-airport-to-kendwa",
        description: "Smooth transfer from the airport to the popular Kendwa Beach resort area. Kendwa is known for its stunning sunsets and vibrant beach parties.",
        pickupLocation: "Zanzibar Airport (ZNZ)",
        dropoffLocation: "Kendwa Beach",
        distance: "55 km",
        duration: "1h 10min",
        price: 45,
        priceReturn: 80,
        vehicleType: "Sedan / Minivan",
        image: null,
    },
    "dar-airport-to-masaki": {
        name: "Dar Airport to Masaki",
        slug: "dar-airport-to-masaki",
        description: "Professional transfer from Julius Nyerere International Airport to the upscale Masaki area in Dar es Salaam. Masaki is home to many international restaurants, embassies, and premium hotels.",
        pickupLocation: "Julius Nyerere Airport (DAR)",
        dropoffLocation: "Masaki, Dar es Salaam",
        distance: "15 km",
        duration: "30min",
        price: 35,
        priceReturn: 60,
        vehicleType: "Sedan / SUV",
        image: null,
    },
    "dar-airport-to-city-center": {
        name: "Dar Airport to City Center",
        slug: "dar-airport-to-city-center",
        description: "Reliable transfer from Julius Nyerere International Airport to the Dar es Salaam city center. Avoid the hassle of negotiating with taxi drivers and arrive in comfort.",
        pickupLocation: "Julius Nyerere Airport (DAR)",
        dropoffLocation: "Dar es Salaam City Center",
        distance: "12 km",
        duration: "25min",
        price: 30,
        priceReturn: 50,
        vehicleType: "Sedan",
        image: null,
    },
};

export default function TransferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>("");
    const [transfer, setTransfer] = useState<TransferRoute | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchTransfer() {
            try {
                const res = await fetch(`/api/rentals`);
                if (res.ok) {
                    const json = await res.json();
                    const found = json.transfers?.find((t: any) => t.slug === slug);
                    if (found) {
                        setTransfer(found);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch transfer:", err);
            }

            // Fallback
            const fallback = FALLBACK_TRANSFERS[slug];
            if (fallback) {
                setTransfer(fallback);
            }
            setLoading(false);
        }

        fetchTransfer();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading transfer details...</p>
            </div>
        );
    }

    if (!transfer) {
        return (
            <div style={{ minHeight: "100vh", paddingTop: "120px", textAlign: "center" }}>
                <div className="container">
                    <h1>Transfer Route Not Found</h1>
                    <p style={{ marginTop: "1rem", color: "var(--color-slate)" }}>
                        The transfer route you're looking for doesn't exist.
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
                    backgroundImage: transfer.image ? `url(${transfer.image})` : undefined,
                    backgroundColor: transfer.image ? undefined : "#0f1923",
                }}
            >
                <div className="container">
                    <div className={styles.detailHeroContent}>
                        <div className={styles.detailBreadcrumb}>
                            <Link href="/rentals">Rentals</Link>
                            <span>›</span>
                            <Link href="/rentals">Transfers</Link>
                            <span>›</span>
                            <span style={{ color: "white" }}>{transfer.name}</span>
                        </div>
                        <h1 className={styles.detailTitle}>{transfer.name}</h1>
                        <p className={styles.detailSubtitle}>
                            {transfer.pickupLocation} → {transfer.dropoffLocation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className={styles.detailBody}>
                <div className={styles.detailMain}>
                    {/* Route Info */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>📍 Route Details</h2>
                        <div className={styles.routeInfoGrid}>
                            <div className={styles.routeInfoCard}>
                                <span className={styles.routeInfoIcon}>🛫</span>
                                <div>
                                    <div className={styles.routeInfoLabel}>Pickup</div>
                                    <div className={styles.routeInfoValue}>{transfer.pickupLocation}</div>
                                </div>
                            </div>
                            <div className={styles.routeInfoCard}>
                                <span className={styles.routeInfoIcon}>📍</span>
                                <div>
                                    <div className={styles.routeInfoLabel}>Drop-off</div>
                                    <div className={styles.routeInfoValue}>{transfer.dropoffLocation}</div>
                                </div>
                            </div>
                            <div className={styles.routeInfoCard}>
                                <span className={styles.routeInfoIcon}>⏱️</span>
                                <div>
                                    <div className={styles.routeInfoLabel}>Duration</div>
                                    <div className={styles.routeInfoValue}>{transfer.duration}</div>
                                </div>
                            </div>
                            <div className={styles.routeInfoCard}>
                                <span className={styles.routeInfoIcon}>📏</span>
                                <div>
                                    <div className={styles.routeInfoLabel}>Distance</div>
                                    <div className={styles.routeInfoValue}>{transfer.distance}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>ℹ️ About This Transfer</h2>
                        <div className={styles.detailDescription}>
                            <p>{transfer.description}</p>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>✅ What's Included</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            {[
                                "Professional driver",
                                "Meet & greet at arrival",
                                "Luggage assistance",
                                "Air-conditioned vehicle",
                                "Door-to-door service",
                                "Free waiting time (30min)",
                                "Child seat (on request)",
                                "24/7 customer support",
                            ].map((item) => (
                                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                                    <span style={{ color: "var(--color-sage)" }}>✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar — Booking */}
                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.bookingCardHeader}>
                            <div className={styles.bookingCardLabel}>One-way transfer</div>
                            <div className={styles.bookingCardPrice}>
                                ${transfer.price}
                                <span className={styles.bookingCardPriceSuffix}> per vehicle</span>
                            </div>
                            {transfer.priceReturn > 0 && (
                                <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
                                    Return: ${transfer.priceReturn}
                                </div>
                            )}
                        </div>
                        <div className={styles.bookingCardBody}>
                            <RentalBookingForm
                                type="transfer"
                                itemTitle={transfer.name}
                                itemSlug={transfer.slug}
                                pickupLocation={transfer.pickupLocation}
                                dropoffLocation={transfer.dropoffLocation}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
