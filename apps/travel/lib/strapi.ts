import qs from "qs";

export function getStrapiURL(path = "") {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app";
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
        // Merge default and user options
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
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
