import { NextResponse } from "next/server";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";

export async function GET() {
    try {
        const [articlesRes, destinationsRes, toursRes] = await Promise.all([
            fetchAPI("/articles", {
                populate: ["heroImage", "author"],
                pagination: { limit: 6 },
                sort: ["publishedAt:desc"]
            }),
            fetchAPI("/destinations", {
                populate: ["heroImage"],
                pagination: { limit: 6 }
            }),
            fetchAPI("/tours", {
                populate: ["heroImage", "city"],
                pagination: { limit: 8 }
            }),
        ]);

        const cmsArticles = articlesRes?.data || [];
        const cmsDestinations = destinationsRes?.data || [];
        const cmsTours = toursRes?.data || [];

        const destinations = cmsDestinations.map((d: any) => {
            const descriptionText = d.description
                ? String(d.description).replace(/<[^>]*>/g, '').trim()
                : '';
            const tagline = descriptionText
                ? (descriptionText.slice(0, 100) + (descriptionText.length > 100 ? "..." : ""))
                : "";

            return {
                name: d.name || "",
                slug: d.slug || "",
                tagline: tagline,
                image: getStrapiMedia(d.heroImage?.url)
            };
        });

        const tours = cmsTours.map((t: any) => ({
            title: t.name || "",
            slug: t.slug || "",
            duration: t.duration || "",
            price: t.priceAdult || 0,
            image: getStrapiMedia(t.heroImage?.url),
            category: t.category || ""
        }));

        const articles = cmsArticles.map((a: any) => ({
            title: a.title || "",
            slug: a.slug || "",
            category: a.category?.replace('-', ' ') || "",
            author: a.author?.name || "",
            date: a.publishedAt
                ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : "",
            image: getStrapiMedia(a.heroImage?.url)
        }));

        return NextResponse.json({ destinations, tours, articles });
    } catch (error) {
        console.error("Homepage API error:", error);
        return NextResponse.json({ destinations: [], tours: [], articles: [] }, { status: 500 });
    }
}
