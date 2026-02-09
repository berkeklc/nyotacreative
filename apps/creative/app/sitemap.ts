import { MetadataRoute } from "next";

const BASE_URL = "https://nyotacreative.com";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${BASE_URL}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/work`,
            lastModified: new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/services`,
            lastModified: new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date().toISOString(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
