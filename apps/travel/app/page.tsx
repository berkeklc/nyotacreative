import Link from "next/link";
import styles from "./page.module.css";
import { fetchAPI, getStrapiMedia } from "../lib/strapi";
import SearchBar from "../components/SearchBar";

// Fallback data while CMS is empty
const defaultDestinations = [
  { name: "Zanzibar", slug: "zanzibar", tagline: "Spice Island Paradise", image: "/destinations/zanzibar.jpg" },
  { name: "Serengeti", slug: "serengeti", tagline: "The Endless Plains", image: "/destinations/serengeti.jpg" },
  { name: "Kilimanjaro", slug: "kilimanjaro", tagline: "Roof of Africa", image: "/destinations/kilimanjaro.jpg" },
];

const defaultTours = [
  { title: "Zanzibar Spice Tour", slug: "zanzibar-spice-tour", duration: "Half Day", price: 45, rating: 4.9, reviews: 128, image: null },
  { title: "Stone Town Walking Tour", slug: "stone-town-walking-tour", duration: "3 Hours", price: 35, rating: 4.8, reviews: 256, image: null },
];

const quickLinks = [
  { label: "Beaches", href: "/guides?category=Beaches", icon: "🏖️" },
  { label: "Safari", href: "/guides?category=Safari", icon: "🐆" },
  { label: "Food", href: "/guides?category=Food%20%26%20Drink", icon: "🥘" },
  { label: "Hotels", href: "/hotels", icon: "🏨" },
];

export default async function Home() {
  const [articlesRes, destinationsRes, toursRes] = await Promise.all([
    fetchAPI("/articles", { populate: "*", pagination: { limit: 3 }, sort: ["publishedAt:desc"] }),
    fetchAPI("/destinations", { populate: "*" }),
    fetchAPI("/tours", { populate: "*", pagination: { limit: 4 } })
  ]);

  const cmsArticles = articlesRes?.data || [];
  const cmsDestinations = destinationsRes?.data || [];
  const cmsTours = toursRes?.data || [];

  const destinations = cmsDestinations.length > 0
    ? cmsDestinations.map((d: any) => ({
      name: d.name,
      slug: d.slug,
      tagline: d.description || "The ultimate tropical paradise",
      image: getStrapiMedia(d.heroImage?.url)
    }))
    : defaultDestinations;

  const tours = cmsTours.length > 0
    ? cmsTours.map((t: any) => ({
      title: t.title,
      slug: t.slug,
      duration: t.duration || "Full Day",
      price: t.price || 99,
      rating: 4.9,
      reviews: 12,
      image: getStrapiMedia(t.image?.url)
    }))
    : defaultTours;

  const articles = cmsArticles.map((a: any) => ({
    title: a.title,
    slug: a.slug,
    category: a.category || "Travel Tip",
    author: "Nyota Editor",
    date: new Date(a.publishedAt).toLocaleDateString(),
    image: getStrapiMedia(a.image?.url)
  }));

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageBg} style={{ backgroundImage: "url('/hero-safari.jpg')" }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>The Pulse of East Africa</span>
          <h1 className={styles.heroTitle}>
            Bespoke <span className={styles.heroHighlight}>Safaris</span> & Coastal Escapes
          </h1>
          <p className={styles.heroSubtitle}>
            Expertly curated journeys through Tanzania's wild heart and Zanzibar's turquoise shores.
          </p>
          <SearchBar />
          <div className={styles.quickLinks}>
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className={styles.quickLink}>
                <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
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
          <div className={styles.destinationsGrid}>
            {destinations.map((dest: any) => (
              <Link key={dest.slug} href={`/tanzania/${dest.slug}`} className={styles.destinationCard}>
                <div className={styles.destinationImage} style={{ backgroundImage: dest.image ? `url(${dest.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                <div className={styles.destinationInfo}>
                  <h3>{dest.name}</h3>
                  <p>{dest.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
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
          <div className={styles.toursGrid}>
            {tours.map((tour: any) => (
              <article key={tour.slug} className={`${styles.tourCard} card`}>
                <div className={styles.tourImage} style={{ backgroundImage: tour.image ? `url(${tour.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                <div className={styles.tourContent}>
                  <div className={styles.tourMeta}>
                    <span>⏱️ {tour.duration}</span>
                    <span>⭐ {tour.rating}</span>
                  </div>
                  <h3>{tour.title}</h3>
                  <div className={styles.tourFooter}>
                    <span>From <strong>${tour.price}</strong></span>
                    <Link href={`/tours/${tour.slug}`} className="btn btn-accent">Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
          <div className={styles.guidesGrid}>
            {articles.map((guide: any) => (
              <article key={guide.slug} className={`${styles.guideCard} card`}>
                <div className={styles.guideImage} style={{ backgroundImage: guide.image ? `url(${guide.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                <div className={styles.guideContent}>
                  <span className={styles.guideCategory}>{guide.category}</span>
                  <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                  <div className={styles.guideMeta}>
                    <span>By {guide.author} • {guide.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2>Get Travel Tips & Deals</h2>
            <p>Join 10,000+ travelers who get our weekly insider tips on Tanzania and Zanzibar.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Your email address" />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
