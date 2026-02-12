import Link from "next/link";
import styles from "./page.module.css";
import { fetchAPI, getStrapiMedia } from "../lib/strapi";
import HeroVisual from "../components/HeroVisual";

// No static fallbacks - content comes from Strapi only
const fallbackServices: any[] = [];
const fallbackProjects: any[] = [];

async function getServices() {
  try {
    const response = await fetchAPI("/services", {
      populate: ["icon"],
      sort: ["order:asc"],
      pagination: { limit: 6 },
    });
    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

async function getProjects() {
  try {
    const response = await fetchAPI("/projects", {
      populate: ["heroImage", "services"],
      sort: ["completedAt:desc", "createdAt:desc"],
      pagination: { limit: 3 },
    });
    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function Home() {
  const [cmsServices, cmsProjects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);

  // Use CMS data if available, fallback to static
  const services = cmsServices.length > 0
    ? cmsServices.map((s: any) => ({
      title: s.name,
      description: s.shortDescription || "",
    }))
    : fallbackServices;

  const featuredProjects = cmsProjects.length > 0
    ? cmsProjects.map((p: any) => ({
      title: p.title,
      category: p.services?.map((s: any) => s.name).join(" / ") || p.industry || "Project",
      description: p.excerpt || "",
      image: getStrapiMedia(p.heroImage?.url, p.updatedAt || p.heroImage?.updatedAt) || "/projects/placeholder.jpg",
      slug: p.slug,
    }))
    : fallbackProjects;

  return (
    <div className={styles.page}>
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Creative & Software Agency</span>
          <h1 className={styles.heroTitle}>
            We craft digital
            <br />
            <span className="text-gold">experiences</span> that
            <br />
            inspire.
          </h1>
          <p className={styles.heroDescription}>
            A multidisciplinary studio blending strategic thinking with creative
            excellence. We build brands, products, and stories that resonate.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/work" className="btn btn-primary">
              View Our Work
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Start a Project
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <HeroVisual />
        </div>
      </section>

      {/* Services Section */}
      <section className={`${styles.services} section`}>
        <div className="container">
          <div className={styles.servicesHeader}>
            <span className={styles.sectionLabel}>What We Do</span>
            <h2>
              Full-spectrum creative
              <br />
              <span className="text-gold">& technical</span> services
            </h2>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service: any, index: number) => (
              <div
                key={service.title}
                className={styles.serviceCard}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className={styles.serviceNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{service.title}</h3>
                <p className="text-muted">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className={`${styles.work} section`}>
        <div className="container">
          <div className={styles.workHeader}>
            <span className={styles.sectionLabel}>Selected Work</span>
            <h2>
              Projects that define
              <br />
              <span className="text-gold">our craft</span>
            </h2>
          </div>
          <div className={styles.projectsGrid}>
            {featuredProjects.map((project: any, index: number) => (
              <Link
                href={`/work/${project.slug || project.title.toLowerCase().replace(/\s+/g, "-")}`}
                key={project.title}
                className={`${styles.projectCard} ${index === 0 ? styles.projectFeatured : ""}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={styles.projectImage}>
                  <div
                    className={styles.projectImagePlaceholder}
                    data-project={project.title.toLowerCase().replace(" ", "-")}
                    style={project.image && project.image !== "/projects/placeholder.jpg" ? {
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    } : undefined}
                  />
                </div>
                <div className={styles.projectInfo}>
                  <span className={styles.projectCategory}>
                    {project.category}
                  </span>
                  <h3>{project.title}</h3>
                  <p className="text-muted">{project.description}</p>
                  <span className={styles.viewButton}>View Project →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.workCta}>
            <Link href="/work" className="btn btn-outline">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>
              Ready to create
              <br />
              something <span className="text-gold">remarkable</span>?
            </h2>
            <p>
              Let's discuss your vision and explore how we can bring it to life.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.logo}>
                NYOTA<span className={styles.logoAccent}>.</span>
              </Link>
              <p className="text-muted">
                Premium creative & software agency
                <br />
                based in Dar es Salaam, Tanzania.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <h4>Navigation</h4>
              <Link href="/work">Work</Link>
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Services</h4>
              <Link href="/services/software">Software</Link>
              <Link href="/services/design">Design</Link>
              <Link href="/services/branding">Branding</Link>
              <Link href="/services/content">Content</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Connect</h4>
              <a href="https://instagram.com/nyotacreative" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://linkedin.com/company/nyotacreative" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="mailto:nyotacreatives@gmail.com">nyotacreatives@gmail.com</a>
            </div>
          </div>
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
