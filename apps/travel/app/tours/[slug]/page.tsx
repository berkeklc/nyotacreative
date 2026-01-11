"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import styles from "./tour.module.css";

// Mock data
const tours = [
    {
        slug: "serengeti-migration",
        title: "Serengeti Migration Safari",
        description: "Witness the Great Migration in the endless plains of Africa. A once-in-a-lifetime safari experience tracking millions of wildebeest and zebras across the Serengeti ecosystem. Our expert guides ensure you're in the right place at the right time to witness nature's greatest spectacle.",
        price: 2450,
        duration: "5 Days",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop",
        rating: 5.0,
        reviews: 42
    },
    {
        slug: "kilimanjaro-machame",
        title: "Kilimanjaro Machame Route",
        description: "The 'Whiskey' route offers the best acclimatization profile and scenic views. Conquer the Roof of Africa through high-altitude moorland and arctic deserts.",
        price: 1890,
        duration: "7 Days",
        image: "https://images.unsplash.com/photo-1589412227181-06798e285888?q=80&w=2670&auto=format&fit=crop",
        rating: 4.9,
        reviews: 38
    },
    {
        slug: "zanzibar-spice-tour-half-day",
        title: "Zanzibar Spice Tour",
        description: "Discover the smells and tastes of Zanzibar's famous spices. Visit a local farm and learn about cloves, nutmeg, cinnamon, and more. A sensory journey through the history of the Spice Island.",
        price: 45,
        duration: "Half Day",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2670&auto=format&fit=crop",
        rating: 4.9,
        reviews: 128
    }
];

export default function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const tour = tours.find(t => t.slug === slug);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        travelers: 1,
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    if (!tour) {
        return (
            <div className={styles.tourPage}>
                <main style={{ padding: "10rem 2rem", textAlign: "center" }}>
                    <h1>Tour not found.</h1>
                    <Link href="/tours" className="btn btn-secondary">Back to Tours</Link>
                </main>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, tourSlug: tour.slug }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", date: "", travelers: 1, message: "" });
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
            console.error("Booking error:", err);
        }
    };

    return (
        <div className={styles.tourPage}>
            <main>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className={styles.heroImage}
                        priority
                        sizes="100vw"
                    />

                    <div className={styles.heroContent}>
                        <nav className={styles.breadcrumb}>
                            <Link href="/tours">All Tours</Link>
                            <span>/</span>
                            <span>{tour.title}</span>
                        </nav>
                        <h1>{tour.title}</h1>
                        <div className={styles.tourMeta}>
                            <div className={styles.metaItem}>
                                <span aria-hidden="true">⏱️</span> {tour.duration}
                            </div>
                            <div className={styles.metaItem}>
                                <span aria-hidden="true">⭐</span> {tour.rating} ({tour.reviews} reviews)
                            </div>
                            <div className={styles.metaItem}>
                                <span className="badge badge-featured">Premium Choice</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className={styles.contentGrid}>
                        <div className={styles.overview}>
                            <h2>Experience Overview</h2>
                            <p>{tour.description}</p>

                            <h3 style={{ marginTop: "3rem", marginBottom: "1.5rem" }}>What's Included</h3>
                            <div className={styles.includesGrid}>
                                <div className={styles.includeCard}>
                                    <span className={styles.includeIcon} aria-hidden="true">🚙</span>
                                    <div className={styles.includeText}>
                                        <strong>Transport</strong>
                                        <span>Luxury 4x4 Land Cruiser</span>
                                    </div>
                                </div>
                                <div className={styles.includeCard}>
                                    <span className={styles.includeIcon} aria-hidden="true">🍱</span>
                                    <div className={styles.includeText}>
                                        <strong>Meals</strong>
                                        <span>Full Board & Drinks</span>
                                    </div>
                                </div>
                                <div className={styles.includeCard}>
                                    <span className={styles.includeIcon} aria-hidden="true">🦁</span>
                                    <div className={styles.includeText}>
                                        <strong>Guide</strong>
                                        <span>Expert Naturalist</span>
                                    </div>
                                </div>
                                <div className={styles.includeCard}>
                                    <span className={styles.includeIcon}>🎟️</span>
                                    <div className={styles.includeText}>
                                        <strong>Permits</strong>
                                        <span>All National Park Fees</span>
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ marginTop: "4rem", marginBottom: "2rem" }}>Safari Itinerary</h3>
                            <div className={styles.itinerary}>
                                <div className={styles.itineraryItem}>
                                    <div className={styles.dayBadge}>Day 1</div>
                                    <div className={styles.itineraryContent}>
                                        <h4>Arrival in Arusha</h4>
                                        <p>Touch down at Kilimanjaro International Airport. VIP transfer to Arusha Coffee Lodge for relaxation and briefing.</p>
                                    </div>
                                </div>
                                <div className={styles.itineraryItem}>
                                    <div className={styles.dayBadge}>Day 2</div>
                                    <div className={styles.itineraryContent}>
                                        <h4>Journey to Central Serengeti</h4>
                                        <p>Fly into the Seronera airstrip. First game drive spotting lions, leopards, and vast elephant herds.</p>
                                    </div>
                                </div>
                                <div className={styles.itineraryItem}>
                                    <div className={styles.dayBadge}>Day 3-4</div>
                                    <div className={styles.itineraryContent}>
                                        <h4>The Great Migration</h4>
                                        <p>Full days dedicated to tracking the wildebeest migration. Picnic lunch in the bush surrounded by nature's greatest spectacle.</p>
                                    </div>
                                </div>
                                <div className={styles.itineraryItem}>
                                    <div className={styles.dayBadge}>Day 5</div>
                                    <div className={styles.itineraryContent}>
                                        <h4>Farewell Africa</h4>
                                        <p>Morning game drive followed by a flight back to Arusha for your international connection home.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.bookingCard}>
                                <div className={styles.priceHeader}>
                                    <span className={styles.priceLabel}>Starting from</span>
                                    <div className={styles.priceValue}>${tour.price}</div>
                                </div>

                                {status === "success" ? (
                                    <div className={styles.successState}>
                                        <div className={styles.successIcon}>✨</div>
                                        <h3>Inquiry Sent!</h3>
                                        <p>Our travel experts will contact you within 24 hours to finalize your itinerary.</p>
                                        <button onClick={() => setStatus("idle")} className="btn btn-secondary" style={{ marginTop: "2rem", width: "100%" }}>Send Another Request</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                placeholder="e.g. John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="e.g. john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="date">Date</label>
                                                <input
                                                    id="date"
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="travelers">Travelers</label>
                                                <input
                                                    id="travelers"
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={formData.travelers}
                                                    onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                            disabled={status === "loading"}
                                        >
                                            {status === "loading" ? "Processing..." : "Request Experience"}
                                        </button>
                                        {status === "error" && (
                                            <p style={{ color: "red", fontSize: "0.875rem", marginTop: "1rem", textAlign: "center" }}>
                                                Something went wrong. Please try again.
                                            </p>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
