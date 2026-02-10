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
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
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
                                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem", color: "var(--color-text-muted)" }}>
                                    <span style={{ color: "var(--color-success)" }}>✓</span>
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
                            <div className={styles.bookingCardLabel} style={{ color: "var(--color-text-muted)" }}>One-way transfer</div>
                            <div className={styles.bookingCardPrice} style={{ color: "var(--color-accent)", fontSize: "2.5rem", fontWeight: "700", fontFamily: "var(--font-serif)" }}>
                                ${transfer.price}
                                <span style={{ fontSize: "1rem", color: "var(--color-text-muted)", fontWeight: "400", marginLeft: "0.5rem" }}>per vehicle</span>
                            </div>
                            {transfer.priceReturn > 0 && (
                                <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                                    Return: <span style={{ color: "white" }}>${transfer.priceReturn}</span>
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
