import styles from "../legal.module.css";

export const metadata = {
    title: "Privacy Policy | RushZanzibar",
    description: "Our commitment to protecting your personal data and privacy.",
};

export default function PrivacyPage() {
    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Privacy Policy</h1>
                    <p className={styles.heroSubtitle}>Your Data & Trust</p>
                </div>
            </div>

            <main className={styles.section}>
                <div className={styles.container}>
                    <article className={styles.documentCard}>
                        <div className={styles.meta}>
                            Last updated: January 11, 2026
                        </div>

                        <div className={styles.content}>
                            <h2>Your Privacy Matters</h2>
                            <p>
                                At RushZanzibar, we are committed to maintaining the trust and confidence of our visitors.
                                We deeply understand that when you choose us for your travel plans, you are trusting us with your personal information.
                                We want you to know that we are not in the business of selling, renting, or trading email lists with other companies and businesses for marketing purposes.
                            </p>

                            <h2>Information We Collect</h2>
                            <p>
                                When you inquire about a tour or make a booking, we collect personal information such as your name, email address, phone number, and nationality.
                                We use this information to:
                            </p>
                            <ul>
                                <li>Provide you with bespoke travel advice and itinerary planning.</li>
                                <li>Process your bookings for hotels, flights, and safaris.</li>
                                <li>Communicate with you regarding your trip details.</li>
                                <li>Improve our services and website experience.</li>
                            </ul>

                            <h2>Cookies & Analytics</h2>
                            <p>
                                Our website uses cookies to collect standard internet log information and visitor behavior patterns.
                                We do this to find out things such as the number of visitors to the various parts of the site.
                                This information is only processed in a way which does not identify anyone. We do not make, and do not allow Google to make, any attempt to find out the identities of those visiting our website.
                            </p>

                            <h2>Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                            </p>

                            <div className={styles.contactBox}>
                                <h3>Contact Us</h3>
                                <p>
                                    If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at
                                    <strong> privacy@rushzanzibar.com</strong>.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
