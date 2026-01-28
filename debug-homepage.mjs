const API_URL = "https://cms-production-219a.up.railway.app/api";
const TOKEN = "17c23ba54b4b847dfecb09704ce8d147be3b36e7eea1ae07f803d74430e09cadb0c69d5729ccab2acf4e6b56e21ab8418d6656895b181c1da7363f2b13bf195516863396c371a1b5e03f35f717fab4f7d4cff3c460e9af0c96045d9b222ab956c3e9447978f76eaf5b0d291b311081b8d7bc81be54100b0dc8b7cb3d0ecb669b";

async function dump() {
    try {
        const aParams = new URLSearchParams();
        aParams.append("populate", "heroImage");
        aParams.append("populate", "category");
        aParams.append("populate", "author");
        aParams.append("pagination[limit]", "2");

        console.log("--- Testing Articles ---");
        const aRes = await fetch(`${API_URL}/articles?${aParams.toString()}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const articles = await aRes.json();
        console.log(JSON.stringify(articles, null, 2));

        const dParams = new URLSearchParams();
        dParams.append("populate", "heroImage");
        dParams.append("pagination[limit]", "3");
        console.log("\n--- Testing Destinations ---");
        const dRes = await fetch(`${API_URL}/destinations?${dParams.toString()}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const dests = await dRes.json();
        console.log(JSON.stringify(dests, null, 2));
    } catch (e) {
        console.error(e);
    }
}

dump();
