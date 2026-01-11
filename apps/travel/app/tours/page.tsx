import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";

export const metadata = {
    title: "Tours & Experiences | Nyota Travel",
    description: "Book unforgettable safaris, beach getaways, and cultural tours in Tanzania and Zanzibar.",
};

const tours = [
    {
        id: 1,
        title: "Serengeti Migration Safari",
        duration: "5 Days",
        price: "$2,450",
        // Valid Unsplash ID for Safari/Serengeti
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop",
        slug: "serengeti-migration"
    },
    {
        id: 2,
        title: "Zanzibar Spice Tour",
        duration: "Half Day",
        price: "$45",
        // Valid Unsplash ID for Spices/Market
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2670&auto=format&fit=crop",
        slug: "zanzibar-spice-tour-half-day"
    },
    {
        id: 3,
        title: "Kilimanjaro Machame Route",
        duration: "7 Days",
        price: "$1,890",
        image: "https://images.unsplash.com/photo-1589412227181-06798e285888?q=80&w=2670&auto=format&fit=crop",
        slug: "kilimanjaro-machame"
    }
];

export default function ToursPage() {
    return (
        <div className={styles.page}>
            <header className={styles.hero} style={{ minHeight: "50vh" }}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1>Experience Tanzania</h1>
                    <p className={styles.heroSubtitle}>Curated expert-led tours and adventures.</p>
                </div>
            </header>

            <section className="section" style={{ background: "var(--color-sand)" }}>
                <div className="container">
                    <div className={styles.toursGrid}>
                        {tours.map((tour) => (
                            <Link href={`/tours/${tour.slug}`} key={tour.id} className={`${styles.tourCard} card`}>
                                <div className={styles.tourImage}>
                                    <Image
                                        src={tour.image}
                                        alt={tour.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.tourContent}>
                                    <div className={styles.tourMeta}>
                                        <span>{tour.duration}</span>
                                        <span className={styles.tourPrice}>{tour.price}</span>
                                    </div>
                                    <h3>{tour.title}</h3>
                                    <span className="btn btn-secondary full-width" style={{ marginTop: "auto", textAlign: "center" }}>
                                        Explore Experience →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
