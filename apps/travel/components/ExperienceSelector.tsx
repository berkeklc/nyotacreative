"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

export type ExperienceType = "beach" | "safari" | "city" | null;

interface ExperienceSelectorProps {
    onSelect: (experience: ExperienceType) => void;
    selected: ExperienceType;
}

const experiences = [
    {
        id: "beach" as const,
        title: "Beach & Coast",
        tagline: "Crystal waters calling your name",
        description: "Zanzibar's pristine beaches await. Dive into turquoise lagoons, walk barefoot on white sand, and watch the sun melt into the Indian Ocean.",
        icon: "🏝️",
        bgImage: "/destinations/kilimanjaro.jpg",
        color: "var(--color-beach)",
        gradient: "linear-gradient(135deg, #1E6B8C 0%, #0E4A63 100%)",
    },
    {
        id: "safari" as const,
        title: "Safari & Wilderness",
        tagline: "Where the wild ones roam",
        description: "Feel your heart race as lions cross your path. Camp under African stars. Witness the Great Migration. This is the adventure of a lifetime.",
        icon: "🦁",
        bgImage: "/hero-safari.jpg",
        color: "var(--color-safari)",
        gradient: "linear-gradient(135deg, #3D6B4F 0%, #2A4A36 100%)",
    },
    {
        id: "city" as const,
        title: "City & Culture",
        tagline: "Stories carved in ancient stone",
        description: "Lose yourself in Stone Town's labyrinthine streets. Taste the spices that shaped history. Connect with traditions that have endured centuries.",
        icon: "🏛️",
        bgImage: "/destinations/serengeti.jpg",
        color: "var(--color-city)",
        gradient: "linear-gradient(135deg, #D4853A 0%, #A66528 100%)",
    },
];

export default function ExperienceSelector({ onSelect, selected }: ExperienceSelectorProps) {
    const [hoveredId, setHoveredId] = useState<ExperienceType>(null);

    const handleSelect = (experience: ExperienceType) => {
        onSelect(experience);
        // Auto-scroll to first section after selection
        setTimeout(() => {
            const firstSection = document.getElementById("content-section");
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);
    };

    return (
        <div className={styles.experienceHero}>
            {experiences.map((exp) => {
                const isSelected = selected === exp.id;
                const isHovered = hoveredId === exp.id;
                const isActive = isSelected || isHovered;

                return (
                    <button
                        key={exp.id}
                        className={`${styles.experiencePanel} ${isSelected ? styles.experiencePanelSelected : ""}`}
                        onClick={() => handleSelect(exp.id)}
                        onMouseEnter={() => setHoveredId(exp.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                            "--panel-gradient": exp.gradient,
                            "--panel-color": exp.color,
                        } as React.CSSProperties}
                    >
                        {/* Background Image */}
                        <div
                            className={styles.experiencePanelBg}
                            style={{ backgroundImage: `url(${exp.bgImage})` }}
                        />

                        {/* Overlay */}
                        <div className={styles.experiencePanelOverlay} />

                        {/* Content */}
                        <div className={styles.experiencePanelContent}>
                            <span className={styles.experienceIcon}>{exp.icon}</span>
                            <h2 className={styles.experienceTitle}>{exp.title}</h2>
                            <p className={styles.experienceTagline}>{exp.tagline}</p>
                            <p className={styles.experienceDescription}>{exp.description}</p>

                            {/* Selection indicator */}
                            <div className={`${styles.experienceIndicator} ${isActive ? styles.experienceIndicatorActive : ""}`}>
                                <span>{isSelected ? "Selected" : "Discover"}</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className={styles.experienceGlow} />
                    </button>
                );
            })}

            {/* Brand overlay at center */}
            <div className={styles.heroOverlayBrand}>
                <span className={styles.heroBrandBadge}>✦ Selected Adventures</span>
                <h1 className={styles.heroBrandTitle}>
                    Discover Tanzania
                    <span>Your Way</span>
                </h1>
                <p className={styles.heroBrandSubtitle}>
                    Three distinct journeys, one extraordinary destination.
                    Choose your path and let Africa reveal its magic.
                </p>
            </div>
        </div>
    );
}
