import fetch from 'node-fetch';

const STRAPI_URL = "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = "17c23ba54b4b847dfecb09704ce8d147be3b36e7eea1ae07f803d74430e09cadb0c69d5729ccab2acf4e6b56e21ab8418d6656895b181c1da7363f2b13bf195516863396c371a1b5e03f35f717fab4f7d4cff3c460e9af0c96045d9b222ab956c3e9447978f76eaf5b0d291b311081b8d7bc81be54100b0dc8b7cb3d0ecb669b";

const headers = {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
};

async function get(path, slug) {
    try {
        const res = await fetch(`${STRAPI_URL}/api${path}?filters[slug][$eq]=${slug}`, {
            method: 'GET',
            headers
        });
        const json = await res.json();
        return json.data?.[0];
    } catch (e) {
        return null;
    }
}

async function post(path, data) {
    try {
        const existing = await get(path, data.slug);
        const method = existing ? 'PUT' : 'POST';
        const url = existing ? `${STRAPI_URL}/api${path}/${existing.documentId}` : `${STRAPI_URL}/api${path}`;

        const res = await fetch(url, {
            method,
            headers,
            body: JSON.stringify({ data })
        });

        const json = await res.json();
        if (!res.ok) {
            console.error(`[Error] ${path} -> ${data.slug}:`, res.status, JSON.stringify(json, null, 2));
            return null;
        }
        console.log(`[${method === 'PUT' ? 'Updated' : 'Created'}] ${path} -> ${data.title || data.name}`);
        return json.data;
    } catch (e) {
        console.error(`[Fatal] ${path} -> ${data.slug}:`, e.message);
        return null;
    }
}

async function populate() {
    console.log("✦ Starting High-Fidelity Content Population...");

    // 1. Destination: Tanzania
    const tanzania = await post('/destinations', {
        name: "Tanzania",
        slug: "tanzania",
        description: "The crown jewel of East African safaris. From the snow-capped peak of Kilimanjaro to the endless plains of the Serengeti and the white sands of Zanzibar.",
        quickFacts: {
            population: "63 Million",
            language: "Swahili, English",
            currency: "Tanzanian Shilling (TZS)",
            bestTimeToVisit: "June - October (Dry Season)",
            timezone: "GMT+3",
            avgTemperature: "25°C - 30°C"
        }
    });

    // 2. Cities / Regions
    const cities = [
        { name: "Zanzibar", slug: "zanzibar", description: "The legendary Spice Island, home to Stone Town and the world's most beautiful beaches.", destination: tanzania?.id },
        { name: "Dar es Salaam", slug: "dar-es-salaam", description: "Tanzania's commercial heart, a vibrant coastal metropolis blending tradition and modern energy.", destination: tanzania?.id },
        { name: "Serengeti", slug: "serengeti", description: "One of the Seven Natural Wonders of Africa, famous for the Great Migration.", destination: tanzania?.id },
        { name: "Kilimanjaro", slug: "kilimanjaro", description: "The roof of Africa, the world's highest free-standing mountain.", destination: tanzania?.id },
        { name: "Ngorongoro", slug: "ngorongoro", description: "A pristine volcanic caldera containing a dense, permanent population of over 25,000 large mammals.", destination: tanzania?.id },
        { name: "Arusha", slug: "arusha", description: "The green oasis at the base of Mt. Meru, the starting point for every great safari.", destination: tanzania?.id }
    ];

    const cityMap = {};
    for (const city of cities) {
        const c = await post('/cities', city);
        if (c) cityMap[city.slug] = c;
    }

    // 3. Tours (Signature Experiences)
    const tours = [
        { name: "7-Day Serengeti Great Migration Safari", slug: "serengeti-migration", duration: "7 Days", priceAdult: 2850, featured: true, city: cityMap['serengeti']?.id },
        { name: "Kilimanjaro Climb: Machame Route", slug: "kilimanjaro-climb", duration: "7 Days", priceAdult: 2100, featured: true, city: cityMap['kilimanjaro']?.id },
        { name: "Stone Town Historical Walking Tour", slug: "stone-town-walk", duration: "3 Hours", priceAdult: 45, featured: false, city: cityMap['zanzibar']?.id },
        { name: "Private Dar es Salaam Evening Cruise", slug: "dar-cruise", duration: "4 Hours", priceAdult: 120, featured: true, city: cityMap['dar-es-salaam']?.id },
        { name: "Luxury Ngorongoro Crater Lodge Stay", slug: "ngorongoro-luxury", duration: "2 Days", priceAdult: 1450, featured: true, city: cityMap['ngorongoro']?.id },
        { name: "Zanzibar Spice & Sand Experience", slug: "zanzibar-spice-sand", duration: "Full Day", priceAdult: 95, featured: true, city: cityMap['zanzibar']?.id }
    ];

    for (const tour of tours) {
        await post('/tours', tour);
    }

    // 4. Articles (Local Insights)
    const articles = [
        { title: "Safari Packing List: What Every Traveller Needs", slug: "safari-packing-list", category: "tips", featured: true, readTime: 8, content: "Packing for a safari requires careful consideration of colors, layers, and gear. Neutral tones like khaki and olive are essential..." },
        { title: "The Ultimate Guide to Stone Town's Culinary Scene", slug: "stone-town-food-guide", category: "food-drink", featured: true, readTime: 6, content: "From the Forodhani Night Market to the hidden tea houses, Stone Town is a feast for the senses." },
        { title: "Tipping Etiquette in Tanzania", slug: "tanzania-tipping-guide", category: "tips", featured: false, readTime: 5, content: "A guide on how to reward the incredible guides and hospitality staff who make your journey possible." }
    ];

    for (const article of articles) {
        await post('/articles', article);
    }

    console.log("✦ Population Complete. Nyota Travel is now RICH with content!");
}

populate().catch(console.error);
