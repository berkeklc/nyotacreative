import { MetadataRoute } from "next";
import { getProjects, getServices } from "../lib/strapi";

const BASE_URL = "https://nyotacreative.com";

interface SlugEntity {
    slug?: string;
    updatedAt?: string;
}

function toDate(value?: string) {
    return value ? new Date(value).toISOString() : new Date().toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projects, services] = await Promise.all([getProjects(), getServices()]);

    const staticRoutes: MetadataRoute.Sitemap = [
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
            url: `${BASE_URL}/about`,
            lastModified: new Date().toISOString(),
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date().toISOString(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    const projectRoutes: MetadataRoute.Sitemap = (projects as SlugEntity[])
        .filter((project) => typeof project?.slug === "string" && project.slug.length > 0)
        .map((project) => ({
            url: `${BASE_URL}/work/${project.slug}`,
            lastModified: toDate(project.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));

    const serviceRoutes: MetadataRoute.Sitemap = (services as SlugEntity[])
        .filter((service) => typeof service?.slug === "string" && service.slug.length > 0)
        .map((service) => ({
            url: `${BASE_URL}/services/${service.slug}`,
            lastModified: toDate(service.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));

    return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
