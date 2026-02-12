import qs from "qs";

type StrapiFetchOptions = RequestInit & {
    next?: {
        revalidate?: number;
        tags?: string[];
    };
};

const DEFAULT_STRAPI_URL = "https://cms-production-219a.up.railway.app";
const STRAPI_CACHE_TAG = "strapi";

function parseRevalidateSeconds(value: string | undefined, fallback: number) {
    if (!value) return fallback;
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) return fallback;
    return Math.floor(parsedValue);
}

const DEFAULT_REVALIDATE_SECONDS = parseRevalidateSeconds(
    process.env.STRAPI_REVALIDATE_SECONDS,
    60
);

function getBaseStrapiURL() {
    const rawBaseUrl = (
        process.env.STRAPI_API_URL ||
        process.env.STRAPI_URL ||
        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
        DEFAULT_STRAPI_URL
    ).trim();

    return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
}

export function getStrapiURL(path = "") {
    return `${getBaseStrapiURL()}${path}`;
}

function appendVersionQuery(url: string, versionToken?: string | number | null) {
    if (versionToken === null || versionToken === undefined || versionToken === "") return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${encodeURIComponent(String(versionToken))}`;
}

export function getStrapiMedia(
    url: string | null | undefined,
    versionToken?: string | number | null
) {
    if (!url) return null;
    const mediaUrl = url.startsWith("http") || url.startsWith("//")
        ? url
        : getStrapiURL(url);
    return appendVersionQuery(mediaUrl, versionToken);
}

function buildNextOptions(options: StrapiFetchOptions) {
    const nextOptions = options.next || {};
    const optionTags = Array.isArray(nextOptions.tags) ? nextOptions.tags : [];
    const tags = Array.from(new Set([STRAPI_CACHE_TAG, ...optionTags]));

    if (options.cache === "no-store") {
        return {
            ...nextOptions,
            tags,
        };
    }

    return {
        ...nextOptions,
        revalidate: typeof nextOptions.revalidate === "number"
            ? nextOptions.revalidate
            : DEFAULT_REVALIDATE_SECONDS,
        tags,
    };
}

export async function fetchAPI(
    path: string,
    urlParamsObject = {},
    options: StrapiFetchOptions = {}
) {
    try {
        const token = process.env.STRAPI_API_TOKEN;
        const headers = new Headers(options.headers);
        headers.set("Content-Type", "application/json");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const mergedOptions = {
            ...options,
            headers,
            next: buildNextOptions(options),
        };

        const queryString = qs.stringify(urlParamsObject);
        const requestUrl = `${getStrapiURL(
            `/api${path}`
        )}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(`Strapi request failed (${response.status}): ${response.statusText}`);
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
        pagination: { limit: 100 },
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
        pagination: { limit: 100 },
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
