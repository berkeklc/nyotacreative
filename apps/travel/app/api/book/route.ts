import { NextResponse } from "next/server";

const DEFAULT_STRAPI_URL = "https://cms-production-219a.up.railway.app";
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || DEFAULT_STRAPI_URL;
const STRAPI_URL = RAW_STRAPI_URL.endsWith("/") ? RAW_STRAPI_URL.slice(0, -1) : RAW_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getText(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function normalizeContactPreference(value: string) {
    const normalized = value.toLowerCase();
    if (normalized === "whatsapp" || normalized === "phone" || normalized === "email") {
        return normalized;
    }
    return "whatsapp";
}

function toContactPreferenceLabel(value: string) {
    if (value === "phone") return "Phone Call";
    if (value === "email") return "Email";
    return "WhatsApp";
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as Record<string, unknown>;
        const name = getText(body.name);
        const email = getText(body.email).toLowerCase();
        const phone = getText(body.phone);
        const contactPreference = normalizeContactPreference(getText(body.contactPreference));
        const tourSlug = getText(body.tourSlug);
        const tourTitle = getText(body.tourTitle);
        const date = getText(body.date);
        const message = getText(body.message);
        const travelersRaw = Number(body.travelers);
        const travelers = Number.isFinite(travelersRaw) && travelersRaw > 0 ? Math.floor(travelersRaw) : 1;
        const normalizedMessage = [message, `Preferred contact: ${toContactPreferenceLabel(contactPreference)}`]
            .filter(Boolean)
            .join("\n\n");

        if (!name || !email || !phone || !tourSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }
        if (!STRAPI_TOKEN) {
            console.error("Booking API misconfiguration: STRAPI_API_TOKEN is missing");
            return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
        }

        const strapiResponse = await fetch(`${STRAPI_URL}/api/inquiries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    type: "booking",
                    name,
                    email,
                    phone,
                    tourSlug,
                    tourTitle,
                    travelDate: date || null,
                    travelers,
                    message: normalizedMessage,
                    status: "new",
                    source: "travel",
                },
            }),
            cache: "no-store",
        });

        if (!strapiResponse.ok) {
            const errorData = await strapiResponse.text();
            console.error("Booking API failed to store inquiry:", strapiResponse.status, errorData);
            return NextResponse.json(
                { error: "Unable to submit booking request at the moment. Please try again shortly." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Thank you! Your inquiry has been received. We will contact you shortly.",
        });
    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
