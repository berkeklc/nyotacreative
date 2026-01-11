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
    console.log("✦ Injecting EVEN MORE Premium Content...");

    const articles = [
        {
            title: "The Heart of Dar es Salaam: Why You Should Visit Kivukoni",
            slug: "dar-es-salaam-kivukoni-guide",
            content: "Beyond the skyscrapers, Dar es Salaam's soul is found at its shoreline. Kivukoni is not just a fish market; it's a testament to the city's relationship with the Indian Ocean. Arrive at 6 AM to see the dhows come in...",
            category: "culture",
            featured: true,
            readTime: 6
        },
        {
            title: "Zanzibar Spice Tour: What to Expect",
            slug: "zanzibar-spice-tour-guide",
            content: "You haven't visited the Spice Islands until you've tasted raw cinnamon and smelled fresh cloves. Our guide takes you through the plantations of Kidichi...",
            category: "food-drink",
            featured: true,
            readTime: 5
        },
        {
            title: "10 Essential Swahili Phrases for Your Tanzania Safari",
            slug: "essential-swahili-phrases",
            content: "Habari gani? Karibu! Asante sana. Learn the basics to connect with locals during your journey. 'Jambo' is just the beginning...",
            category: "tips",
            featured: true,
            readTime: 4
        },
        {
            title: "Serengeti vs. Ngorongoro: Choosing Your Safari",
            slug: "serengeti-vs-ngorongoro",
            content: "The endless plains or the volcanic crater? While the Serengeti offers scale and migration, the Ngorongoro Crater provides unmatched density. We recommend both, but here is how they differ...",
            category: "adventure",
            featured: true,
            readTime: 8
        },
        {
            title: "Sustainable Travel: Supporting Local Artisans in Arusha",
            slug: "arusha-artisan-guide",
            content: "From the Shanga glass factory to the Cultural Heritage Centre, Arusha is a hub for Tanzanian craftsmanship. Here is how your visit can make a difference.",
            category: "culture",
            featured: false,
            readTime: 7
        }
    ];

    for (const article of articles) {
        await post('/articles', article);
    }

    console.log("✦ Massive Article Injection Complete.");
}

populate();
