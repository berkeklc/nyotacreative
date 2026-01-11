import fetch from 'node-fetch';

const STRAPI_URL = "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = "17c23ba54b4b847dfecb09704ce8d147be3b36e7eea1ae07f803d74430e09cadb0c69d5729ccab2acf4e6b56e21ab8418d6656895b181c1da7363f2b13bf195516863396c371a1b5e03f35f717fab4f7d4cff3c460e9af0c96045d9b222ab956c3e9447978f76eaf5b0d291b311081b8d7bc81be54100b0dc8b7cb3d0ecb669b";

const headers = {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
};

async function post(path, data) {
    try {
        const res = await fetch(`${STRAPI_URL}/api${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data })
        });
        const json = await res.json();
        console.log(`[${res.status}] Created ${path}: ${data.title}`);
        return json.data;
    } catch (e) {
        return null;
    }
}

async function populate() {
    console.log("✦ Injecting Premium Local Insights...");

    await post('/articles', {
        title: "Dar es Salaam: 5 Best Seafood Spots in Kivukoni",
        slug: "dar-seafood-guide",
        content: "From the raw energy of the Fish Market to the refined plates at Samaki-Samaki, here is where to find the freshest catch of the Indian Ocean.",
        category: "food-drink",
        featured: true,
        readTime: 5
    });

    await post('/articles', {
        title: "Tipping Etiquette in Tanzania: A Local's Advice",
        slug: "tanzania-tipping-guide",
        content: "Understanding how much to tip your safari guide, lodge staff, and transfer drivers is key to a smooth journey. General rule: $10-15 per day for guides.",
        category: "tips",
        featured: true,
        readTime: 4
    });

    await post('/articles', {
        title: "Top 3 Day Trips from Dar es Salaam",
        slug: "dar-day-trips",
        content: "Need an escape from the heat? Bongoyo Island, Mbudya, and the Bagamoyo historical ruins are just a short trip away.",
        category: "adventure",
        featured: true,
        readTime: 7
    });

    await post('/articles', {
        title: "The Best Time for a Zanzibar Honeymoon",
        slug: "zanzibar-honeymoon-timing",
        content: "Avoid the long rains of April and May. June to October offers cool breezes and clear skies—the peak of romantic luxury.",
        category: "beaches",
        featured: true,
        readTime: 6
    });

    console.log("✦ Local Insights Injection Complete.");
}

populate();
