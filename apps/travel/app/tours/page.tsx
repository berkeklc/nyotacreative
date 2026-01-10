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
        <main className={styles.main}>
            {/* Reusing hero styles from global module */}
            <header className={styles.hero} style={{ minHeight: "50vh" }}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1>Experience Tanzania</h1>
                    <p className={styles.heroSubtitle}>Curated expert-led tours and adventures.</p>
                </div>
            </header>

            <section className={styles.section} style={{ padding: "4rem 0" }}>
                <div className="container">
                    <div className={styles.toursGrid}>
                        {tours.map((tour) => (
                            <Link href={`/tours/${tour.slug}`} key={tour.id} className={styles.card} style={{ borderRadius: "1rem", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                                <div style={{ position: 'relative', height: '250px' }}>
                                    <Image
                                        src={tour.image}
                                        alt={tour.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                                        <span>{tour.duration}</span>
                                        <span style={{ fontWeight: "bold", color: "var(--color-ocean)" }}>{tour.price}</span>
                                    </div>
                                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{tour.title}</h3>
                                    <span className="btn btn-secondary" style={{ marginTop: "auto", textAlign: "center" }}>View Itinerary →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
