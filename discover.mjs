import fetch from 'node-fetch';

const STRAPI_URL = "https://cms-production-219a.up.railway.app";
const STRAPI_TOKEN = "17c23ba54b4b847dfecb09704ce8d147be3b36e7eea1ae07f803d74430e09cadb0c69d5729ccab2acf4e6b56e21ab8418d6656895b181c1da7363f2b13bf195516863396c371a1b5e03f35f717fab4f7d4cff3c460e9af0c96045d9b222ab956c3e9447978f76eaf5b0d291b311081b8d7bc81be54100b0dc8b7cb3d0ecb669b";

const headers = {
    'Authorization': `Bearer ${STRAPI_TOKEN}`
};

async function check(path) {
    try {
        const res = await fetch(`${STRAPI_URL}/api${path}`, { headers });
        console.log(`[${res.status}] GET ${path}`);
    } catch (e) {
        console.log(`[Error] GET ${path}: ${e.message}`);
    }
}

async function discover() {
    console.log("Deep Discovery...");
    const types = [
        'articles', 'articles', 'article',
        'attractions', 'attraction',
        'authors', 'author',
        'cities', 'city',
        'destinations', 'destination',
        'hotels', 'hotel',
        'projects', 'project',
        'services', 'service',
        'team-members', 'team-member',
        'tours', 'tour',
        'users'
    ];
    for (const type of types) {
        await check(`/${type}`);
    }
}

discover();
