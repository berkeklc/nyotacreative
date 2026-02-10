import { MetadataRoute } from "next";
import { fetchAPI } from "../lib/strapi";

const BASE_URL = "https://rushzanzibar.com";
const PAGE_LIMIT = 100;

interface SitemapItem {
    slug?: string;
    updatedAt?: string;
}

function toDate(value?: string) {
    return value ? new Date(value).toISOString() : new Date().toISOString();
}

async function fetchAllItems(path: string): Promise<SitemapItem[]> {
    const items: SitemapItem[] = [];
    let start = 0;

    while (true) {
        const response = await fetchAPI(path, {
            fields: ["slug", "updatedAt"],
            pagination: { start, limit: PAGE_LIMIT },
        });

        const batch = Array.isArray(response?.data) ? (response.data as SitemapItem[]) : [];
        if (batch.length === 0) {
            break;
        }

        items.push(...batch);
        if (batch.length < PAGE_LIMIT) {
            break;
        }
        start += PAGE_LIMIT;
    }

    return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
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

    const [cities, tours, transferRoutes, vehicles] = await Promise.all([
        fetchAllItems("/cities").catch(() => []),
        fetchAllItems("/tours").catch(() => []),
        fetchAllItems("/transfer-routes").catch(() => []),
        fetchAllItems("/rental-vehicles").catch(() => []),
    ]);

    const cityRoutes = cities
        .filter((city) => typeof city.slug === "string" && city.slug.length > 0)
        .map((city) => ({
            url: `${BASE_URL}/tanzania/${city.slug}`,
            lastModified: toDate(city.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    const tourRoutes = tours
        .filter((tour) => typeof tour.slug === "string" && tour.slug.length > 0)
        .map((tour) => ({
            url: `${BASE_URL}/tours/${tour.slug}`,
            lastModified: toDate(tour.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    const transferSitemapRoutes = transferRoutes
        .filter((route) => typeof route.slug === "string" && route.slug.length > 0)
        .map((route) => ({
            url: `${BASE_URL}/rentals/transfers/${route.slug}`,
            lastModified: toDate(route.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

    const vehicleRoutes = vehicles
        .filter((vehicle) => typeof vehicle.slug === "string" && vehicle.slug.length > 0)
        .map((vehicle) => ({
            url: `${BASE_URL}/rentals/vehicles/${vehicle.slug}`,
            lastModified: toDate(vehicle.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

    return [...staticRoutes, ...cityRoutes, ...tourRoutes, ...transferSitemapRoutes, ...vehicleRoutes];
}
