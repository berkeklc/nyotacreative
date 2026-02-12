import qs from "qs";

const DEFAULT_STRAPI_PRODUCTION_URL = "https://cms-production-219a.up.railway.app";
const DEFAULT_STRAPI_DEVELOPMENT_URL = "http://127.0.0.1:1337";
let activeStrapiBaseUrl: string | null = null;

function isHttpUrl(value: string) {
    return /^https?:\/\//.test(value);
}

function normalizeBaseUrl(value: string) {
    return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getCandidateStrapiBaseUrls() {
    const serverConfiguredUrl = process.env.STRAPI_API_URL?.trim() || process.env.STRAPI_URL?.trim() || "";
    const publicConfiguredUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.trim() || "";
    const defaultByEnv = process.env.NODE_ENV === "production"
        ? DEFAULT_STRAPI_PRODUCTION_URL
        : DEFAULT_STRAPI_DEVELOPMENT_URL;
    const uniqueUrls = new Set<string>();

    for (const candidate of [serverConfiguredUrl, publicConfiguredUrl, defaultByEnv, DEFAULT_STRAPI_PRODUCTION_URL]) {
        if (isHttpUrl(candidate)) {
            uniqueUrls.add(normalizeBaseUrl(candidate));
        }
    }

    return Array.from(uniqueUrls);
}

function getPreferredStrapiBaseUrl() {
    if (activeStrapiBaseUrl) return activeStrapiBaseUrl;
    return getCandidateStrapiBaseUrls()[0] || normalizeBaseUrl(DEFAULT_STRAPI_PRODUCTION_URL);
}

export function getStrapiURL(path = "") {
    return `${getPreferredStrapiBaseUrl()}${path}`;
}

export function getStrapiMedia(url: string | null | undefined) {
    if (!url) return null;
    // Return the URL as is if it's already a full URL or a relative path that we handle
    if (url.startsWith("http") || url.startsWith("//")) return url;
    return getStrapiURL(url);
}

function buildFetchOptions(options: RequestInit, token: string, includeAuth: boolean): RequestInit {
    const additionalHeaders = options.headers && typeof options.headers === "object"
        ? options.headers
        : {};
    return {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
            ...additionalHeaders,
        },
    };
}

export async function fetchAPI(path: string, urlParamsObject = {}, options: RequestInit = {}) {
    const token = process.env.STRAPI_API_TOKEN?.trim() || "";
    const queryString = qs.stringify(urlParamsObject);
    const candidates = getCandidateStrapiBaseUrls();
    let lastError = "Unknown error";

    for (const baseUrl of candidates) {
        const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

        try {
            const authorizedResponse = await fetch(
                requestUrl,
                buildFetchOptions(options, token, true)
            );

            if (authorizedResponse.ok) {
                activeStrapiBaseUrl = baseUrl;
                return await authorizedResponse.json();
            }

            if ((authorizedResponse.status === 401 || authorizedResponse.status === 403) && token) {
                const anonymousResponse = await fetch(
                    requestUrl,
                    buildFetchOptions(options, token, false)
                );
                if (anonymousResponse.ok) {
                    activeStrapiBaseUrl = baseUrl;
                    return await anonymousResponse.json();
                }
                lastError = `${anonymousResponse.status} ${anonymousResponse.statusText}`;
                continue;
            }

            lastError = `${authorizedResponse.status} ${authorizedResponse.statusText}`;
        } catch (error) {
            lastError = error instanceof Error ? error.message : "Network error";
        }
    }

    console.error(`[Strapi] Fetch Error (${path}):`, lastError);
    return { data: null, error: lastError };
}
