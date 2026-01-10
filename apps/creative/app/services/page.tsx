import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "Services | Nyota Creative",
    description: "Full-spectrum creative and technical services including software development, UI/UX design, branding, and content production.",
};

const services = [
    {
        title: "Software Development",
        slug: "software",
        description: "Custom web applications, mobile apps, and enterprise solutions built with modern technologies.",
        features: ["Web Applications", "Mobile Apps", "API Development", "Cloud Infrastructure", "E-commerce"],
    },
    {
        title: "UI/UX Design",
        slug: "design",
        description: "Human-centered digital experiences that delight users and drive business results.",
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    },
    {
        title: "Branding & Identity",
        slug: "branding",
        description: "Strategic brand development that tells your story and resonates with your audience.",
        features: ["Brand Strategy", "Visual Identity", "Logo Design", "Brand Guidelines", "Messaging"],
    },
    {
        title: "Content Production",
        slug: "content",
        description: "High-quality video, photography, and motion design that captures attention.",
        features: ["Video Production", "Photography", "Motion Graphics", "Social Content", "Documentary"],
    },
    {
        title: "Studio Services",
        slug: "studio",
        description: "Professional equipment and production facilities for your creative projects.",
        features: ["Equipment Rental", "Studio Space", "Technical Support", "Post-Production", "Sound Design"],
    },
    {
        title: "Talent & Collaboration",
        slug: "talent",
        description: "Access to dancers, singers, creators, and artists for your projects.",
        features: ["Talent Sourcing", "Creative Direction", "Project Management", "Artist Management", "Partnerships"],
    },
];

export default function ServicesPage() {
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
                        <span className={styles.sectionLabel}>What We Do</span>
                        <h1>Our Services</h1>
                        <p style={{ marginTop: "1rem", maxWidth: "600px", color: "rgba(250,250,250,0.7)" }}>
                            Full-spectrum creative and technical services to bring your vision to life.
                        </p>
                    </div>

                    <div className={styles.servicesGrid} style={{ marginTop: "3rem" }}>
                        {services.map((service, index) => (
                            <div key={service.slug} className={styles.serviceCard}>
                                <span className={styles.serviceNumber}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3>{service.title}</h3>
                                <p className="text-muted" style={{ marginBottom: "1rem" }}>{service.description}</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {service.features.map((feature) => (
                                        <li key={feature} style={{ fontSize: "0.8rem", color: "var(--color-gold)", marginBottom: "0.25rem" }}>
                                            → {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.cta}>
                    <div className="container">
                        <div className={styles.ctaContent}>
                            <h2>Let's work together</h2>
                            <p>Ready to start your next project? Get in touch to discuss how we can help.</p>
                            <Link href="/contact" className="btn btn-primary">
                                Start a Conversation
                            </Link>
                        </div>
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
