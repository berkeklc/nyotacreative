import { fetchAPI, getStrapiMedia } from "./strapi";

export interface Tour {
    title: string;
    slug: string;
    duration: string;
    price: number;
    image: string | null;
    category?: string;
}

export interface Destination {
    name: string;
    slug: string;
    tagline: string;
    image: string | null;
}

export interface Article {
    title: string;
    slug: string;
    category: string;
    author: string;
    date: string;
    image: string | null;
}

export interface Transfer {
    name: string;
    slug: string;
    pickupLocation: string;
    dropoffLocation: string;
    duration: string;
    price: number;
}

export interface HomePageData {
    destinations: Destination[];
    tours: Tour[];
    articles: Article[];
    transfers: Transfer[];
}

function toDateLabel(value: unknown) {
    if (!value || typeof value !== "string") return "";
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function stripHtml(value: unknown) {
    if (typeof value !== "string") return "";
    return value.replace(/<[^>]*>/g, "").trim();
}

export async function getHomePageData(): Promise<HomePageData> {
    try {
        let transfersData: Record<string, unknown>[] = [];
        try {
            const transfersRes = await fetchAPI("/transfer-routes", {
                populate: ["heroImage"],
                pagination: { limit: 4 },
                sort: ["featured:desc", "order:asc"],
            });
            transfersData = Array.isArray(transfersRes?.data) ? transfersRes.data : [];
        } catch {
            transfersData = [];
        }

        const [articlesRes, destinationsRes, toursRes] = await Promise.all([
            fetchAPI("/articles", {
                populate: ["heroImage", "author"],
                pagination: { limit: 6 },
                sort: ["publishedAt:desc"],
            }),
            fetchAPI("/destinations", {
                populate: ["heroImage"],
                pagination: { limit: 6 },
            }),
            fetchAPI("/tours", {
                populate: ["heroImage", "city"],
                pagination: { limit: 8 },
            }),
        ]);

        const cmsArticles = Array.isArray(articlesRes?.data) ? articlesRes.data : [];
        const cmsDestinations = Array.isArray(destinationsRes?.data) ? destinationsRes.data : [];
        const cmsTours = Array.isArray(toursRes?.data) ? toursRes.data : [];

        const destinations: Destination[] = cmsDestinations.map((item: Record<string, unknown>) => {
            const heroImage = item.heroImage as { url?: string } | undefined;
            const descriptionText = stripHtml(item.description);
            return {
                name: typeof item.name === "string" ? item.name : "",
                slug: typeof item.slug === "string" ? item.slug : "",
                tagline: descriptionText
                    ? `${descriptionText.slice(0, 100)}${descriptionText.length > 100 ? "..." : ""}`
                    : "",
                image: getStrapiMedia(heroImage?.url),
            };
        });

        const tours: Tour[] = cmsTours.map((item: Record<string, unknown>) => {
            const heroImage = item.heroImage as { url?: string } | undefined;
            return {
                title: typeof item.name === "string" ? item.name : "",
                slug: typeof item.slug === "string" ? item.slug : "",
                duration: typeof item.duration === "string" ? item.duration : "",
                price: Number(item.priceAdult || 0),
                image: getStrapiMedia(heroImage?.url),
                category: typeof item.category === "string" ? item.category : "",
            };
        });

        const articles: Article[] = cmsArticles.map((item: Record<string, unknown>) => {
            const heroImage = item.heroImage as { url?: string } | undefined;
            const author = item.author as { name?: string } | undefined;
            return {
                title: typeof item.title === "string" ? item.title : "",
                slug: typeof item.slug === "string" ? item.slug : "",
                category: typeof item.category === "string" ? item.category.replace("-", " ") : "",
                author: typeof author?.name === "string" ? author.name : "",
                date: toDateLabel(item.publishedAt),
                image: getStrapiMedia(heroImage?.url),
            };
        });

        const transfers: Transfer[] = transfersData.map((item) => ({
            name: typeof item.name === "string" ? item.name : "",
            slug: typeof item.slug === "string" ? item.slug : "",
            pickupLocation: typeof item.pickupLocation === "string" ? item.pickupLocation : "",
            dropoffLocation: typeof item.dropoffLocation === "string" ? item.dropoffLocation : "",
            duration: typeof item.duration === "string" ? item.duration : "",
            price: Number(item.price || 0),
        }));

        return { destinations, tours, articles, transfers };
    } catch (error) {
        console.error("Homepage data fetch failed:", error);
        return { destinations: [], tours: [], articles: [], transfers: [] };
    }
}
