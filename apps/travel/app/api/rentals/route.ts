import { NextResponse } from "next/server";
import { fetchAPI, getStrapiMedia } from "../../../lib/strapi";

export async function GET() {
    try {
        // Try fetching from Strapi — these might not exist yet
        let transfers: any[] = [];
        let vehicles: any[] = [];

        try {
            const transfersRes = await fetchAPI("/transfer-routes", {
                populate: ["heroImage"],
                pagination: { limit: 50 },
                sort: ["order:asc", "featured:desc"],
            });

            const cmsTransfers = transfersRes?.data || [];
            if (cmsTransfers.length > 0) {
                transfers = cmsTransfers.map((t: any) => ({
                    name: t.name || "",
                    slug: t.slug || "",
                    pickupLocation: t.pickupLocation || "",
                    dropoffLocation: t.dropoffLocation || "",
                    distance: t.distance || "",
                    duration: t.duration || "",
                    price: t.price || 0,
                    priceReturn: t.priceReturn || 0,
                    vehicleType: t.vehicleType || "",
                    image: getStrapiMedia(t.heroImage?.url),
                    featured: t.featured || false,
                }));
            }
        } catch {
            console.log("[Rentals API] transfer-routes collection not found, using fallback");
        }

        try {
            const vehiclesRes = await fetchAPI("/rental-vehicles", {
                populate: ["heroImage"],
                pagination: { limit: 50 },
                sort: ["featured:desc", "pricePerDay:asc"],
            });

            const cmsVehicles = vehiclesRes?.data || [];
            if (cmsVehicles.length > 0) {
                vehicles = cmsVehicles.map((v: any) => ({
                    name: v.name || "",
                    slug: v.slug || "",
                    category: v.category || "sedan",
                    transmission: v.transmission || "manual",
                    seats: v.seats || 4,
                    pricePerDay: v.pricePerDay || 0,
                    pricePerWeek: v.pricePerWeek || 0,
                    features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
                    image: getStrapiMedia(v.heroImage?.url),
                    featured: v.featured || false,
                    available: v.available !== false,
                }));
            }
        } catch {
            console.log("[Rentals API] rental-vehicles collection not found, using fallback");
        }

        return NextResponse.json({ transfers, vehicles });
    } catch (error) {
        console.error("Rentals API error:", error);
        return NextResponse.json({ transfers: [], vehicles: [] }, { status: 500 });
    }
}
