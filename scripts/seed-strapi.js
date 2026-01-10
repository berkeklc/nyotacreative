const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = "https://cms-production-219a.up.railway.app";
const API_TOKEN = "4e2ecc42575a8edff630418ee6a067cc0514fe44c1334cc25539ed9b970540982a3d6202977c933a43274ae8e7cb11dc295ce2ecf4fe3ac4c1a0adcc96a2798b5ee80dca0c27040add2832e058507a15450f08889e081d4feb71e701292121e943acd4d27d3719364a185b1f75c50c7c06400909f7dfd6d3e5dd3fc259d03d46";

async function uploadImage(filePath, fileName) {
    try {
        const stats = fs.statSync(filePath);
        const form = new FormData();
        form.append('files', fs.createReadStream(filePath), {
            filepath: filePath,
            contentType: 'image/jpeg',
            knownLength: stats.size
        });

        console.log(`Uploading ${fileName}...`);

        // Using simple fetch without extra headers for FormData (let it set boundary)
        // But we need Authorization
        const headers = form.getHeaders();
        headers['Authorization'] = `Bearer ${API_TOKEN}`;

        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: form,
            headers: headers
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Upload failed: ${response.status} ${text}`);
        }

        const data = await response.json();
        console.log(`Uploaded ${fileName} (ID: ${data[0].id})`);
        return data[0]; // Return full image object
    } catch (error) {
        console.error(`Error uploading ${fileName}:`, error.message);
        return null;
    }
}

async function createEntry(endpoint, data) {
    try {
        console.log(`Creating entry in ${endpoint}...`);
        const response = await fetch(`${API_URL}/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Create failed: ${response.status} ${text}`);
        }

        const result = await response.json();
        console.log(`Created entry (ID: ${result.data.id})`);
        return result.data;
    } catch (error) {
        console.error(`Error creating entry:`, error.message);
    }
}

async function seed() {
    console.log("Starting seed process (Text only mode due to upload environment restrictions)...");

    // Skipping Image Upload for now (Railway file system restrictions)
    // We will seed text content so the frontend has data to show.

    // 1. Create Destinations
    await createEntry('destinations', {
        name: "Zanzibar",
        slug: "zanzibar",
        description: "The ultimate tropical paradise with white sands and rich history. From the winding alleys of Stone Town to the pristine beaches of Nungwi, Zanzibar offers a magical blend of culture and relaxation.",
        publishedAt: new Date(),
    });

    await createEntry('destinations', {
        name: "Serengeti",
        slug: "serengeti",
        description: "Witness the Great Migration in the endless plains of Africa. The Serengeti is home to the most spectacular wildlife event on the planet.",
        publishedAt: new Date(),
    });

    await createEntry('destinations', {
        name: "Kilimanjaro",
        slug: "kilimanjaro",
        description: "Climb the Roof of Africa and experience breathtaking views. A challenge of a lifetime for every adventurer.",
        publishedAt: new Date(),
    });

    // 2. Create Articles
    await createEntry('articles', {
        title: "Best Beaches in Zanzibar: 2026 Guide",
        slug: "best-beaches-zanzibar-2026",
        content: "Nungwi and Kendwa offer the best swimming experiences due to smaller tidal variances. Paje is perfect for kite surfing content...",
        category: "beaches",
        readTime: 12,
        publishedAt: new Date(),
    });

    await createEntry('articles', {
        title: "Safari Packing List",
        slug: "safari-packing-list",
        content: "Don't forget your binoculars and neutral-colored clothing!",
        category: "tips",
        readTime: 5,
        publishedAt: new Date(),
    });

    console.log("Seeding complete! Refresh your frontend.");
}

seed();
