import { NextResponse } from "next/server";
import { fetchAPI } from "../../../lib/strapi";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Aggregated search across Destinations, Articles, and potentially Tours
        // Note: We search by name/title containing the query string

        const [destinations, articles] = await Promise.all([
            fetchAPI("/destinations", {
                filters: {
                    name: { $contains: query },
                },
            }),
            fetchAPI("/articles", {
                filters: {
                    title: { $contains: query },
                },
            }),
        ]);

        const results = [
            ...(destinations?.data || []).map((d: any) => ({
                type: "destination",
                title: d.name,
                slug: `/tanzania/${d.slug}`,
                description: d.description,
            })),
            ...(articles?.data || []).map((a: any) => ({
                type: "guide",
                title: a.title,
                slug: `/guides/${a.slug}`,
                description: "Travel Guide",
            })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }
}
