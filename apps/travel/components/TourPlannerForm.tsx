"use client";

import { useMemo, useState } from "react";
import styles from "../app/tours/tours.module.css";

interface TourOption {
    slug: string;
    title: string;
}

interface TourPlannerFormProps {
    tourOptions: TourOption[];
}

type PlannerStatus = "idle" | "loading" | "success" | "error";

export default function TourPlannerForm({ tourOptions }: TourPlannerFormProps) {
    const [status, setStatus] = useState<PlannerStatus>("idle");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        contactPreference: "whatsapp",
        date: "",
        travelers: "2",
        tourSlug: "",
        details: "",
    });

    const selectedTourTitle = useMemo(() => {
        const selected = tourOptions.find((option) => option.slug === form.tourSlug);
        return selected?.title || "Custom Tour Plan";
    }, [form.tourSlug, tourOptions]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                contactPreference: form.contactPreference,
                date: form.date,
                travelers: Number(form.travelers) > 0 ? Number(form.travelers) : 1,
                message: form.details.trim(),
                tourSlug: form.tourSlug || "tour-planner",
                tourTitle: selectedTourTitle,
            };

            const response = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responsePayload = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatus("error");
                setMessage(
                    typeof responsePayload?.error === "string"
                        ? responsePayload.error
                        : "Could not send your request. Please try WhatsApp instead."
                );
                return;
            }

            setStatus("success");
            setMessage(
                typeof responsePayload?.message === "string"
                    ? responsePayload.message
                    : "Inquiry sent successfully. We will contact you shortly."
            );
            setForm({
                name: "",
                email: "",
                phone: "",
                contactPreference: "whatsapp",
                date: "",
                travelers: "2",
                tourSlug: "",
                details: "",
            });
        } catch {
            setStatus("error");
            setMessage("Unable to send right now. Please use WhatsApp for instant support.");
        }
    }

    return (
        <form className={styles.plannerForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
                <label htmlFor="planner-name">Full Name</label>
                <input
                    id="planner-name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                />
            </div>

            <div className={styles.formRow}>
                <label htmlFor="planner-email">Email Address</label>
                <input
                    id="planner-email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                />
            </div>

            <div className={styles.formTwoCols}>
                <div className={styles.formRow}>
                    <label htmlFor="planner-phone">Phone / WhatsApp</label>
                    <input
                        id="planner-phone"
                        type="tel"
                        placeholder="+255..."
                        value={form.phone}
                        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                        required
                    />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="planner-contact-method">Preferred Contact</label>
                    <select
                        id="planner-contact-method"
                        value={form.contactPreference}
                        onChange={(event) => setForm((prev) => ({ ...prev, contactPreference: event.target.value }))}
                        required
                    >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                    </select>
                </div>
            </div>
            <p className={styles.formInlineHint}>
                We always keep your phone number for urgent updates. You choose the primary channel above.
            </p>

            <div className={styles.formTwoCols}>
                <div className={styles.formRow}>
                    <label htmlFor="planner-date">Travel Date</label>
                    <input
                        id="planner-date"
                        type="date"
                        value={form.date}
                        onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                        required
                    />
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="planner-travelers">Travelers</label>
                    <input
                        id="planner-travelers"
                        type="number"
                        min="1"
                        value={form.travelers}
                        onChange={(event) => setForm((prev) => ({ ...prev, travelers: event.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="planner-tour">Preferred Tour</label>
                <select
                    id="planner-tour"
                    value={form.tourSlug}
                    onChange={(event) => setForm((prev) => ({ ...prev, tourSlug: event.target.value }))}
                >
                    <option value="">Let an advisor recommend</option>
                    {tourOptions.map((tour) => (
                        <option key={tour.slug} value={tour.slug}>
                            {tour.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="planner-details">Trip Notes</label>
                <textarea
                    id="planner-details"
                    rows={3}
                    placeholder="Budget, interests, hotel style, private/group preference..."
                    value={form.details}
                    onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                />
            </div>

            <button type="submit" className={styles.plannerSubmitBtn} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Get My Custom Plan"}
            </button>

            {status === "success" && <p className={styles.formSuccess}>{message}</p>}
            {status === "error" && <p className={styles.formError}>{message}</p>}
        </form>
    );
}
