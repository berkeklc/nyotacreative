import qs from "qs";

export function getStrapiURL(path = "") {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://cms-production-219a.up.railway.app"
        }${path}`;
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
