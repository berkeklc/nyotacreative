import Link from "next/link";
import styles from "./page.module.css";
import { fetchAPI } from "../lib/strapi";
import SearchBar from "../components/SearchBar";

// Fallback data while CMS is empty
const defaultDestinations = [
  { name: "Zanzibar", slug: "zanzibar", tagline: "Spice Island Paradise", image: "/destinations/zanzibar.jpg" },
  { name: "Dar es Salaam", slug: "dar-es-salaam", tagline: "The Harbour of Peace", image: "/destinations/dar.jpg" },
  { name: "Serengeti", slug: "serengeti", tagline: "The Endless Plains", image: "/destinations/serengeti.jpg" },
  { name: "Kilimanjaro", slug: "kilimanjaro", tagline: "Roof of Africa", image: "/destinations/kilimanjaro.jpg" },
];

const featuredTours = [
  {
    title: "Zanzibar Spice Tour",
    slug: "zanzibar-spice-tour",
    duration: "Half Day",
    price: 45,
    rating: 4.9,
    reviews: 128,
    image: "/tours/spice-tour.jpg",
    badge: null,
  },
  {
    title: "Stone Town Walking Tour",
    slug: "stone-town-walking-tour",
    duration: "3 Hours",
    price: 35,
    rating: 4.8,
    reviews: 256,
    image: "/tours/stone-town.jpg",
    badge: null,
  },
  {
    title: "Prison Island & Dolphins",
    slug: "prison-island-dolphins",
    duration: "Full Day",
    price: 85,
    rating: 4.7,
    reviews: 89,
    image: "/tours/prison-island.jpg",
    badge: null,
  },
  {
    title: "Safari Blue Day Trip",
    slug: "safari-blue",
    duration: "Full Day",
    price: 95,
    rating: 4.9,
    reviews: 312,
    image: "/tours/safari-blue.jpg",
    badge: null,
  },
];

const latestGuides = [
  {
    title: "Best Beaches in Zanzibar: Complete 2026 Guide",
    slug: "best-beaches-zanzibar-2026",
    excerpt: "From the stunning white sands of Nungwi to the kite-surfing paradise of Paje...",
    category: "Beaches",
    author: "Sarah Mwangi",
    date: "Jan 8, 2026",
    readTime: "12 min",
  },
  {
    title: "Where to Eat in Stone Town: Local's Guide",
    slug: "where-to-eat-stone-town",
    excerpt: "Discover the best restaurants, street food, and hidden gems in UNESCO's Stone Town...",
    category: "Food & Drink",
    author: "Ahmed Hassan",
    date: "Jan 5, 2026",
    readTime: "8 min",
  },
  {
    title: "Tanzania Safety Tips: Everything You Need to Know",
    slug: "tanzania-safety-tips",
    excerpt: "Practical advice for a safe and enjoyable trip to Tanzania and Zanzibar...",
    category: "Travel Tips",
    author: "James Kilonzo",
    date: "Jan 3, 2026",
    readTime: "10 min",
  },
];

const quickLinks = [
  {
    label: "Beaches",
    href: "/tanzania/zanzibar/beaches",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" /><path d="M12 20a10 10 0 0 1-10-10C2 5.58 5.58 2 10 2s8 3.58 8 8c0 4.42-3.58 10-8 10z" /><path d="M12 2v20" /><path d="m4.93 10.93 14.14 0" />
      </svg>
    )
  },
  {
    label: "Safari",
    href: "/guides/tanzania-safari",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h18" /><path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" /><path d="M6 11v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="16.5" cy="18.5" r="1.5" />
      </svg>
    )
  },
  {
    label: "Food",
    href: "/guides/category/food",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    )
  },
  {
    label: "Hotels",
    href: "/hotels",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" /><path d="M9 21V11a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10" />
      </svg>
    )
  },
  {
    label: "Getting There",
    href: "/guides/getting-to-tanzania",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    )
  },
  {
    label: "Tips",
    href: "/guides/category/tips",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />
      </svg>
    )
  }
];

