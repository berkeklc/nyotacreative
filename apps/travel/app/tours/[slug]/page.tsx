import Link from "next/link";
import Image from "next/image";
import styles from "./tour.module.css";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";
import { notFound } from "next/navigation";
import BookingForm from "../../../components/BookingForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetchAPI("/tours", { filters: { slug: { $eq: slug } } });
    const tour = res.data?.[0];

    return {
        title: tour ? `${tour.name} | Nyota Travel` : "Tour Detail",
        description: tour?.description?.slice(0, 160) || "Explore Tanzania's finest experiences.",
    };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetchAPI("/tours", {
        filters: { slug: { $eq: slug } },
        populate: {
            heroImage: "*",
            gallery: "*",
            city: "*",
            itinerary: "*",
            seoMetadata: "*"
        }
    });

    const tour = res.data?.[0];
    if (!tour) return notFound();

    const heroImage = getStrapiMedia(tour.heroImage?.url) || "/hero-safari.jpg";

    return (
        <div className={styles.tourPage}>
            <main>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <Image
                        src={heroImage}
                        alt={tour.name}
                        fill
                        className={styles.heroImage}
                        priority
                        sizes="100vw"
                    />

                    <div className={styles.heroContent}>
                        <nav className={styles.breadcrumb}>
                            <Link href="/tours">All Tours</Link>
                            <span>/</span>
                            <span>{tour.name}</span>
                        </nav>
                        <h1>{tour.name}</h1>
                        <div className={styles.tourMeta}>
                            <div className={styles.metaItem}>
                                <span aria-hidden="true">⏱️</span> {tour.duration}
                            </div>
                            <div className={styles.metaItem}>
                                <span aria-hidden="true">⭐</span> 4.9 (Recent Guests)
                            </div>
                            <div className={styles.metaItem}>
                                <span className="badge badge-featured" style={{ background: 'var(--color-terracotta)', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem' }}>
                                    {tour.difficulty || "Moderate"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className={styles.contentGrid}>
                        <div className={styles.overview}>
                            <h2>Experience Overview</h2>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{tour.description}</p>

                            {tour.highlights && (
                                <>
                                    <h3 style={{ marginTop: "3rem", marginBottom: "1.5rem" }}>Trip Highlights</h3>
                                    <div className={styles.includesGrid}>
                                        {(tour.highlights as any[]).map((highlight, idx) => (
                                            <div key={idx} className={styles.includeCard}>
                                                <span className={styles.includeIcon} aria-hidden="true">✨</span>
                                                <div className={styles.includeText}>
                                                    <strong>Key Feature</strong>
                                                    <span>{highlight}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {tour.itinerary && tour.itinerary.length > 0 && (
                                <>
                                    <h3 style={{ marginTop: "4rem", marginBottom: "2rem" }}>Journey Itinerary</h3>
                                    <div className={styles.itinerary}>
                                        {tour.itinerary.map((item: any, idx: number) => (
                                            <div key={idx} className={styles.itineraryItem}>
                                                <div className={styles.dayBadge}>Day {item.dayNumber || (idx + 1)}</div>
                                                <div className={styles.itineraryContent}>
                                                    <h4>{item.title}</h4>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.bookingCard}>
                                <div className={styles.priceHeader}>
                                    <span className={styles.priceLabel}>Starting from</span>
                                    <div className={styles.priceValue}>${tour.priceAdult}</div>
                                </div>
                                <BookingForm tourTitle={tour.name} tourSlug={tour.slug} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
