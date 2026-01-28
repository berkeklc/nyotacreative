import Link from "next/link";
import styles from "../page.module.css";
import { fetchAPI, getStrapiMedia } from "../../lib/strapi";

export const metadata = {
    title: "Tours & Experiences | Nyota Travel",
    description: "Book unforgettable safaris, beach getaways, and cultural tours in Tanzania and Zanzibar.",
};

export default async function ToursPage() {
    const toursRes = await fetchAPI("/tours", {
        populate: ["heroImage", "city"],
        pagination: { limit: 50 }
    });

    const cmsTours = toursRes?.data || [];

    const displayTours = cmsTours.map((t: any) => ({
        title: t.name || "",
        slug: t.slug || "",
        duration: t.duration || "",
        price: t.priceAdult || 0,
        image: getStrapiMedia(t.heroImage?.url),
        city: t.city?.name || "",
        difficulty: t.difficulty || "",
        featured: t.featured || false
    }));

    // Categorize tours by budget
    const categorizeByBudget = (tours: any[]) => {
        return {
            budget: tours.filter(t => t.price > 0 && t.price < 500),
            midrange: tours.filter(t => t.price >= 500 && t.price < 2000),
            luxury: tours.filter(t => t.price >= 2000),
            featured: tours.filter(t => t.featured)
        };
    };

    const budgetCategories = categorizeByBudget(displayTours);
    const allTours = displayTours;

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section style={{
                minHeight: "75vh",
                background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #1a1a1a 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 2rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(192, 90, 62, 0.15) 0%, transparent 50%)',
                    zIndex: 1
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', textAlign: 'center' }}>
                    <span className={styles.sectionLabel} style={{
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '2rem',
                        display: 'block'
                    }}>Your Journey Awaits</span>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        color: '#ffffff',
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        Discover Tanzania
                        <br />
                        <span style={{ color: 'var(--color-terracotta)' }}>Your Way</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: 1.7,
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        fontWeight: 400
                    }}>
                        From budget-friendly adventures to luxury safaris, every journey tells a story. 
                        Whether you're seeking authentic local experiences or world-class comfort, 
                        Tanzania welcomes travelers of all budgets with open arms.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section style={{ background: 'var(--color-white)', padding: '6rem 0' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span className={styles.sectionLabel} style={{ marginBottom: '1.5rem', display: 'block' }}>The Story</span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: 900,
                            color: 'var(--color-charcoal)',
                            lineHeight: 1.2,
                            marginBottom: '2rem'
                        }}>
                            Every Budget, Every Dream
                        </h2>
                        <p style={{
                            fontSize: '1.2rem',
                            lineHeight: '1.8',
                            color: 'var(--color-slate)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Tanzania isn't just a destination—it's a collection of stories waiting to be lived. 
                            From the backpacker exploring Stone Town's alleys to the luxury traveler watching 
                            the Great Migration from a private camp, every journey is unique, every experience priceless.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2.5rem',
                        marginTop: '4rem'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #fff8f4 0%, #ffe8dd 100%)',
                            padding: '3rem 2rem',
                            borderRadius: '1.5rem',
                            border: '2px solid rgba(192, 90, 62, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎒</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                                Budget Adventures
                            </h3>
                            <p style={{ color: 'var(--color-slate)', lineHeight: 1.7, fontSize: '1rem' }}>
                                Authentic experiences that don't break the bank. Local guides, shared accommodations, 
                                and unforgettable memories starting from $50.
                            </p>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            padding: '3rem 2rem',
                            borderRadius: '1.5rem',
                            border: '2px solid rgba(59, 130, 246, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌟</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                                Mid-Range Excellence
                            </h3>
                            <p style={{ color: 'var(--color-slate)', lineHeight: 1.7, fontSize: '1rem' }}>
                                Perfect balance of comfort and adventure. Quality lodges, expert guides, 
                                and curated experiences from $500.
                            </p>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            padding: '3rem 2rem',
                            borderRadius: '1.5rem',
                            border: '2px solid rgba(245, 158, 11, 0.2)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✨</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                                Luxury Experiences
                            </h3>
                            <p style={{ color: 'var(--color-slate)', lineHeight: 1.7, fontSize: '1rem' }}>
                                World-class service, exclusive access, and unforgettable moments. 
                                Premium safaris and beach retreats from $2000.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tours */}
            {budgetCategories.featured.length > 0 && (
                <section style={{ background: 'var(--color-sand)', padding: '6rem 0' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <span className={styles.sectionLabel} style={{ marginBottom: '1.5rem', display: 'block' }}>Editor's Choice</span>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                fontWeight: 900,
                                color: 'var(--color-charcoal)',
                                lineHeight: 1.2
                            }}>
                                Signature Experiences
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-slate)',
                                marginTop: '1rem',
                                maxWidth: '600px',
                                margin: '1rem auto 0'
                            }}>
                                Our most recommended tours, handpicked by local experts
                            </p>
                        </div>
                        <div className={styles.toursGrid} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {budgetCategories.featured.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`} style={{
                                    position: 'relative',
                                    border: '2px solid var(--color-terracotta)'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'var(--color-terracotta)',
                                        color: 'white',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        zIndex: 2,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>Featured</div>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                            backgroundColor: tour.image ? undefined : 'var(--color-sand-dark)',
                                            height: '240px'
                                        }}
                                    />
                                    <div className={styles.tourContent} style={{ padding: '2rem' }}>
                                        <div className={styles.tourMeta} style={{ marginBottom: '1rem' }}>
                                            {tour.duration && <span style={{ fontSize: '0.8rem' }}>⏱️ {tour.duration}</span>}
                                            {tour.city && <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.8rem' }}>{tour.city}</span>}
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>From </span>
                                                    <strong style={{ fontSize: '1.5rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>${tour.price}</strong>
                                                </div>
                                            )}
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Budget Tours */}
            {budgetCategories.budget.length > 0 && (
                <section style={{ background: 'var(--color-white)', padding: '6rem 0' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>🎒</span>
                                <span className={styles.sectionLabel}>Budget-Friendly</span>
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 900,
                                color: 'var(--color-charcoal)',
                                lineHeight: 1.2,
                                marginBottom: '1rem'
                            }}>
                                Authentic Adventures
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-slate)',
                                maxWidth: '700px',
                                lineHeight: 1.7
                            }}>
                                Experience the real Tanzania without breaking the bank. These tours offer incredible value, 
                                connecting you with local culture, stunning landscapes, and unforgettable moments.
                            </p>
                        </div>
                        <div className={styles.toursGrid} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {budgetCategories.budget.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                            backgroundColor: tour.image ? undefined : 'var(--color-sand-dark)',
                                            height: '220px'
                                        }}
                                    />
                                    <div className={styles.tourContent} style={{ padding: '2rem' }}>
                                        <div className={styles.tourMeta} style={{ marginBottom: '0.75rem' }}>
                                            {tour.duration && <span style={{ fontSize: '0.8rem' }}>⏱️ {tour.duration}</span>}
                                            {tour.city && <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.8rem' }}>{tour.city}</span>}
                                        </div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>From </span>
                                                    <strong style={{ fontSize: '1.4rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>${tour.price}</strong>
                                                </div>
                                            )}
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Mid-Range Tours */}
            {budgetCategories.midrange.length > 0 && (
                <section style={{ background: 'var(--color-sand)', padding: '6rem 0' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>🌟</span>
                                <span className={styles.sectionLabel}>Mid-Range</span>
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 900,
                                color: 'var(--color-charcoal)',
                                lineHeight: 1.2,
                                marginBottom: '1rem'
                            }}>
                                Perfect Balance
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-slate)',
                                maxWidth: '700px',
                                lineHeight: 1.7
                            }}>
                                Comfort meets adventure. Quality accommodations, expert guides, and carefully curated 
                                experiences that offer the best of both worlds.
                            </p>
                        </div>
                        <div className={styles.toursGrid} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {budgetCategories.midrange.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                            backgroundColor: tour.image ? undefined : 'var(--color-sand-dark)',
                                            height: '220px'
                                        }}
                                    />
                                    <div className={styles.tourContent} style={{ padding: '2rem' }}>
                                        <div className={styles.tourMeta} style={{ marginBottom: '0.75rem' }}>
                                            {tour.duration && <span style={{ fontSize: '0.8rem' }}>⏱️ {tour.duration}</span>}
                                            {tour.city && <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.8rem' }}>{tour.city}</span>}
                                        </div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>From </span>
                                                    <strong style={{ fontSize: '1.4rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>${tour.price}</strong>
                                                </div>
                                            )}
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Luxury Tours */}
            {budgetCategories.luxury.length > 0 && (
                <section style={{ background: 'var(--color-white)', padding: '6rem 0' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>✨</span>
                                <span className={styles.sectionLabel}>Luxury</span>
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 900,
                                color: 'var(--color-charcoal)',
                                lineHeight: 1.2,
                                marginBottom: '1rem'
                            }}>
                                Unforgettable Excellence
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-slate)',
                                maxWidth: '700px',
                                lineHeight: 1.7
                            }}>
                                World-class service, exclusive access, and moments that define a lifetime. 
                                Premium safaris, private guides, and luxury accommodations await.
                            </p>
                        </div>
                        <div className={styles.toursGrid} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {budgetCategories.luxury.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                            backgroundColor: tour.image ? undefined : 'var(--color-sand-dark)',
                                            height: '220px'
                                        }}
                                    />
                                    <div className={styles.tourContent} style={{ padding: '2rem' }}>
                                        <div className={styles.tourMeta} style={{ marginBottom: '0.75rem' }}>
                                            {tour.duration && <span style={{ fontSize: '0.8rem' }}>⏱️ {tour.duration}</span>}
                                            {tour.city && <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.8rem' }}>{tour.city}</span>}
                                        </div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>From </span>
                                                    <strong style={{ fontSize: '1.4rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>${tour.price}</strong>
                                                </div>
                                            )}
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Tours Fallback */}
            {allTours.length > 0 && budgetCategories.featured.length === 0 && budgetCategories.budget.length === 0 && budgetCategories.midrange.length === 0 && budgetCategories.luxury.length === 0 && (
                <section style={{ background: 'var(--color-sand)', padding: '6rem 0' }}>
                    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <span className={styles.sectionLabel} style={{ marginBottom: '1.5rem', display: 'block' }}>Discover</span>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 900,
                                color: 'var(--color-charcoal)',
                                lineHeight: 1.2
                            }}>
                                All Adventures
                            </h2>
                        </div>
                        <div className={styles.toursGrid} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {allTours.map((tour: any) => (
                                <Link href={`/tours/${tour.slug}`} key={tour.slug} className={`${styles.tourCard} card`}>
                                    <div
                                        className={styles.tourImage}
                                        style={{
                                            backgroundImage: tour.image ? `url(${tour.image})` : undefined,
                                            backgroundColor: tour.image ? undefined : 'var(--color-sand-dark)',
                                            height: '220px'
                                        }}
                                    />
                                    <div className={styles.tourContent} style={{ padding: '2rem' }}>
                                        <div className={styles.tourMeta} style={{ marginBottom: '0.75rem' }}>
                                            {tour.duration && <span style={{ fontSize: '0.8rem' }}>⏱️ {tour.duration}</span>}
                                            {tour.city && <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.8rem' }}>{tour.city}</span>}
                                        </div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>{tour.title}</h3>
                                        <div className={styles.tourFooter}>
                                            {tour.price > 0 && (
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>From </span>
                                                    <strong style={{ fontSize: '1.4rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>${tour.price}</strong>
                                                </div>
                                            )}
                                            <span className="btn btn-accent btn-sm">Explore</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty State */}
            {allTours.length === 0 && (
                <section style={{ background: 'var(--color-sand)', padding: '8rem 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🗺️</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                            Exploring Tanzania
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-slate)', maxWidth: '600px', margin: '0 auto' }}>
                            We're currently updating our tour offerings. Check back soon for amazing adventures!
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}