export default async function Home() {
  // Test Strapi Connection by fetching articles
  const articlesRes = await fetchAPI("/articles", {
    populate: "*",
    pagination: { limit: 3 }
  });

  const destinationsRes = await fetchAPI("/destinations", {
    populate: "*"
  });

  const cmsDestinations = destinationsRes?.data?.length ? destinationsRes.data : [];
  const cmsArticles = articlesRes?.data?.length ? articlesRes.data : [];

  // Log to server console to verify connection
  console.log("Strapi Status:", {
    articlesFound: cmsArticles.length,
    destinationsFound: cmsDestinations.length
  });

  // Strapi 5 Flat Response Format Update
  const destinations = cmsDestinations.length > 0
    ? cmsDestinations.map((d: any) => ({
      name: d.name,
      slug: d.slug,
      tagline: d.description || "The ultimate tropical paradise",
      // Handling image: Strapi 5 response might return image object directly or inside 'url' depending on populate
      image: d.heroImage?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app"}${d.heroImage.url}`
        : "/destinations/zanzibar.jpg"
    }))
    : defaultDestinations;

  return (
    <div className={styles.page}>
      {/* Navigation */}

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageBg} style={{ backgroundImage: "url('/hero-safari.jpg')" }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            The Pulse of East Africa
          </span>
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
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className={`${styles.destinations} section animate-fade-in-up`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Explore</span>
              <h2>Popular Destinations</h2>
            </div>
            <Link href="/tanzania" className="btn btn-secondary">
              View All →
            </Link>
          </div>
          <div className={styles.destinationsGrid}>
            {destinations.map((dest: any) => (
              <Link
                key={dest.slug}
                href={`/tanzania/${dest.slug}`}
                className={styles.destinationCard}
              >
                <div className={styles.destinationImage} />
                <div className={styles.destinationInfo}>
                  <h3>{dest.name}</h3>
                  <p>{dest.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className={`${styles.tours} section animate-fade-in-up`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Recommendations</span>
              <h2>Recommended Experiences</h2>
            </div>
            <Link href="/tours" className="btn btn-secondary">
              All Tours →
            </Link>
          </div>
          <div className={styles.toursGrid}>
            {featuredTours.map((tour) => (
              <article key={tour.slug} className={`${styles.tourCard} card`}>
                <div className={styles.tourImage}>
                  {tour.badge && (
                    <span className="badge badge-featured">{tour.badge}</span>
                  )}
                </div>
                <div className={styles.tourContent}>
                  <div className={styles.tourMeta}>
                    <span className={styles.tourDuration}>⏱️ {tour.duration}</span>
                    <span className={styles.tourRating}>
                      ⭐ {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <h3>{tour.title}</h3>
                  <div className={styles.tourFooter}>
                    <span className={styles.tourPrice}>
                      From <strong>${tour.price}</strong>
                    </span>
                    <Link href={`/tours/${tour.slug}`} className="btn btn-accent">
                      Explore Experience
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`${styles.whyUs} section animate-fade-in-up`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Trust</span>
              <h2>Why Travel With Us?</h2>
            </div>
          </div>
          <div className={styles.whyUsGrid}>
            <div className={styles.whyUsItem}>
              <span className={styles.whyUsIcon}>🐆</span>
              <h3>Expert Local Guides</h3>
              <p>Born and raised in Tanzania, our guides know every hidden trail and secret beach.</p>
            </div>
            <div className={styles.whyUsItem}>
              <span className={styles.whyUsIcon}>🛡️</span>
              <h3>Safe & Secure</h3>
              <p>Your safety is our priority. We use vetted transport and hand-picked accommodations.</p>
            </div>
            <div className={styles.whyUsItem}>
              <span className={styles.whyUsIcon}>💎</span>
              <h3>Premium Quality</h3>
              <p>We believe in quality over quantity. Every tour is curated for a lifetime experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Guides */}
      <section className={`${styles.guides} section animate-fade-in-up`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Travel Guides</span>
              <h2>Latest Articles</h2>
            </div>
            <Link href="/guides" className="btn btn-secondary">
              All Guides →
            </Link>
          </div>
          <div className={styles.guidesGrid}>
            {latestGuides.map((guide) => (
              <article key={guide.slug} className={`${styles.guideCard} card`}>
                <div className={styles.guideImage} />
                <div className={styles.guideContent}>
                  <span className={styles.guideCategory}>{guide.category}</span>
                  <h3>
                    <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h3>
                  <p>{guide.excerpt}</p>
                  <div className={styles.guideMeta}>
                    <span>By {guide.author}</span>
                    <span>•</span>
                    <span>{guide.date}</span>
                    <span>•</span>
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2>Get Travel Tips & Deals</h2>
            <p>
              Join 10,000+ travelers who get our weekly insider tips on Tanzania
              and Zanzibar.
            </p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Your email address" />
              <button type="submit" className="btn btn-accent">
                Subscribe
              </button>
            </form>
            <span className={styles.newsletterNote}>
              No spam. Unsubscribe anytime.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
