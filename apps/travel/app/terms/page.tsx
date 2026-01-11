import styles from "../page.module.css";

export const metadata = {
    title: "Terms of Service | Nyota Travel",
    description: "Guidelines and rules for using our platform and travel advisory services.",
};

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px" }}>
                <section className="section">
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Legal</span>
                                <h1>Terms of Service</h1>
                            </div>
                        </div>
                        <article className={styles.guideArticle}>
                            <p>Last updated: January 11, 2026</p>
                            <h2>Agreement to Terms</h2>
                            <p>By accessing or using Nyota Travel, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                            <h2>Travel Advisory</h2>
                            <p>Nyota Travel provides travel recommendations and booking assistance. While we strive for accuracy, travel conditions can change. We recommend all travelers verify essential details before departure.</p>
                            <h2>Liability</h2>
                            <p>We work with trusted local partners, but Nyota Travel is not liable for any personal injury, property damage, or other loss resulting from your use of these services or your travels in Tanzania.</p>
                            <h2>Intellectual Property</h2>
                            <p>All content on this site, including text, images, and logos, is the property of Nyota Creative and protected by international copyright laws.</p>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
}
