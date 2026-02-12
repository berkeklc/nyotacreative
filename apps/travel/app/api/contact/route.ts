import { NextResponse } from "next/server";

const DEFAULT_STRAPI_URL = "https://cms-production-219a.up.railway.app";
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || DEFAULT_STRAPI_URL;
const STRAPI_URL = RAW_STRAPI_URL.endsWith("/") ? RAW_STRAPI_URL.slice(0, -1) : RAW_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7;
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
        const message = getText(body.message);

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }
        if (!isValidPhone(phone)) {
            return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
        }
        if (!STRAPI_TOKEN) {
            console.error("Travel contact API misconfiguration: STRAPI_API_TOKEN is missing");
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
                    type: "contact",
                    name,
                    email,
                    phone,
                    message,
                    status: "new",
                    source: "travel",
                },
            }),
            cache: "no-store",
        });

        if (!strapiResponse.ok) {
            const errorData = await strapiResponse.text();
            console.error("Travel contact API failed to store inquiry:", strapiResponse.status, errorData);
            return NextResponse.json(
                { error: "Unable to submit inquiry at the moment. Please try again shortly." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Thank you! Your inquiry has been received. We will contact you shortly.",
        });
    } catch (error) {
        console.error("Travel contact API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
