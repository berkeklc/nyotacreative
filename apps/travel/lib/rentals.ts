import { fetchAPI, getStrapiMedia } from "./strapi";

export interface TransferRoute {
    name: string;
    slug: string;
    description: string;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    duration: string;
    price: number;
    priceReturn: number;
    vehicleType: string;
    image: string | null;
    featured: boolean;
}

export interface RentalVehicle {
    name: string;
    slug: string;
    description: string;
    category: string;
    transmission: string;
    seats: number;
    pricePerDay: number;
    pricePerWeek: number;
    features: string[];
    image: string | null;
    featured: boolean;
    available: boolean;
}

export interface RentalsData {
    transfers: TransferRoute[];
    vehicles: RentalVehicle[];
}

function toFeatureList(value: unknown) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function toNumber(value: unknown) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function mapTransfer(item: Record<string, unknown>): TransferRoute {
    const heroImage = item.heroImage as { url?: string } | undefined;
    return {
        name: typeof item.name === "string" ? item.name : "",
        slug: typeof item.slug === "string" ? item.slug : "",
        description: typeof item.description === "string" ? item.description : "",
        pickupLocation: typeof item.pickupLocation === "string" ? item.pickupLocation : "",
        dropoffLocation: typeof item.dropoffLocation === "string" ? item.dropoffLocation : "",
        distance: typeof item.distance === "string" ? item.distance : "",
        duration: typeof item.duration === "string" ? item.duration : "",
        price: toNumber(item.price),
        priceReturn: toNumber(item.priceReturn),
        vehicleType: typeof item.vehicleType === "string" ? item.vehicleType : "",
        image: getStrapiMedia(heroImage?.url),
        featured: item.featured === true,
    };
}

function mapVehicle(item: Record<string, unknown>): RentalVehicle {
    const heroImage = item.heroImage as { url?: string } | undefined;
    return {
        name: typeof item.name === "string" ? item.name : "",
        slug: typeof item.slug === "string" ? item.slug : "",
        description: typeof item.description === "string" ? item.description : "",
        category: typeof item.category === "string" ? item.category : "",
        transmission: typeof item.transmission === "string" ? item.transmission : "",
        seats: toNumber(item.seats),
        pricePerDay: toNumber(item.pricePerDay),
        pricePerWeek: toNumber(item.pricePerWeek),
        features: toFeatureList(item.features),
        image: getStrapiMedia(heroImage?.url),
        featured: item.featured === true,
        available: item.available === true,
    };
}

function getTransfersQuery(extra: Record<string, unknown> = {}) {
    return {
        ...extra,
        populate: ["heroImage"],
        pagination: { limit: 50 },
        sort: ["order:asc", "featured:desc"],
    };
}

function getVehiclesQuery(extra: Record<string, unknown> = {}) {
    return {
        ...extra,
        populate: ["heroImage"],
        pagination: { limit: 50 },
        sort: ["featured:desc", "pricePerDay:asc"],
    };
}

export async function getRentalsData(): Promise<RentalsData> {
    try {
        const [transfersRes, vehiclesRes] = await Promise.all([
            fetchAPI("/transfer-routes", getTransfersQuery(), { cache: "no-store", next: { revalidate: 0 } }),
            fetchAPI("/rental-vehicles", getVehiclesQuery(), { cache: "no-store", next: { revalidate: 0 } }),
        ]);

        let transfersRaw = Array.isArray(transfersRes?.data) ? transfersRes.data : [];
        let vehiclesRaw = Array.isArray(vehiclesRes?.data) ? vehiclesRes.data : [];

        // If drafts are present but not published, fall back to draft query.
        if (transfersRaw.length === 0) {
            const transfersDraftRes = await fetchAPI(
                "/transfer-routes",
                getTransfersQuery({ status: "draft" }),
                { cache: "no-store", next: { revalidate: 0 } }
            );
            const draftTransfersRaw = Array.isArray(transfersDraftRes?.data) ? transfersDraftRes.data : [];
            if (draftTransfersRaw.length > 0) transfersRaw = draftTransfersRaw;
        }

        if (vehiclesRaw.length === 0) {
            const vehiclesDraftRes = await fetchAPI(
                "/rental-vehicles",
                getVehiclesQuery({ status: "draft" }),
                { cache: "no-store", next: { revalidate: 0 } }
            );
            const draftVehiclesRaw = Array.isArray(vehiclesDraftRes?.data) ? vehiclesDraftRes.data : [];
            if (draftVehiclesRaw.length > 0) vehiclesRaw = draftVehiclesRaw;
        }

        return {
            transfers: transfersRaw.map((item: Record<string, unknown>) => mapTransfer(item)),
            vehicles: vehiclesRaw.map((item: Record<string, unknown>) => mapVehicle(item)),
        };
    } catch (error) {
        console.error("Rentals data fetch failed:", error);
        return { transfers: [], vehicles: [] };
    }
}

export async function getTransferBySlug(slug: string): Promise<TransferRoute | null> {
    try {
        let response = await fetchAPI("/transfer-routes", {
            filters: { slug: { $eq: slug } },
            populate: ["heroImage"],
            pagination: { limit: 1 },
        }, { cache: "no-store", next: { revalidate: 0 } });

        let transfer = Array.isArray(response?.data) ? response.data[0] : null;
        if (!transfer) {
            response = await fetchAPI("/transfer-routes", {
                status: "draft",
                filters: { slug: { $eq: slug } },
                populate: ["heroImage"],
                pagination: { limit: 1 },
            }, { cache: "no-store", next: { revalidate: 0 } });
            transfer = Array.isArray(response?.data) ? response.data[0] : null;
        }
        return transfer ? mapTransfer(transfer as Record<string, unknown>) : null;
    } catch (error) {
        console.error("Transfer fetch failed:", error);
        return null;
    }
}

export async function getVehicleBySlug(slug: string): Promise<RentalVehicle | null> {
    try {
        let response = await fetchAPI("/rental-vehicles", {
            filters: { slug: { $eq: slug } },
            populate: ["heroImage"],
            pagination: { limit: 1 },
        }, { cache: "no-store", next: { revalidate: 0 } });

        let vehicle = Array.isArray(response?.data) ? response.data[0] : null;
        if (!vehicle) {
            response = await fetchAPI("/rental-vehicles", {
                status: "draft",
                filters: { slug: { $eq: slug } },
                populate: ["heroImage"],
                pagination: { limit: 1 },
            }, { cache: "no-store", next: { revalidate: 0 } });
            vehicle = Array.isArray(response?.data) ? response.data[0] : null;
        }
        return vehicle ? mapVehicle(vehicle as Record<string, unknown>) : null;
    } catch (error) {
        console.error("Vehicle fetch failed:", error);
        return null;
    }
}
