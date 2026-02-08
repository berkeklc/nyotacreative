import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
    title: "About | Nyota Creative",
    description: "Learn about our team, philosophy, and approach to creative and software work.",
};



const values = [
    { title: "Excellence", description: "We pursue the highest standards in everything we create." },
    { title: "Authenticity", description: "We stay true to our roots while embracing global perspectives." },
    { title: "Collaboration", description: "We believe the best work comes from diverse minds working together." },
    { title: "Innovation", description: "We constantly push boundaries and explore new possibilities." },
];

export default function AboutPage() {
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
                {/* Intro */}
                <section className="section container">
                    <div className={styles.servicesHeader}>
                        <span className={styles.sectionLabel}>About Us</span>
                        <h1>We are Nyota</h1>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "3rem" }}>
                        <div>
                            <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "rgba(250,250,250,0.9)" }}>
                                Nyota ("star" in Swahili) is a premium creative and software agency
                                based in Dar es Salaam, Tanzania. We blend strategic thinking with
                                creative excellence to build brands, products, and stories that resonate.
                            </p>
                        </div>
                        <div>
                            <p style={{ lineHeight: 1.8, color: "rgba(250,250,250,0.7)" }}>
                                Founded in 2020, we've grown from a small studio to a full-service
                                agency working with clients across East Africa and beyond. Our team
                                combines local expertise with global perspective, creating work that
                                celebrates our heritage while competing on the world stage.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className={`${styles.services} section`}>
                    <div className="container">
                        <div className={styles.servicesHeader}>
                            <span className={styles.sectionLabel}>Our Philosophy</span>
                            <h2>What We Believe</h2>
                        </div>
                        <div className={styles.servicesGrid} style={{ marginTop: "2rem" }}>
                            {values.map((value, index) => (
                                <div key={value.title} className={styles.serviceCard}>
                                    <span className={styles.serviceNumber}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h3>{value.title}</h3>
                                    <p className="text-muted">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* CTA */}
                <section className={styles.cta}>
                    <div className="container">
                        <div className={styles.ctaContent}>
                            <h2>Join our journey</h2>
                            <p>We're always looking for talented individuals to join our team.</p>
                            <Link href="/contact" className="btn btn-primary">
                                Get in Touch
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
