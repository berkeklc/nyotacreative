"use client";

import { useState } from "react";
import styles from "../app/rentals/rentals.module.css";

interface RentalBookingFormProps {
    type: "transfer" | "car-rental";
    itemTitle: string;
    itemSlug: string;
    pickupLocation?: string;
    dropoffLocation?: string;
}

export default function RentalBookingForm({
    type,
    itemTitle,
    itemSlug,
    pickupLocation,
    dropoffLocation,
}: RentalBookingFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        returnDate: "",
        passengers: 1,
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const isInvalidReturnDate = type === "car-rental"
        && Boolean(formData.date)
        && Boolean(formData.returnDate)
        && formData.returnDate < formData.date;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isInvalidReturnDate) {
            setStatus("error");
            return;
        }
        setStatus("loading");

        try {
            const response = await fetch("/api/rental-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    type,
                    itemSlug,
                    itemTitle,
                    pickupLocation,
                    dropoffLocation,
                }),
            });
            if (!response.ok) throw new Error("Inquiry failed");
            setStatus("success");
            setFormData({ name: "", email: "", phone: "", date: "", returnDate: "", passengers: 1, message: "" });
        } catch (err) {
            setStatus("error");
            console.error("Rental inquiry error:", err);
        }
    };

    if (status === "success") {
        return (
            <div className={styles.successState}>
                <div className={styles.successIcon}>✅</div>
                <h3>Inquiry Sent!</h3>
                <p>
                    {type === "transfer"
                        ? "We'll confirm your transfer details and send you a confirmation within 2 hours."
                        : "Our team will get back to you within 2 hours with availability and final pricing."}
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="btn btn-secondary"
                    style={{ marginTop: "1.5rem", width: "100%" }}
                >
                    Send Another Request
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="rental-name">Full Name</label>
                <input
                    id="rental-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="rental-email">Email</label>
                    <input
                        id="rental-email"
                        type="email"
                        required
                        placeholder="john@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="rental-phone">Phone</label>
                    <input
                        id="rental-phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="rental-date">
                        {type === "transfer" ? "Transfer Date" : "Pickup Date"}
                    </label>
                    <input
                        id="rental-date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                {type === "car-rental" ? (
                    <div className={styles.formGroup}>
                        <label htmlFor="rental-return-date">Return Date</label>
                        <input
                            id="rental-return-date"
                            type="date"
                            min={formData.date || undefined}
                            value={formData.returnDate}
                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className={styles.formGroup}>
                        <label htmlFor="rental-passengers">Passengers</label>
                        <input
                            id="rental-passengers"
                            type="number"
                            min="1"
                            max="20"
                            required
                            value={formData.passengers}
                            onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                )}
            </div>
            {type === "transfer" && (
                <div className={styles.formGroup} style={{ display: "none" }}>
                    <input type="hidden" value={pickupLocation || ""} />
                    <input type="hidden" value={dropoffLocation || ""} />
                </div>
            )}
            <div className={styles.formGroup}>
                <label htmlFor="rental-message">Special Requests</label>
                <textarea
                    id="rental-message"
                    rows={3}
                    placeholder={
                        type === "transfer"
                            ? "Flight number, preferred time, child seat needed..."
                            : "Insurance preferences, GPS, child seat..."
                    }
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "loading" || isInvalidReturnDate}
            >
                {status === "loading"
                    ? "Sending..."
                    : type === "transfer"
                        ? "Book Transfer"
                        : "Request Vehicle"}
            </button>
            {status === "error" && (
                <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.75rem", textAlign: "center" }}>
                    {isInvalidReturnDate
                        ? "Return date cannot be earlier than pickup date."
                        : "Something went wrong. Please try again or contact us via WhatsApp."}
                </p>
            )}
        </form>
    );
}
