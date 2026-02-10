import { NextResponse } from "next/server";

const DEFAULT_STRAPI_URL = "https://cms-production-219a.up.railway.app";
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || DEFAULT_STRAPI_URL;
const STRAPI_URL = RAW_STRAPI_URL.endsWith("/") ? RAW_STRAPI_URL.slice(0, -1) : RAW_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const allowedInquiryTypes = new Set(["transfer", "car-rental"]);

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getText(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as Record<string, unknown>;
        const name = getText(body.name);
        const email = getText(body.email).toLowerCase();
        const phone = getText(body.phone);
        const type = getText(body.type);
        const itemSlug = getText(body.itemSlug);
        const itemTitle = getText(body.itemTitle);
        const date = getText(body.date);
        const returnDate = getText(body.returnDate);
        const message = getText(body.message);
        const pickupLocation = getText(body.pickupLocation);
        const dropoffLocation = getText(body.dropoffLocation);
        const passengersRaw = Number(body.passengers);
        const passengers = Number.isFinite(passengersRaw) && passengersRaw > 0 ? Math.floor(passengersRaw) : 1;

        if (!name || !email || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }
        if (!allowedInquiryTypes.has(type)) {
            return NextResponse.json({ error: "Invalid rental inquiry type" }, { status: 400 });
        }
        if (!itemSlug || !itemTitle || !date) {
            return NextResponse.json({ error: "Missing rental details" }, { status: 400 });
        }
        if (type === "transfer" && (!pickupLocation || !dropoffLocation)) {
            return NextResponse.json({ error: "Missing transfer route details" }, { status: 400 });
        }
        if (!STRAPI_TOKEN) {
            console.error("Rental inquiry API misconfiguration: STRAPI_API_TOKEN is missing");
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
                    type,
                    name,
                    email,
                    tourSlug: itemSlug,
                    tourTitle: `[${type.toUpperCase()}] ${itemTitle}`,
                    travelDate: date,
                    travelers: passengers,
                    message: [
                        phone ? `Phone: ${phone}` : "",
                        type === "transfer" ? `Route: ${pickupLocation} -> ${dropoffLocation}` : "",
                        returnDate ? `Return: ${returnDate}` : "",
                        message,
                    ]
                        .filter(Boolean)
                        .join(" | "),
                    status: "new",
                    source: "travel-rental",
                },
            }),
            cache: "no-store",
        });

        if (!strapiResponse.ok) {
            const errorData = await strapiResponse.text();
            console.error("Rental inquiry API failed to store inquiry:", strapiResponse.status, errorData);
            return NextResponse.json(
                { error: "Unable to submit rental inquiry at the moment. Please try again shortly." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Thank you! Your inquiry has been received. We will contact you shortly.",
        });
    } catch (error) {
        console.error("Rental Inquiry API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
