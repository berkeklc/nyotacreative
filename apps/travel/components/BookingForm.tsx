"use client";

import { useState } from "react";
import styles from "../app/tours/[slug]/tour.module.css";

export default function BookingForm({ tourTitle, tourSlug }: { tourTitle: string, tourSlug: string }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        travelers: 1,
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // This would normally go to your API route
            // For now we simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus("success");
            setFormData({ name: "", email: "", date: "", travelers: 1, message: "" });
        } catch (err) {
            setStatus("error");
            console.error("Booking error:", err);
        }
    };

    if (status === "success") {
        return (
            <div className={styles.successState}>
                <div className={styles.successIcon}>✨</div>
                <h3>Inquiry Sent!</h3>
                <p>Our travel experts will contact you within 24 hours to finalize your {tourTitle} itinerary.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-secondary" style={{ marginTop: "2rem", width: "100%" }}>Send Another Request</button>
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                <p style={{ color: "red", fontSize: "0.875rem", marginTop: "1rem", textAlign: "center" }}>
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    );
}
