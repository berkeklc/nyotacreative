import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Tours & Experiences | Nyota Travel",
    description: "Book the best tours in Tanzania and Zanzibar. Spice tours, safaris, beach excursions and more.",
};

const tours = [
    { name: "Zanzibar Spice Tour", slug: "zanzibar-spice-tour", location: "Zanzibar", duration: "Half Day", price: 45, rating: 4.9, reviews: 128, badge: "Best Seller" },
    { name: "Stone Town Walking Tour", slug: "stone-town-walking-tour", location: "Zanzibar", duration: "3 Hours", price: 35, rating: 4.8, reviews: 256 },
    { name: "Safari Blue Day Trip", slug: "safari-blue", location: "Zanzibar", duration: "Full Day", price: 95, rating: 4.9, reviews: 312, badge: "Top Rated" },
    { name: "Prison Island & Dolphins", slug: "prison-island-dolphins", location: "Zanzibar", duration: "Full Day", price: 85, rating: 4.7, reviews: 89, badge: "Popular" },
    { name: "Serengeti 3-Day Safari", slug: "serengeti-3-day-safari", location: "Serengeti", duration: "3 Days", price: 850, rating: 4.9, reviews: 178 },
    { name: "Kilimanjaro Day Hike", slug: "kilimanjaro-day-hike", location: "Kilimanjaro", duration: "Full Day", price: 120, rating: 4.8, reviews: 64 },
    { name: "Ngorongoro Crater Safari", slug: "ngorongoro-crater-safari", location: "Ngorongoro", duration: "Full Day", price: 280, rating: 4.9, reviews: 145 },
    { name: "Dar es Salaam City Tour", slug: "dar-city-tour", location: "Dar es Salaam", duration: "Half Day", price: 55, rating: 4.6, reviews: 42 },
];

export default function ToursPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>✦</span>
                        NYOTA TRAVEL
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/tanzania">Tanzania</Link>
                        <Link href="/tanzania/zanzibar">Zanzibar</Link>
                        <Link href="/tours">Tours</Link>
                        <Link href="/guides">Guides</Link>
                    </div>
                    <div className={styles.navActions}>
                        <Link href="/tours" className="btn btn-primary">Book a Tour</Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "100px" }}>
                <section className="section" style={{ background: "var(--color-sand)" }}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Explore</span>
                                <h1>Tours & Experiences</h1>
                                <p style={{ marginTop: "0.5rem", color: "var(--color-slate)" }}>
                                    Book unforgettable experiences across Tanzania and Zanzibar
                                </p>
                            </div>
                        </div>

                        <div className={styles.toursGrid} style={{ marginTop: "2rem" }}>
                            {tours.map((tour) => (
                                <article key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div className={styles.tourImage}>
                                        {tour.badge && <span className="badge badge-featured">{tour.badge}</span>}
                                    </div>
                                    <div className={styles.tourContent}>
                                        <div className={styles.tourMeta}>
                                            <span>⏱️ {tour.duration}</span>
                                            <span>⭐ {tour.rating} ({tour.reviews})</span>
                                        </div>
                                        <h3>{tour.name}</h3>
                                        <p style={{ fontSize: "0.8rem", color: "var(--color-ocean)", margin: "0.25rem 0" }}>
                                            📍 {tour.location}
                                        </p>
                                        <div className={styles.tourFooter}>
                                            <span className={styles.tourPrice}>
                                                From <strong>${tour.price}</strong>
                                            </span>
                                            <Link href={`/tours/${tour.slug}`} className="btn btn-accent">Book Now</Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerBottom}>
                        <p>© {new Date().getFullYear()} Nyota Travel. A Nyota Creative project.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
