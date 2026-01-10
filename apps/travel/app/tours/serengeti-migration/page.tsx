import styles from "../../page.module.css";
import Link from 'next/link';

export const metadata = {
  title: "Serengeti Migration Safari | Nyota Travel",
  description: "Witness the Great Migration in Tanzania's legendary Serengeti National Park. 5-day luxury safari package.",
};

export default function SerengetiPage() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero} style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop")' }}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Most Popular Safari</span>
          <h1 className={styles.heroTitle}>The Great Serengeti Migration</h1>
          <p className={styles.heroSubtitle}>
            Witness the greatest wildlife spectacle on earth. 5 Days / 4 Nights of pure adventure in the heart of Tanzania.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.heroButton} style={{ background: 'var(--color-primary)' }}>Book This Safari</button>
            <Link href="/tours" className={styles.heroButton} style={{ background: 'transparent', border: '1px solid white' }}>Back to Tours</Link>
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Safari Itinerary</h2>
            <p className={styles.sectionSubtitle}>A carefully curated journey through the endless plains.</p>
          </div>

          <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
            {[
              { day: "Day 1", title: "Arrival in Arusha", desc: "Touch down at Kilimanjaro International Airport. VIP transfer to Arusha Coffee Lodge for relaxation and briefing." },
              { day: "Day 2", title: "Journey to Central Serengeti", desc: "Fly into the Seronera airstrip. First game drive spotting lions, leopards, and vast elephant herds." },
              { day: "Day 3", title: "The Great Migration", desc: "A full day dedicated to tracking the wildebeest migration. Picnic lunch in the bush surrounded by nature." },
              { day: "Day 4", title: "Ngorongoro Crater", desc: "Descend into the world's largest inactive volcanic caldera. The best place to see the endangered black rhino." },
              { day: "Day 5", title: "Return to Arusha", desc: "Morning game drive, then flight back to Arusha. Optional stop at the Cultural Heritage Centre." }
            ].map((item, index) => (
              <div key={index} className={styles.card} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, fontWeight: 'bold' }}>
                  {item.day}
                </div>
                <div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.section} style={{ background: 'var(--color-sand)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Wildlife You'll See</h2>
          <div className={styles.grid}>
            {['Lion', 'Elephant', 'Leopard', 'Rhino', 'Buffalo', 'Cheetah'].map((animal, i) => (
              <div key={animal} className={styles.card} style={{ padding: '1rem' }}>
                <div style={{ height: '200px', background: `hsl(${30 + i * 10}, 40%, 80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#555' }}>
                  {animal}
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: '1rem', fontSize: '1.2rem' }}>{animal}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
