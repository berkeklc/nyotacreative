import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Our Work | Nyota Creative",
    description: "Explore our portfolio of branding, design, and software projects.",
};

const projects = [
    {
        title: "Nyota Travel",
        slug: "nyota-travel",
        category: "Platform / Branding",
        description: "East Africa's premier travel content network. A comprehensive platform for discovering Tanzania and Zanzibar.",
        year: "2026",
    },
    {
        title: "Serena Hotels",
        slug: "serena-hotels",
        category: "Brand Identity / Digital",
        description: "Complete brand transformation for East Africa's premier hotel group.",
        year: "2025",
    },
    {
        title: "Zanzibar Nights",
        slug: "zanzibar-nights",
        category: "Content / Social",
        description: "Award-winning cultural documentary series showcasing Zanzibar's vibrant nightlife.",
        year: "2025",
    },
    {
        title: "Karibu App",
        slug: "karibu-app",
        category: "Mobile / UX",
        description: "Tourism companion app for East African travelers with offline maps and guides.",
        year: "2024",
    },
    {
        title: "Safari Express",
        slug: "safari-express",
        category: "E-Commerce / Development",
        description: "Online booking platform for safari tours across Tanzania and Kenya.",
        year: "2024",
    },
    {
        title: "Swahili Sounds",
        slug: "swahili-sounds",
        category: "Branding / Content",
        description: "Music label identity and artist management platform.",
        year: "2024",
    },
];

export default function WorkPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        NYOTA<span className={styles.logoAccent}>.</span>
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/work">Work</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact" className="btn btn-outline">
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            <main style={{ paddingTop: "120px" }}>
                <section className="section container">
                    <div className={styles.servicesHeader}>
                        <span className={styles.sectionLabel}>Portfolio</span>
                        <h1>Our Work</h1>
                        <p style={{ marginTop: "1rem", maxWidth: "600px", color: "rgba(250,250,250,0.7)" }}>
                            Selected projects showcasing our expertise in branding, design, and software development.
                        </p>
                    </div>

                    <div className={styles.projectsGrid} style={{ marginTop: "3rem" }}>
                        {projects.map((project, index) => (
                            <article
                                key={project.slug}
                                className={`${styles.projectCard} ${index === 0 ? styles.projectFeatured : ""}`}
                            >
                                <div className={styles.projectImage}>
                                    <div className={styles.projectImagePlaceholder} />
                                </div>
                                <div className={styles.projectInfo}>
                                    <span className={styles.projectCategory}>{project.category}</span>
                                    <h3>{project.title}</h3>
                                    <p className="text-muted">{project.description}</p>
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", marginTop: "0.5rem", display: "block" }}>
                                        {project.year}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerBottom}>
                        <p className="text-muted">
                            © {new Date().getFullYear()} Nyota Creative. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
