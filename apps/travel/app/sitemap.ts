import { MetadataRoute } from "next";
import { fetchAPI } from "../lib/strapi";

const BASE_URL = "https://rushzanzibar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        "",
        "/about",
        "/contact",
        "/tours",
        "/tanzania",
        "/hotels",
        "/guides",
        "/rentals",
        "/privacy",
        "/terms",
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Fetch dynamic routes
    // 1. Cities (from /tanzania/[city])
    let cities: any[] = [];
    try {
        const citiesRes = await fetchAPI("/cities", {
            populate: ["destination"]
        });
        cities = citiesRes?.data || [];
    } catch (error) {
        console.error("Error fetching cities for sitemap:", error);
    }

    const cityRoutes = cities.map((city: any) => ({
        url: `${BASE_URL}/tanzania/${city.slug}`,
        lastModified: city.updatedAt || new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // 2. Tours (from /tours/[slug])
    let tours: any[] = [];
    try {
        const toursRes = await fetchAPI("/tours", {});
        tours = toursRes?.data || [];
    } catch (error) {
        console.error("Error fetching tours for sitemap:", error);
    }

    const tourRoutes = tours.map((tour: any) => ({
        url: `${BASE_URL}/tours/${tour.slug}`,
        lastModified: tour.updatedAt || new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // 3. Transfer routes & Rental vehicles
    let transferRoutes: any[] = [];
    let vehicleRoutes: any[] = [];
    try {
        const transfersRes = await fetchAPI("/transfer-routes", {});
        const transfers = transfersRes?.data || [];
        transferRoutes = transfers.map((t: any) => ({
            url: `${BASE_URL}/rentals/transfers/${t.slug}`,
            lastModified: t.updatedAt || new Date().toISOString(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch {
        // Content type may not exist yet
    }

    try {
        const vehiclesRes = await fetchAPI("/rental-vehicles", {});
        const vehicles = vehiclesRes?.data || [];
        vehicleRoutes = vehicles.map((v: any) => ({
            url: `${BASE_URL}/rentals/vehicles/${v.slug}`,
            lastModified: v.updatedAt || new Date().toISOString(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch {
        // Content type may not exist yet
    }

    return [...routes, ...cityRoutes, ...tourRoutes, ...transferRoutes, ...vehicleRoutes];
}
