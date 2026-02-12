"use client";

import { useState, type CSSProperties } from "react";
import styles from "../app/page.module.css";

export type ExperienceType = "beach" | "safari" | "city" | null;

interface ExperienceSelectorProps {
    onSelect: (experience: ExperienceType) => void;
    selected: ExperienceType;
}

const experiences = [
    {
        id: "beach" as const,
        title: "Beach Transfers & Coast Days",
        kicker: "Coastal",
        description: "Perfect for Zanzibar beach stays, marine days, and smooth hotel-to-hotel movement.",
        transferText: "Airport to beach transfers first",
        rentalText: "Easy access to self-drive coast routes",
        bgImage: "/destinations/kilimanjaro.jpg",
        color: "var(--color-beach)",
        gradient: "linear-gradient(135deg, #1E6B8C 0%, #0E4A63 100%)",
    },
    {
        id: "safari" as const,
        title: "Safari Logistics & Game Drives",
        kicker: "Safari",
        description: "Designed for park arrivals, lodge transfers, and timing tours around wildlife windows.",
        transferText: "Airport-to-lodge transfer routes highlighted",
        rentalText: "4x4 rental options for independent legs",
        bgImage: "/hero-safari.jpg",
        color: "var(--color-safari)",
        gradient: "linear-gradient(135deg, #3D6B4F 0%, #2A4A36 100%)",
    },
    {
        id: "city" as const,
        title: "City Routes & Culture Stops",
        kicker: "Urban",
        description: "Built for Stone Town, Dar es Salaam, and heritage-focused itineraries with clean pacing.",
        transferText: "Point-to-point chauffeur rides",
        rentalText: "Flexible self-drive city access",
        bgImage: "/destinations/serengeti.jpg",
        color: "var(--color-city)",
        gradient: "linear-gradient(135deg, #D4853A 0%, #A66528 100%)",
    },
];

export default function ExperienceSelector({ onSelect, selected }: ExperienceSelectorProps) {
    const [hoveredId, setHoveredId] = useState<ExperienceType>(null);

    const handleSelect = (experience: ExperienceType) => {
        onSelect(experience);
        setTimeout(() => {
            const firstSection = document.getElementById("content-section");
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
    };

    return (
        <section className={styles.experienceHero} aria-labelledby="home-hero-title">
            <div className={styles.heroOverlayBrand}>
                <span className={styles.heroBrandBadge}>Choose Your Travel Mode</span>
                <h1 id="home-hero-title" className={styles.heroBrandTitle}>
                    Discover Tanzania Your Way
                </h1>
                <p className={styles.heroBrandSubtitle}>
                    Keep transfers and car rentals in focus while tours, guides, and destinations adapt to your selected style.
                </p>
            </div>

            <div className={styles.experienceHeroInner}>
                {experiences.map((exp, index) => {
                    const isSelected = selected === exp.id;
                    const isActive = isSelected || hoveredId === exp.id;
                    return (
                        <button
                            key={exp.id}
                            className={`${styles.experiencePanel} ${isSelected ? styles.experiencePanelSelected : ""}`}
                            onClick={() => handleSelect(exp.id)}
                            onMouseEnter={() => setHoveredId(exp.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={
                                {
                                    "--panel-gradient": exp.gradient,
                                    "--panel-color": exp.color,
                                } as CSSProperties
                            }
                        >
                            <div className={styles.experiencePanelBg} style={{ backgroundImage: `url(${exp.bgImage})` }} />
                            <div className={styles.experiencePanelOverlay} />

                            <div className={styles.experiencePanelContent}>
                                <span className={styles.experiencePanelIndex}>{String(index + 1).padStart(2, "0")}</span>
                                <span className={styles.experiencePanelKicker}>{exp.kicker}</span>
                                <h2 className={styles.experienceTitle}>{exp.title}</h2>
                                <p className={styles.experienceDescription}>{exp.description}</p>
                                <div className={styles.experiencePanelBullets}>
                                    <span>{exp.transferText}</span>
                                    <span>{exp.rentalText}</span>
                                </div>
                                <div className={`${styles.experienceIndicator} ${isActive ? styles.experienceIndicatorActive : ""}`}>
                                    <span>{isSelected ? "Style selected" : "Explore this style"}</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
