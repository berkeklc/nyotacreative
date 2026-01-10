import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, tourSlug, date, travelers, message } = body;

        // Validation
        if (!name || !email || !tourSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // In a production app, we would use a service like Resend, SendGrid, or AWS SES here.
        // For now, we simulate the email sending by logging to the console.

        console.log("-----------------------------------------");
        console.log("New Booking Inquiry Received!");
        console.log(`Tour: ${tourSlug}`);
        console.log(`Customer: ${name} (${email})`);
        console.log(`Preferred Date: ${date}`);
        console.log(`Travelers: ${travelers}`);
        console.log(`Message: ${message || "N/A"}`);
        console.log("-----------------------------------------");

        // Simulate database storage or queuing
        // await db.inquiries.create({ data: body });

        return NextResponse.json({
            success: true,
            message: "Thank you! Your inquiry has been received. We will contact you shortly."
        });
    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
