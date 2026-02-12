"use client";

import { useMemo, useRef, useState } from "react";
import styles from "../app/tours/tours.module.css";

interface TourOption {
    slug: string;
    title: string;
}

interface TourPlannerFormProps {
    tourOptions: TourOption[];
}

type PlannerStatus = "idle" | "loading" | "success" | "error";

function formatInputDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDateByOffset(days: number) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return formatInputDate(date);
}

export default function TourPlannerForm({ tourOptions }: TourPlannerFormProps) {
    const [status, setStatus] = useState<PlannerStatus>("idle");
    const [message, setMessage] = useState("");
    const todayDate = useMemo(() => getDateByOffset(0), []);
    const recommendedDate = useMemo(() => getDateByOffset(14), []);
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState(() => ({
        name: "",
        email: "",
        phone: "",
        date: recommendedDate,
        travelers: 2,
        tourSlug: "",
        details: "",
    }));

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
                        : "Could not send right now. Please try again in a moment."
                );
                return;
            }

            setStatus("success");
            setMessage(
                typeof responsePayload?.message === "string"
                    ? responsePayload.message
                    : "Received. We will send your route options shortly."
            );
            setForm({
                name: "",
                email: "",
                phone: "",
                date: recommendedDate,
                travelers: 2,
                tourSlug: "",
                details: "",
            });
        } catch {
            setStatus("error");
            setMessage("Connection issue. Please retry.");
        }
    }

    return (
        <form className={styles.plannerForm} onSubmit={handleSubmit}>
            <p className={styles.formIntroLine}>
                No pressure. Just clear options matched to your trip style.
            </p>

            <div className={styles.formGrid}>
                <div className={styles.formRow}>
                    <label htmlFor="planner-name">Name</label>
                    <input
                        id="planner-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        required
                    />
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="planner-phone">Phone / WhatsApp</label>
                    <input
                        id="planner-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+255..."
                        value={form.phone}
                        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                        required
                    />
                </div>

                <div className={`${styles.formRow} ${styles.formRowFull}`}>
                    <label htmlFor="planner-email">Email</label>
                    <input
                        id="planner-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                        required
                    />
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="planner-date">Travel Date</label>
                    <div className={styles.dateInputWrap}>
                        <input
                            ref={dateInputRef}
                            id="planner-date"
                            type="date"
                            min={todayDate}
                            value={form.date}
                            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                            required
                        />
                        <button
                            type="button"
                            className={styles.datePickerBtn}
                            onClick={() => {
                                const input = dateInputRef.current;
                                if (!input) return;
                                if (typeof input.showPicker === "function") {
                                    input.showPicker();
                                    return;
                                }
                                input.focus();
                            }}
                        >
                            Calendar
                        </button>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="planner-travelers">Travelers</label>
                    <div className={styles.travelerStepper}>
                        <button
                            type="button"
                            className={styles.stepperBtn}
                            onClick={() =>
                                setForm((prev) => ({ ...prev, travelers: Math.max(1, Number(prev.travelers) - 1) }))
                            }
                            disabled={Number(form.travelers) <= 1}
                            aria-label="Decrease travelers"
                        >
                            -
                        </button>
                        <input
                            id="planner-travelers"
                            type="number"
                            min={1}
                            max={20}
                            step={1}
                            inputMode="numeric"
                            value={form.travelers}
                            onChange={(event) => {
                                const next = Number(event.target.value);
                                if (!Number.isFinite(next)) return;
                                setForm((prev) => ({ ...prev, travelers: Math.min(20, Math.max(1, next)) }));
                            }}
                            required
                        />
                        <button
                            type="button"
                            className={styles.stepperBtn}
                            onClick={() =>
                                setForm((prev) => ({ ...prev, travelers: Math.min(20, Number(prev.travelers) + 1) }))
                            }
                            disabled={Number(form.travelers) >= 20}
                            aria-label="Increase travelers"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className={`${styles.formRow} ${styles.formRowFull}`}>
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

                <div className={`${styles.formRow} ${styles.formRowFull}`}>
                    <label htmlFor="planner-details">Trip Notes (Optional)</label>
                    <textarea
                        id="planner-details"
                        rows={2}
                        placeholder="What matters most for this trip?"
                        value={form.details}
                        onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                    />
                </div>
            </div>

            <button type="submit" className={styles.plannerSubmitBtn} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Get My Route Draft"}
            </button>

            {status === "success" && <p className={styles.formSuccess}>{message}</p>}
            {status === "error" && <p className={styles.formError}>{message}</p>}
        </form>
    );
}
