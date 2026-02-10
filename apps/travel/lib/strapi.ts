import qs from "qs";

const DEFAULT_STRAPI_URL = "https://cms-production-219a.up.railway.app";

export function getStrapiURL(path = "") {
    const configuredBaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.trim() || "";
    const baseUrl = /^https?:\/\//.test(configuredBaseUrl) ? configuredBaseUrl : DEFAULT_STRAPI_URL;
    // Remove trailing slash if present
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${path}`;
}

export function getStrapiMedia(url: string | null | undefined) {
    if (!url) return null;
    // Return the URL as is if it's already a full URL or a relative path that we handle
    if (url.startsWith("http") || url.startsWith("//")) return url;
    return getStrapiURL(url);
}

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    try {
        const token = process.env.STRAPI_API_TOKEN?.trim();
        if (!token) {
            console.error("STRAPI_API_TOKEN is missing in environment variables!");
        }

        // Merge default and user options
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...options,
        };

        // Build request URL
        const queryString = qs.stringify(urlParamsObject);
        const requestUrl = `${getStrapiURL(
            `/api${path}`
        )}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        // Handle response
        if (!response.ok) {
            console.error(`Strapi fetch failed: ${response.status} ${response.statusText}`);
            return { data: null, error: response.statusText };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[Strapi] Fetch Error:", error);
        return { data: null, error: "Internal Fetch Error" };
    }
}
