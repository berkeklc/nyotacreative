import Link from "next/link";
import styles from "./page.module.css";

const destinations = [
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
    badge: "Best Seller",
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
    badge: "Popular",
  },
  {
    title: "Safari Blue Day Trip",
    slug: "safari-blue",
    duration: "Full Day",
    price: 95,
    rating: 4.9,
    reviews: 312,
    image: "/tours/safari-blue.jpg",
    badge: "Top Rated",
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
  { icon: "🏝️", label: "Beaches", href: "/tanzania/zanzibar/beaches" },
  { icon: "🦁", label: "Safari", href: "/guides/tanzania-safari" },
  { icon: "🍽️", label: "Food", href: "/guides/category/food" },
  { icon: "🏨", label: "Hotels", href: "/hotels" },
  { icon: "✈️", label: "Getting There", href: "/guides/getting-to-tanzania" },
  { icon: "💡", label: "Tips", href: "/guides/category/tips" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
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
            <Link href="/hotels">Hotels</Link>
          </div>
          <div className={styles.navActions}>
            <button className={styles.langSwitch}>EN</button>
            <Link href="/tours" className="btn btn-primary">
              Book a Tour
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <span className="badge badge-local">🌍 Local Experts</span>
          </span>
          <h1>
            Discover <span className={styles.heroHighlight}>Tanzania</span>
            <br />& Zanzibar
          </h1>
          <p className={styles.heroSubtitle}>
            Your ultimate guide to East Africa's hidden gems, pristine beaches,
            and unforgettable adventures.
          </p>
          <div className={styles.heroSearch}>
            <input
              type="text"
              placeholder="Where do you want to explore?"
              className={styles.searchInput}
            />
            <button className="btn btn-primary">Explore</button>
          </div>
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
      <section className={`${styles.destinations} section`}>
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
            {destinations.map((dest) => (
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
      <section className={`${styles.tours} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Book Now</span>
              <h2>Popular Tours & Experiences</h2>
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
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Guides */}
      <section className={`${styles.guides} section`}>
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
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoIcon}>✦</span>
                NYOTA TRAVEL
              </Link>
              <p>
                East Africa's trusted travel resource. Powered by local experts
                and powered by Nyota Creative.
              </p>
              <div className={styles.footerSocial}>
                <a href="#">📘</a>
                <a href="#">📸</a>
                <a href="#">🐦</a>
                <a href="#">📺</a>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <h4>Destinations</h4>
              <Link href="/tanzania/zanzibar">Zanzibar</Link>
              <Link href="/tanzania/dar-es-salaam">Dar es Salaam</Link>
              <Link href="/tanzania/serengeti">Serengeti</Link>
              <Link href="/tanzania">All Destinations</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Travel Guides</h4>
              <Link href="/guides/category/beaches">Beaches</Link>
              <Link href="/guides/category/food">Food & Drink</Link>
              <Link href="/guides/category/culture">Culture</Link>
              <Link href="/guides/category/tips">Travel Tips</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Nyota Travel. A Nyota Creative project.</p>
            <div className={styles.footerLang}>
              <button>🇬🇧 English</button>
              <button>🇹🇿 Kiswahili</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
