import styles from "../legal.module.css";

export const metadata = {
    title: "Terms of Service | RushZanzibar",
    description: "Guidelines and rules for using our platform and travel advisory services.",
};

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Terms of Service</h1>
                    <p className={styles.heroSubtitle}>Guidelines & Agreements</p>
                </div>
            </div>

            <main className={styles.section}>
                <div className={styles.container}>
                    <article className={styles.documentCard}>
                        <div className={styles.meta}>
                            Last updated: January 11, 2026
                        </div>

                        <div className={styles.content}>
                            <h2>1. Agreement to Terms</h2>
                            <p>
                                By accessing or using RushZanzibar platform and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>

                            <h2>2. Travel Advisory Services</h2>
                            <p>
                                RushZanzibar acts as a travel advisor and booking facilitator. We curate experiences and connect you with trusted local operators in Tanzania.
                                While we strive for accuracy in all our recommendations, travel conditions, visa requirements, and health regulations can change.
                                It is the traveler's responsibility to verify critical details prior to departure.
                            </p>

                            <h2>3. Bookings & Payments</h2>
                            <p>
                                All bookings made through RushZanzibar are subject to the specific terms and conditions of the respective service providers (airlines, hotels, tour operators).
                                Payment terms, cancellation policies, and refund eligibility will be provided at the time of booking.
                            </p>

                            <h2>4. Limitation of Liability</h2>
                            <p>
                                While we carefully vet our partners, RushZanzibar is not liable for any personal injury, property damage, accident, delay, or irregularity which may be occasioned by any act or default of any company or person engaged in conveying the passenger or in carrying out the arrangements of the tour.
                            </p>

                            <h2>5. Intellectual Property</h2>
                            <p>
                                The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary (including but not limited to intellectual property) rights.
                                The copying, redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited.
                            </p>

                            <div className={styles.contactBox}>
                                <h3>Questions?</h3>
                                <p>
                                    If you have any questions about these Terms, please contact us at
                                    <strong> legal@rushzanzibar.com</strong>.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
