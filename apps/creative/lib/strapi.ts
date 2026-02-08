import qs from "qs";

export function getStrapiURL(path = "") {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app"
        }${path}`;
}

export function getStrapiMedia(url: string | null | undefined) {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("//")) return url;
    return getStrapiURL(url);
}

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    try {
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            ...options,
        };

        const queryString = qs.stringify(urlParamsObject);
        const requestUrl = `${getStrapiURL(
            `/api${path}`
        )}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(response.statusText);
            console.warn("Strapi fetch failed, returning null");
            return { data: null };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { data: null };
    }
}

// Projects
export async function getProjects() {
    const data = await fetchAPI("/projects", {
        populate: ["heroImage", "services"],
        sort: ["featured:desc", "completedAt:desc"],
        filters: { publishedAt: { $notNull: true } },
    });
    return data?.data || [];
}

export async function getProject(slug: string) {
    const data = await fetchAPI("/projects", {
        filters: { slug: { $eq: slug } },
        populate: ["heroImage", "gallery", "services", "testimonial"],
    });
    return data?.data?.[0] || null;
}

// Services
export async function getServices() {
    const data = await fetchAPI("/services", {
        populate: ["icon", "projects"],
        sort: ["order:asc"],
        filters: { publishedAt: { $notNull: true } },
    });
    return data?.data || [];
}

export async function getService(slug: string) {
    const data = await fetchAPI("/services", {
        filters: { slug: { $eq: slug } },
        populate: ["icon", "projects.heroImage"],
    });
    return data?.data?.[0] || null;
}

