import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Where to Stay in Tanzania | Nyota Travel",
    description: "Expert advice on the best accommodations in Tanzania and Zanzibar, from luxury lodges to eco-retreats.",
};

const regions = [
    {
        name: "Zanzibar",
        description: "From the historic Stone Town to the pristine Nungwi beach, Zanzibar offers everything from boutique heritage hotels to luxury all-inclusive resorts.",
        tips: ["Stay in Stone Town for 2 nights to experience the culture.", "Choose Nungwi or Kendwa for the best swimming beaches.", "Consider a boutique hotel in Paje for a relaxed vibe."]
    },
    {
        name: "Serengeti & Northern Circuit",
        description: "The home of the Great Migration. Experience luxury tented camps that follow the herds or permanent lodges with panoramic views.",
        tips: ["Tented camps offer a more immersive 'bush' experience.", "Book at least 6-12 months in advance for the migration season.", "Consider Karatu as a base for Ngorongoro Crater."]
    },
    {
        name: "Arusha & Kilimanjaro",
        description: "The gateway to adventure. Arusha offers lush coffee plantation lodges and convenient city hotels for pre-and-post safari stays.",
        tips: ["Pick a lodge outside the city center for a peaceful start.", "Leganga and Usa River areas have beautiful garden estates."]
    }
];

export default function HotelsPage() {
    return (
        <div className={styles.page}>

            <main style={{ paddingTop: "80px" }}>
                <section className="section">
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Accommodation Guide</span>
                                <h1>Where to Stay in Tanzania</h1>
                                <p style={{ marginTop: "1rem", fontSize: "1.2rem", maxWidth: "700px" }}>
                                    Finding the right base is essential for your Tanzanian adventure.
                                    We've curated these insights to help you choose the best stay for your style.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: "3rem", display: "grid", gap: "3rem" }}>
                            {regions.map((region) => (
                                <div key={region.name} style={{ borderBottom: "1px solid var(--color-sand-dark)", paddingBottom: "3rem" }}>
                                    <h2 style={{ marginBottom: "1rem", color: "var(--color-terracotta)" }}>{region.name}</h2>
                                    <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>{region.description}</p>
                                    <div style={{ background: "var(--color-sand)", padding: "1.5rem", borderRadius: "1rem" }}>
                                        <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Advisor Tips:</h4>
                                        <ul style={{ listStyle: "none", padding: 0 }}>
                                            {region.tips.map((tip, idx) => (
                                                <li key={idx} style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                                    <span style={{ color: "var(--color-sunset)" }}>•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "4rem", textAlign: "center", background: "var(--color-charcoal)", padding: "3rem", borderRadius: "2rem", color: "white" }}>
                            <h2 style={{ color: "white", marginBottom: "1rem" }}>Need a Personalized Selection?</h2>
                            <p style={{ marginBottom: "2rem", opacity: 0.9 }}>Tell us your budget and preferences, and we'll recommend the best vetted stays for your trip.</p>
                            <Link href="/tours" className="btn btn-accent">Our Recommended Itineraries</Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
