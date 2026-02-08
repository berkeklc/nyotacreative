import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("-----------------------------------------");
        console.log("New Contact Form Submission!");
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Company: ${company || "N/A"}`);
        console.log(`Message: ${message}`);
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
                        type: "contact",
                        name,
                        email,
                        company: company || "",
                        message,
                        status: "new",
                        source: "creative",
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
            message: "Thank you! We will be in touch shortly."
        });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
