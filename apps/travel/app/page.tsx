import Link from "next/link";
import styles from "./page.module.css";
import { fetchAPI, getStrapiMedia } from "../lib/strapi";
import SearchBar from "../components/SearchBar";

export default async function Home() {
  const [articlesRes, destinationsRes, toursRes, tanzaniaRes] = await Promise.all([
    fetchAPI("/articles", { populate: ["heroImage", "author"], pagination: { limit: 3 }, sort: ["publishedAt:desc"] }),
    fetchAPI("/destinations", { populate: ["heroImage"], pagination: { limit: 3 } }),
    fetchAPI("/tours", { populate: ["heroImage", "city"], pagination: { limit: 4 } }),
    fetchAPI("/destinations", { filters: { slug: "tanzania" }, populate: ["heroImage"] })
  ]);

  const cmsArticles = articlesRes?.data || [];
  const cmsDestinations = destinationsRes?.data || [];
  const cmsTours = toursRes?.data || [];
  const tanzania = tanzaniaRes?.data?.[0];
  const heroImage = getStrapiMedia(tanzania?.heroImage?.url);

  const destinations = cmsDestinations.map((d: any) => {
    // Strip HTML tags from richtext description for tagline
    const descriptionText = d.description
      ? String(d.description).replace(/<[^>]*>/g, '').trim()
      : '';
    const tagline = descriptionText ? (descriptionText.slice(0, 100) + (descriptionText.length > 100 ? "..." : "")) : "";

    return {
      name: d.name || "",
      slug: d.slug || "",
      tagline: tagline,
      image: getStrapiMedia(d.heroImage?.url)
    };
  });

  const tours = cmsTours.map((t: any) => ({
    title: t.name || "",
    slug: t.slug || "",
    duration: t.duration || "",
    price: t.priceAdult || 0,
    image: getStrapiMedia(t.heroImage?.url)
  }));

  const articles = cmsArticles.map((a: any) => ({
    title: a.title || "",
    slug: a.slug || "",
    category: a.category?.replace('-', ' ') || "",
    author: a.author?.name || "",
    date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "",
    image: getStrapiMedia(a.heroImage?.url)
  }));

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageBg} style={{ backgroundImage: `url(${heroImage || '/hero-safari.jpg'})`, backgroundPosition: 'center bottom' }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          {tanzania?.name && (
            <span className={styles.heroBadge}>The Pulse of East Africa</span>
          )}
          <h1 className={styles.heroTitle}>
            Bespoke <span className={styles.heroHighlight}>Safaris</span> & Coastal Escapes
          </h1>
          <p className={styles.heroSubtitle}>
            Expertly curated journeys through Tanzania's wild heart and Zanzibar's turquoise shores.
          </p>
          <SearchBar />
          <div className={styles.quickLinks}>
            <Link href="/guides?category=Beaches" className={styles.quickLink}>
              <span style={{ fontSize: '1.2rem' }}>🏖️</span>
              Beaches
            </Link>
            <Link href="/guides?category=Safari" className={styles.quickLink}>
              <span style={{ fontSize: '1.2rem' }}>🐆</span>
              Safari
            </Link>
            <Link href="/guides?category=Food%20%26%20Drink" className={styles.quickLink}>
              <span style={{ fontSize: '1.2rem' }}>🥘</span>
              Food
            </Link>
            <Link href="/hotels" className={styles.quickLink}>
              <span style={{ fontSize: '1.2rem' }}>🏨</span>
              Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className={`${styles.destinations} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Explore</span>
              <h2>Popular Destinations</h2>
            </div>
            <Link href="/tanzania" className="btn btn-secondary">View All →</Link>
          </div>
          {destinations.length > 0 ? (
            <div className={styles.destinationsGrid}>
              {destinations.map((dest: any) => (
                <Link key={dest.slug} href={`/tanzania/${dest.slug}`} className={styles.destinationCard}>
                  <div className={styles.destinationImage} style={{ backgroundImage: dest.image ? `url(${dest.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                  <div className={styles.destinationInfo}>
                    <h3>{dest.name}</h3>
                    {dest.tagline && <p>{dest.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No destinations available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Tours */}
      <section className={`${styles.tours} section`} style={{ background: 'var(--color-sand)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Recommendations</span>
              <h2>Signature Experiences</h2>
            </div>
            <Link href="/tours" className="btn btn-secondary">All Tours →</Link>
          </div>
          {tours.length > 0 ? (
            <div className={styles.toursGrid}>
              {tours.map((tour: any) => (
                <article key={tour.slug} className={`${styles.tourCard} card`}>
                  <div className={styles.tourImage} style={{ backgroundImage: tour.image ? `url(${tour.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                  <div className={styles.tourContent}>
                    <div className={styles.tourMeta}>
                      {tour.duration && <span>⏱️ {tour.duration}</span>}
                    </div>
                    <h3>{tour.title}</h3>
                    <div className={styles.tourFooter}>
                      {tour.price > 0 && <span>From <strong>${tour.price}</strong></span>}
                      <Link href={`/tours/${tour.slug}`} className="btn btn-accent">Details</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No tours available at this time.</p>
            </div>
          )}
        </div>
      </section>


      {/* Latest Articles */}
      <section className={`${styles.guides} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Resources</span>
              <h2>Local Insights</h2>
            </div>
            <Link href="/guides" className="btn btn-secondary">All Guides →</Link>
          </div>
          {articles.length > 0 ? (
            <div className={styles.guidesGrid}>
              {articles.map((guide: any) => (
                <article key={guide.slug} className={`${styles.guideCard} card`}>
                  <div className={styles.guideImage} style={{ backgroundImage: guide.image ? `url(${guide.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                  <div className={styles.guideContent}>
                    {guide.category && <span className={styles.guideCategory}>{guide.category}</span>}
                    <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                    <div className={styles.guideMeta}>
                      {(guide.author || guide.date) && <span>{guide.author ? `By ${guide.author}` : ''}{guide.author && guide.date ? ' • ' : ''}{guide.date}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No articles available at this time.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
