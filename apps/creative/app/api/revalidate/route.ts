import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const DEFAULT_TAG = "strapi";

function getSecret(request: NextRequest, bodySecret: unknown) {
    const querySecret = request.nextUrl.searchParams.get("secret");
    const headerSecret = request.headers.get("x-revalidate-secret");
    const payloadSecret = typeof bodySecret === "string" ? bodySecret.trim() : "";
    return querySecret || headerSecret || payloadSecret;
}

function normalizeStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function POST(request: NextRequest) {
    let body: Record<string, unknown> = {};

    try {
        body = await request.json() as Record<string, unknown>;
    } catch {
        // Empty or non-JSON body is fine, we still support query/header secret.
    }

    const providedSecret = getSecret(request, body.secret);
    if (!REVALIDATE_SECRET || providedSecret !== REVALIDATE_SECRET) {
        return NextResponse.json(
            { revalidated: false, error: "Invalid revalidation secret." },
            { status: 401 }
        );
    }

    const customTags = normalizeStringArray(body.tags);
    const paths = normalizeStringArray(body.paths);
    const tags = Array.from(new Set([DEFAULT_TAG, ...customTags]));

    tags.forEach((tag) => revalidateTag(tag));
    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({
        revalidated: true,
        tags,
        paths,
        timestamp: new Date().toISOString(),
    });
}
