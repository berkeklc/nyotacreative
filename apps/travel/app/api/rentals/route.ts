import { NextResponse } from "next/server";
import { getRentalsData } from "../../../lib/rentals";

export async function GET() {
    const data = await getRentalsData();
    return NextResponse.json(data);
}
