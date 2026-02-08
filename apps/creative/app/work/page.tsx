import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import { getProjects, getStrapiMedia } from "@/lib/strapi";

export const metadata = {
    title: "Our Work | Nyota Creative",
    description: "Explore our portfolio of branding, design, and software projects.",
};

// No static fallbacks - content comes from Strapi only
const fallbackProjects: any[] = [];

export default async function WorkPage() {
    const strapiProjects = await getProjects();
    const projects = strapiProjects.length > 0 ? strapiProjects : fallbackProjects;

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
                        {projects.map((project: any, index: number) => {
                            const heroImageUrl = getStrapiMedia(project.heroImage?.url);
                            const serviceNames = project.services?.map((s: any) => s.name).join(" / ") || project.industry;

                            return (
                                <Link
                                    href={`/work/${project.slug}`}
                                    key={project.slug}
                                    className={`${styles.projectCard} ${index === 0 ? styles.projectFeatured : ""}`}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
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
                                        <span className={styles.projectCategory}>{serviceNames}</span>
                                        <h3>{project.title}</h3>
                                        <p className="text-muted">{project.excerpt}</p>
                                        <span className={styles.viewButton}>View Project →</span>
                                    </div>
                                </Link>
                            );
                        })}
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
