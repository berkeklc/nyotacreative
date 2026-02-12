import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../rentals.module.css";
import RentalBookingForm from "../../../../components/RentalBookingForm";
import { getTransferBySlug } from "../../../../lib/rentals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TransferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const transfer = await getTransferBySlug(slug);

    if (!transfer) {
        notFound();
    }

    return (
        <div className={styles.detailPage}>
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
                            <span className={styles.detailBreadcrumbCurrent}>{transfer.name}</span>
                        </div>
                        <h1 className={styles.detailTitle}>{transfer.name}</h1>
                        <p className={styles.detailSubtitle}>
                            {transfer.pickupLocation} → {transfer.dropoffLocation}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.detailBody}>
                <div className={styles.detailMain}>
                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>Route Details</h2>
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

                    <div className={styles.detailSection}>
                        <h2 className={styles.detailSectionTitle}>About This Transfer</h2>
                        <div className={styles.detailDescription}>
                            <p>{transfer.description}</p>
                        </div>
                    </div>

                </div>

                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.bookingCardHeader}>
                            <div className={styles.bookingCardLabel}>One-way transfer</div>
                            <div className={styles.bookingCardPrice}>
                                ${transfer.price}
                                <span className={styles.bookingCardUnit}>per vehicle</span>
                            </div>
                            {transfer.priceReturn > 0 && (
                                <div className={styles.bookingCardReturn}>
                                    Return: <span className={styles.bookingCardReturnValue}>${transfer.priceReturn}</span>
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
