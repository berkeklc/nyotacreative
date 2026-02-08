import Link from "next/link";
import styles from "../page.module.css";
import { getServices } from "@/lib/strapi";

export const metadata = {
    title: "Services | Nyota Creative",
    description: "Full-spectrum creative and technical services including software development, UI/UX design, branding, and content production.",
};

// Static fallback services
const fallbackServices = [
    {
        name: "Software Development",
        slug: "software",
        shortDescription: "Custom web applications, mobile apps, and enterprise solutions built with modern technologies.",
        features: ["Web Applications", "Mobile Apps", "API Development", "Cloud Infrastructure", "E-commerce"],
    },
    {
        name: "UI/UX Design",
        slug: "design",
        shortDescription: "Human-centered digital experiences that delight users and drive business results.",
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    },
    {
        name: "Branding & Identity",
        slug: "branding",
        shortDescription: "Strategic brand development that tells your story and resonates with your audience.",
        features: ["Brand Strategy", "Visual Identity", "Logo Design", "Brand Guidelines", "Messaging"],
    },
    {
        name: "Content Production",
        slug: "content",
        shortDescription: "High-quality video, photography, and motion design that captures attention.",
        features: ["Video Production", "Photography", "Motion Graphics", "Social Content", "Documentary"],
    },
];

export default async function ServicesPage() {
    const strapiServices = await getServices();
    const services = strapiServices.length > 0 ? strapiServices : fallbackServices;

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
                        {services.map((service: any, index: number) => {
                            const features = Array.isArray(service.features)
                                ? service.features
                                : (typeof service.features === "string" ? JSON.parse(service.features || "[]") : []);

                            return (
                                <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    className={styles.serviceCard}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <span className={styles.serviceNumber}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h3>{service.name}</h3>
                                    <p className="text-muted" style={{ marginBottom: "1rem" }}>
                                        {service.shortDescription}
                                    </p>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {features.slice(0, 5).map((feature: string) => (
                                            <li key={feature} style={{ fontSize: "0.8rem", color: "var(--color-gold)", marginBottom: "0.25rem" }}>
                                                → {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <span style={{
                                        display: "inline-block",
                                        marginTop: "1rem",
                                        fontSize: "0.8rem",
                                        color: "var(--color-gold)",
                                        borderBottom: "1px solid var(--color-gold)"
                                    }}>
                                        Learn more →
                                    </span>
                                </Link>
                            );
                        })}
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
