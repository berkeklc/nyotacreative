import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            type,
            itemSlug,
            itemTitle,
            date,
            returnDate,
            passengers,
            message,
            pickupLocation,
            dropoffLocation,
        } = body;

        // Validation
        if (!name || !email || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("-----------------------------------------");
        console.log("New Rental Inquiry Received!");
        console.log(`Type: ${type}`);
        console.log(`Item: ${itemTitle} (${itemSlug})`);
        console.log(`Customer: ${name} (${email}) - Phone: ${phone || "N/A"}`);
        if (type === "transfer") {
            console.log(`Route: ${pickupLocation} → ${dropoffLocation}`);
            console.log(`Transfer Date: ${date}`);
            console.log(`Passengers: ${passengers}`);
        } else {
            console.log(`Pickup: ${date} | Return: ${returnDate || "N/A"}`);
        }
        console.log(`Message: ${message || "N/A"}`);
        console.log("-----------------------------------------");

        // Store in Strapi CMS (using existing Inquiry collection)
        try {
            const strapiResponse = await fetch(`${STRAPI_URL}/api/inquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
                },
                body: JSON.stringify({
                    data: {
                        type: type === "transfer" ? "transfer" : "car-rental",
                        name,
                        email,
                        tourSlug: itemSlug,
                        tourTitle: `[${type.toUpperCase()}] ${itemTitle}`,
                        travelDate: date || null,
                        travelers: passengers || 1,
                        message: [
                            phone ? `Phone: ${phone}` : "",
                            type === "transfer" ? `Route: ${pickupLocation} → ${dropoffLocation}` : "",
                            returnDate ? `Return: ${returnDate}` : "",
                            message || "",
                        ].filter(Boolean).join(" | "),
                        status: "new",
                        source: "travel-rental",
                    },
                }),
            });

            if (!strapiResponse.ok) {
                const errorData = await strapiResponse.text();
                console.error("Strapi storage failed:", strapiResponse.status, errorData);
            } else {
                console.log("Rental inquiry saved to Strapi successfully");
            }
        } catch (strapiError) {
            console.error("Strapi connection error:", strapiError);
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
