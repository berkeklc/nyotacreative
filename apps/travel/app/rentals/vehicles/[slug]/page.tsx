import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../rentals.module.css";
import RentalBookingForm from "../../../../components/RentalBookingForm";
import { getVehicleBySlug } from "../../../../lib/rentals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categoryLabels: Record<string, string> = {
    sedan: "Sedan",
    suv: "SUV",
    offroad: "Offroad",
    van: "Van",
    luxury: "Luxury",
};

function toTitleCase(value: string) {
    if (!value) return "";
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

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
                    <div className={styles.detailHeroPlaceholder} aria-hidden="true">
                        <span className={styles.detailHeroPlaceholderLabel}>Self-Drive Fleet</span>
                        <strong>{categoryLabels[vehicle.category] || toTitleCase(vehicle.category)}</strong>
                        <small>Image coming soon</small>
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
                            {toTitleCase(vehicle.category)} • {vehicle.seats} Seats • {toTitleCase(vehicle.transmission)}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.detailBody}>
                <div className={styles.detailMain}>
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>Vehicle Specifications</h2>
                        <dl className={styles.specsList}>
                            <div className={styles.specItemRow}>
                                <dt className={styles.specCardLabel}>Seats</dt>
                                <dd className={styles.specCardValue}>{vehicle.seats}</dd>
                            </div>
                            <div className={styles.specItemRow}>
                                <dt className={styles.specCardLabel}>Transmission</dt>
                                <dd className={styles.specCardValue}>{toTitleCase(vehicle.transmission)}</dd>
                            </div>
                            <div className={styles.specItemRow}>
                                <dt className={styles.specCardLabel}>Category</dt>
                                <dd className={styles.specCardValue}>{categoryLabels[vehicle.category] || toTitleCase(vehicle.category)}</dd>
                            </div>
                            <div className={styles.specItemRow}>
                                <dt className={styles.specCardLabel}>Status</dt>
                                <dd className={`${styles.specCardValue} ${vehicle.available ? styles.specCardValueSuccess : styles.specCardValueMuted}`}>
                                    {vehicle.available ? "Available" : "Unavailable"}
                                </dd>
                            </div>
                        </dl>
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
