"use client";

import { useMemo, useState } from "react";
import styles from "../app/tours/[slug]/tour.module.css";

export default function BookingForm({ tourTitle, tourSlug }: { tourTitle: string, tourSlug: string }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        contactPreference: "whatsapp",
        date: "",
        travelers: 1,
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tourSlug,
                    tourTitle,
                }),
            });
            if (!response.ok) throw new Error("Booking failed");
            setStatus("success");
            setFormData({ name: "", email: "", phone: "", contactPreference: "whatsapp", date: "", travelers: 1, message: "" });
        } catch (err) {
            setStatus("error");
            console.error("Booking error:", err);
        }
    };

    const tourLabel = useMemo(() => tourTitle || "this tour", [tourTitle]);

    if (status === "success") {
        return (
            <div className={styles.successState}>
                <div className={styles.successIcon}>✨</div>
                <h3>Inquiry Sent!</h3>
                <p>Our travel experts will contact you within 24 hours to finalize your {tourLabel} itinerary.</p>
                <button onClick={() => setStatus("idle")} className={`btn btn-secondary ${styles.successResetBtn}`}>Send Another Request</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div className={styles.formTwoColGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="e.g. +255..."
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="contactPreference">Preferred Contact</label>
                    <select
                        id="contactPreference"
                        required
                        value={formData.contactPreference}
                        onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                    >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                    </select>
                </div>
            </div>
            <div className={styles.formTwoColGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="date">Travel Date</label>
                    <input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="travelers">Travelers</label>
                    <input
                        id="travelers"
                        type="number"
                        min="1"
                        required
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="message">Special Requests</label>
                <textarea
                    id="message"
                    rows={3}
                    placeholder="Dietary requirements, accessibility info..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "loading"}
            >
                {status === "loading" ? "Processing..." : "Request Experience"}
            </button>
            {status === "error" && (
                <p className={styles.inlineError}>
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    );
}
