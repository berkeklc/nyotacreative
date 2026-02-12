import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../rentals.module.css";
import RentalBookingForm from "../../../../components/RentalBookingForm";
import { getVehicleBySlug } from "../../../../lib/rentals";

const categoryIcons: Record<string, string> = {
    sedan: "🚗",
    suv: "🚙",
    offroad: "🛻",
    van: "🚐",
    luxury: "✨",
};

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const vehicle = await getVehicleBySlug(slug);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className={styles.detailPage}>
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
                    <div
                        style={{
                            position: "absolute",
                            zIndex: 1,
                            fontSize: "8rem",
                            opacity: 0.15,
                        }}
                    >
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
                            <span className={styles.detailBreadcrumbCurrent}>{vehicle.name}</span>
                        </div>
                        <h1 className={styles.detailTitle}>{vehicle.name}</h1>
                        <p className={styles.detailSubtitle}>
                            {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)} • {vehicle.seats} Seats • {vehicle.transmission}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.detailBody}>
                <div className={styles.detailMain}>
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>Vehicle Specifications</h2>
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
                                <div className={`${styles.specCardValue} ${vehicle.available ? styles.specCardValueSuccess : styles.specCardValueMuted}`}>
                                    {vehicle.available ? "Available" : "Unavailable"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>About This Vehicle</h2>
                        <div className={styles.detailDescription}>
                            <p>{vehicle.description}</p>
                        </div>
                    </div>

                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>Features & Equipment</h2>
                        <div className={styles.includedGrid}>
                            {vehicle.features.map((feature) => (
                                <div key={feature} className={styles.includedItem}>
                                    <span className={styles.includedCheck}>✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>Rental Terms</h2>
                        <div className={styles.termsGrid}>
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
                                <div key={term} className={styles.termItem}>
                                    <span className={styles.termBullet}>•</span>
                                    <span>{term}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.bookingCardHeader}>
                            <div className={styles.bookingCardLabel}>Daily rate</div>
                            <div className={styles.bookingCardPrice}>
                                ${vehicle.pricePerDay}
                                <span className={styles.bookingCardUnit}>/day</span>
                            </div>
                            {vehicle.pricePerWeek > 0 && (
                                <div className={styles.bookingCardReturn}>
                                    Weekly: <span className={styles.bookingCardReturnValue}>${vehicle.pricePerWeek}/week</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.bookingCardBody}>
                            <RentalBookingForm type="car-rental" itemTitle={vehicle.name} itemSlug={vehicle.slug} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
