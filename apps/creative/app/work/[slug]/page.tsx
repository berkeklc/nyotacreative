import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import { getProject, getProjects, getStrapiMedia } from "@/lib/strapi";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project: any) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return { title: "Project Not Found | Nyota Creative" };
    }

    return {
        title: `${project.title} | Nyota Creative`,
        description: project.excerpt || `${project.title} - A project by Nyota Creative`,
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const heroImageUrl = getStrapiMedia(project.heroImage?.url);
    const galleryImages = project.gallery || [];
    const services = project.services || [];

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

            <main>
                {/* Hero Section */}
                <section
                    style={{
                        position: "relative",
                        height: "70vh",
                        minHeight: "500px",
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: "4rem",
                    }}
                >
                    {heroImageUrl && (
                        <Image
                            src={heroImageUrl}
                            alt={project.title}
                            fill
                            style={{ objectFit: "cover" }}
                            priority
                        />
                    )}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.3) 50%, transparent 100%)",
                        }}
                    />
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <Link
                            href="/work"
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--color-gold)",
                                textDecoration: "none",
                                display: "inline-block",
                                marginBottom: "1rem",
                            }}
                        >
                            ← Back to Work
                        </Link>
                        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{project.title}</h1>
                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
                            {project.client && (
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "rgba(250,250,250,0.5)", textTransform: "uppercase" }}>
                                        Client
                                    </span>
                                    <p style={{ color: "var(--color-gold)", marginTop: "0.25rem" }}>{project.client}</p>
                                </div>
                            )}
                            {project.industry && (
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "rgba(250,250,250,0.5)", textTransform: "uppercase" }}>
                                        Industry
                                    </span>
                                    <p style={{ marginTop: "0.25rem" }}>{project.industry}</p>
                                </div>
                            )}
                            {services.length > 0 && (
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "rgba(250,250,250,0.5)", textTransform: "uppercase" }}>
                                        Services
                                    </span>
                                    <p style={{ marginTop: "0.25rem" }}>{services.map((s: any) => s.name).join(" / ")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="section container">
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem" }}>
                        <div>
                            {project.excerpt && (
                                <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "rgba(250,250,250,0.9)", marginBottom: "2rem" }}>
                                    {project.excerpt}
                                </p>
                            )}
                            {project.fullDescription && (
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                                    style={{ color: "rgba(250,250,250,0.7)", lineHeight: 1.8 }}
                                />
                            )}
                        </div>
                        <div>
                            {project.completedAt && (
                                <div style={{ marginBottom: "2rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "rgba(250,250,250,0.5)", textTransform: "uppercase" }}>
                                        Completed
                                    </span>
                                    <p style={{ marginTop: "0.25rem" }}>
                                        {new Date(project.completedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                        })}
                                    </p>
                                </div>
                            )}
                            {project.website && (
                                <a
                                    href={project.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                    style={{ display: "inline-block" }}
                                >
                                    Visit Website →
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                {galleryImages.length > 0 && (
                    <section className="section container">
                        <h2 style={{ marginBottom: "2rem" }}>Gallery</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                            {galleryImages.map((img: any, index: number) => {
                                const imageUrl = getStrapiMedia(img.url);
                                if (!imageUrl) return null;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "16/10",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={`${project.title} gallery ${index + 1}`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className={styles.cta}>
                    <div className="container">
                        <div className={styles.ctaContent}>
                            <h2>Like what you see?</h2>
                            <p>Let's create something amazing together.</p>
                            <Link href="/contact" className="btn btn-primary">
                                Start a Project
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
