import { NextResponse } from "next/server";
import { getHomePageData } from "../../../lib/homepage";

export async function GET() {
    const data = await getHomePageData();
    return NextResponse.json(data);
}
