import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { getService, getServices, getStrapiMedia } from "@/lib/strapi";

// Static fallback data
const fallbackServices: Record<string, any> = {
    software: {
        name: "Software Development",
        slug: "software",
        shortDescription: "Custom web applications, mobile apps, and enterprise solutions.",
        fullDescription: `
            <p>We build powerful digital products that drive business growth. From concept to deployment, our team delivers scalable, secure, and user-friendly software solutions.</p>
            <h3>Our Approach</h3>
            <p>We follow agile methodologies and modern development practices to ensure fast iteration and high-quality output. Our stack includes React, Next.js, Node.js, Python, and cloud infrastructure on AWS and GCP.</p>
        `,
        features: ["Web Applications", "Mobile Apps (iOS/Android)", "API Development", "Cloud Infrastructure", "E-commerce Platforms", "SaaS Products"],
    },
    design: {
        name: "UI/UX Design",
        slug: "design",
        shortDescription: "Human-centered digital experiences that delight users.",
        fullDescription: `
            <p>Great design is invisible. We create intuitive interfaces that feel natural and drive engagement. Our design process is rooted in user research and iterative testing.</p>
            <h3>Our Process</h3>
            <p>We start with discovery—understanding your users, goals, and constraints. Then we move through wireframing, prototyping, and visual design, validating at each step.</p>
        `,
        features: ["User Research", "Wireframing & Prototyping", "Visual Design", "Design Systems", "Usability Testing", "Interaction Design"],
    },
    branding: {
        name: "Branding & Identity",
        slug: "branding",
        shortDescription: "Strategic brand development that resonates with your audience.",
        fullDescription: `
            <p>Your brand is more than a logo—it's the complete experience of your company. We develop comprehensive brand identities that communicate your values and connect with your audience.</p>
            <h3>What We Deliver</h3>
            <p>Brand strategy, visual identity systems, logo design, typography, color palettes, brand guidelines, and messaging frameworks.</p>
        `,
        features: ["Brand Strategy", "Visual Identity", "Logo Design", "Brand Guidelines", "Messaging & Voice", "Brand Collateral"],
    },
    content: {
        name: "Content Production",
        slug: "content",
        shortDescription: "High-quality video, photography, and motion design.",
        fullDescription: `
            <p>Compelling content captures attention and drives action. Our production team creates stunning visuals—from social media content to documentary films.</p>
            <h3>Our Capabilities</h3>
            <p>Full-service video production, professional photography, motion graphics, animation, and post-production. We have in-house studio facilities and equipment.</p>
        `,
        features: ["Video Production", "Photography", "Motion Graphics", "Animation", "Documentary", "Social Media Content"],
    },
};

export async function generateStaticParams() {
    const services = await getServices();
    if (services.length > 0) {
        return services.map((service: any) => ({ slug: service.slug }));
    }
    return Object.keys(fallbackServices).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = await getService(slug);
    const data = service || fallbackServices[slug];

    if (!data) {
        return { title: "Service Not Found | Nyota Creative" };
    }

    return {
        title: `${data.name} | Nyota Creative`,
        description: data.shortDescription,
    };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const strapiService = await getService(slug);
    const service = strapiService || fallbackServices[slug];

    if (!service) {
        notFound();
    }

    const features = Array.isArray(service.features)
        ? service.features
        : (typeof service.features === "string" ? JSON.parse(service.features || "[]") : []);

    const relatedProjects = service.projects || [];

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
                {/* Hero Section */}
                <section className="section container">
                    <div className={styles.servicesHeader}>
                        <Link
                            href="/services"
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--color-gold)",
                                textDecoration: "none",
                                display: "inline-block",
                                marginBottom: "1rem"
                            }}
                        >
                            ← Back to Services
                        </Link>
                        <span className={styles.sectionLabel}>Service</span>
                        <h1>{service.name}</h1>
                        <p style={{ marginTop: "1rem", maxWidth: "600px", color: "rgba(250,250,250,0.7)" }}>
                            {service.shortDescription}
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="section container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
                        {/* Description */}
                        <div>
                            {service.fullDescription ? (
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                                    style={{ color: "rgba(250,250,250,0.8)", lineHeight: 1.8 }}
                                />
                            ) : (
                                <p style={{ color: "rgba(250,250,250,0.8)", lineHeight: 1.8 }}>
                                    {service.shortDescription}
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <div>
                            <h3 style={{ marginBottom: "1.5rem", color: "var(--color-gold)" }}>What We Offer</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {features.map((feature: string, index: number) => (
                                    <li
                                        key={feature}
                                        style={{
                                            padding: "1rem 0",
                                            borderBottom: "1px solid rgba(250,250,250,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem"
                                        }}
                                    >
                                        <span style={{ color: "var(--color-gold)", fontSize: "0.8rem" }}>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                    <section className="section container">
                        <h2 style={{ marginBottom: "2rem" }}>Related Projects</h2>
                        <div className={styles.projectsGrid}>
                            {relatedProjects.slice(0, 3).map((project: any) => {
                                const heroImageUrl = getStrapiMedia(project.heroImage?.url);
                                return (
                                    <article key={project.slug} className={styles.projectCard}>
                                        <div className={styles.projectImage}>
                                            {heroImageUrl ? (
                                                <Image
                                                    src={heroImageUrl}
                                                    alt={project.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className={styles.projectImagePlaceholder} />
                                            )}
                                        </div>
                                        <div className={styles.projectInfo}>
                                            <h3>{project.title}</h3>
                                            <p className="text-muted">{project.excerpt}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className={styles.cta}>
                    <div className="container">
                        <div className={styles.ctaContent}>
                            <h2>Ready to get started?</h2>
                            <p>Let's discuss how our {service.name.toLowerCase()} services can help your business.</p>
                            <Link href="/contact" className="btn btn-primary">
                                Start a Project
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
