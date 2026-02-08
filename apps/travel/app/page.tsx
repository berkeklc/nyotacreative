"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ExperienceSelector, { type ExperienceType } from "../components/ExperienceSelector";

interface Tour {
  title: string;
  slug: string;
  duration: string;
  price: number;
  image: string | null;
  category?: string;
}

interface Destination {
  name: string;
  slug: string;
  tagline: string;
  image: string | null;
}

interface Article {
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  image: string | null;
}

interface HomePageData {
  destinations: Destination[];
  tours: Tour[];
  articles: Article[];
}

export default function Home() {
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType>(null);
  const [data, setData] = useState<HomePageData>({ destinations: [], tours: [], articles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/homepage");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const { destinations, tours, articles } = data;

  // Filter and sort content based on selected experience
  const getFilteredTours = () => {
    if (!selectedExperience) return tours;
    const categoryMap: Record<string, string[]> = {
      beach: ["beach", "coastal", "island", "zanzibar"],
      safari: ["safari", "wildlife", "mountain", "camping", "serengeti", "ngorongoro"],
      city: ["city", "cultural", "urban", "stone town", "dar"],
    };
    const keywords = categoryMap[selectedExperience] || [];
    const filtered = tours.filter(t =>
      keywords.some(k =>
        t.title?.toLowerCase().includes(k) ||
        t.category?.toLowerCase().includes(k)
      )
    );
    const others = tours.filter(t => !filtered.includes(t));
    return [...filtered, ...others];
  };

  const getFilteredArticles = () => {
    if (!selectedExperience) return articles;
    const categoryMap: Record<string, string[]> = {
      beach: ["beaches", "beach", "coastal", "water"],
      safari: ["safari", "adventure", "wildlife", "nature"],
      city: ["culture", "food", "urban", "tips"],
    };
    const keywords = categoryMap[selectedExperience] || [];
    const filtered = articles.filter(a =>
      keywords.some(k => a.category?.toLowerCase().includes(k))
    );
    const others = articles.filter(a => !filtered.includes(a));
    return [...filtered, ...others];
  };

  const filteredTours = getFilteredTours();
  const filteredArticles = getFilteredArticles();

  return (
    <div className={styles.page}>
      {/* Hero - Full Viewport Experience Selector */}
      <ExperienceSelector
        selected={selectedExperience}
        onSelect={setSelectedExperience}
      />

      {/* Tours Section - Signature Experiences (1st section) */}
      <section id="content-section" className={`${styles.tours} section`} style={{ background: 'var(--color-sand)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                {selectedExperience ? `${selectedExperience.charAt(0).toUpperCase() + selectedExperience.slice(1)} Tours` : 'Recommendations'}
              </span>
              <h2>Signature Experiences</h2>
            </div>
            <Link href="/tours" className="btn btn-secondary">All Tours →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading tours...</p>
            </div>
          ) : filteredTours.length > 0 ? (
            <div className={styles.toursGrid}>
              {filteredTours.slice(0, 4).map((tour) => (
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

      {/* Guides Section - Local Insights (2nd section) */}
      <section className={`${styles.guides} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Local Insights</span>
              <h2>Insider Knowledge</h2>
            </div>
            <Link href="/guides" className="btn btn-secondary">All Guides →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading guides...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className={styles.guidesGrid}>
              {filteredArticles.slice(0, 3).map((guide) => (
                <article key={guide.slug} className={`${styles.guideCard} card`}>
                  <div className={styles.guideImage} style={{ backgroundImage: guide.image ? `url(${guide.image})` : 'none', backgroundColor: 'var(--color-sand-dark)' }} />
                  <div className={styles.guideContent}>
                    {guide.category && <span className={styles.guideCategory}>{guide.category}</span>}
                    <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                    <div className={styles.guideMeta}>
                      {(guide.author || guide.date) && (
                        <span>
                          {guide.author ? `By ${guide.author}` : ''}
                          {guide.author && guide.date ? ' • ' : ''}
                          {guide.date}
                        </span>
                      )}
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

      {/* Explore Section - Destinations (3rd section) */}
      <section className={`${styles.destinations} section`} style={{ background: 'var(--color-sand)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>Explore</span>
              <h2>Popular Destinations</h2>
            </div>
            <Link href="/tanzania" className="btn btn-secondary">View All →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading destinations...</p>
            </div>
          ) : destinations.length > 0 ? (
            <div className={styles.destinationsGrid}>
              {destinations.map((dest) => (
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
    </div>
  );
}
