import styles from "../page.module.css";

export const metadata = {
    title: "Privacy Policy | RushZanzibar",
    description: "Our commitment to protecting your personal data and privacy.",
};

export default function PrivacyPage() {
    return (
        <div className={styles.page}>
            <main style={{ paddingTop: "120px" }}>
                <section className="section">
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionLabel}>Legal</span>
                                <h1>Privacy Policy</h1>
                            </div>
                        </div>
                        <article className={styles.guideArticle}>
                            <p>Last updated: January 11, 2026</p>
                            <h2>Your Privacy Matters</h2>
                            <p>At RushZanzibar, we are committed to maintaining the trust and confidence of our visitors. We do not sell, rent, or trade email lists with other companies for marketing purposes.</p>
                            <h2>Data Collection</h2>
                            <p>When you inquire about a tour, we collect personal information such as your name and email address to provide you with bespoke travel advice. We use this information only to fulfill your request and improve our services.</p>
                            <h2>Cookies</h2>
                            <p>Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies in your browser settings.</p>
                            <h2>Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at privacy@rushzanzibar.com.</p>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
}
