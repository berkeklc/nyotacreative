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
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop",
        slug: "serengeti-migration"
    },
    {
        id: 2,
        title: "Zanzibar Spice Tour",
        duration: "Half Day",
        price: "$45",
        image: "https://images.unsplash.com/photo-1663660507303-346747d79b0c?q=80&w=2600&auto=format&fit=crop",
        slug: "zanzibar-spice-tour-half-day"
    },
    {
        id: 3,
        title: "Kilimanjaro Machame Route",
        duration: "7 Days",
        price: "$1,890",
        image: "https://images.unsplash.com/photo-1650669344464-9be1a7620bc2?q=80&w=2664&auto=format&fit=crop",
        slug: "kilimanjaro-machame"
    }
];

export default function ToursPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Experience Tanzania</h1>
                    <p className={styles.subtitle}>Curated expert-led tours and adventures.</p>
                </div>
            </header>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {tours.map((tour) => (
                            <Link href={`/tours/${tour.slug}`} key={tour.id} className={styles.card}>
                                <div style={{ position: 'relative', height: '250px' }}>
                                    <Image
                                        src={tour.image}
                                        alt={tour.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.meta}>
                                        <span>{tour.duration}</span>
                                        <span>•</span>
                                        <span>From {tour.price}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{tour.title}</h3>
                                    <span className={styles.link}>View Itinerary →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
