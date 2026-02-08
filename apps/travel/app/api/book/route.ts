import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, tourSlug, tourTitle, date, travelers, message } = body;

        // Validation
        if (!name || !email || !tourSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("-----------------------------------------");
        console.log("New Booking Inquiry Received!");
        console.log(`Tour: ${tourTitle} (${tourSlug})`);
        console.log(`Customer: ${name} (${email})`);
        console.log(`Preferred Date: ${date}`);
        console.log(`Travelers: ${travelers}`);
        console.log(`Message: ${message || "N/A"}`);
        console.log("-----------------------------------------");

        // Store in Strapi CMS
        try {
            const strapiResponse = await fetch(`${STRAPI_URL}/api/inquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
                },
                body: JSON.stringify({
                    data: {
                        type: "booking",
                        name,
                        email,
                        tourSlug,
                        tourTitle,
                        travelDate: date || null,
                        travelers: travelers || 1,
                        message: message || "",
                        status: "new",
                        source: "travel",
                    },
                }),
            });

            if (!strapiResponse.ok) {
                const errorData = await strapiResponse.text();
                console.error("Strapi storage failed:", strapiResponse.status, errorData);
            } else {
                console.log("Inquiry saved to Strapi successfully");
            }
        } catch (strapiError) {
            console.error("Strapi connection error:", strapiError);
            // Don't fail the request - the user still gets confirmation
        }

        return NextResponse.json({
            success: true,
            message: "Thank you! Your inquiry has been received. We will contact you shortly."
        });
    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
