"use client";

import { useState } from "react";
import styles from "../app/contact/contact.module.css";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function TravelContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<FormStatus>("idle");
    const [responseMessage, setResponseMessage] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setResponseMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatus("error");
                setResponseMessage(
                    typeof payload?.error === "string"
                        ? payload.error
                        : "Unable to send your inquiry right now. Please try again."
                );
                return;
            }

            setStatus("success");
            setResponseMessage(
                typeof payload?.message === "string"
                    ? payload.message
                    : "Thank you! Your inquiry has been received."
            );
            setFormData({ name: "", email: "", message: "" });
        } catch {
            setStatus("error");
            setResponseMessage("Unable to send your inquiry right now. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="contact-name">
                    Full Name
                </label>
                <input
                    id="contact-name"
                    type="text"
                    className={styles.input}
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="contact-email">
                    Email Address
                </label>
                <input
                    id="contact-email"
                    type="email"
                    className={styles.input}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="contact-message">
                    Message
                </label>
                <textarea
                    id="contact-message"
                    className={styles.textarea}
                    placeholder="Tell us about your trip plans..."
                    value={formData.message}
                    onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                    required
                />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Inquiry"}
            </button>
            {status === "success" && (
                <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#2d7f5e" }}>{responseMessage}</p>
            )}
            {status === "error" && (
                <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#b43f3f" }}>{responseMessage}</p>
            )}
        </form>
    );
}
