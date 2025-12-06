import "dotenv/config";

async function listAllModels() {
    const key = process.env.GOOGLE_API_KEY;
    let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=100`;
    let models = [];

    try {
        while (url) {
            const res = await fetch(url);
            if (!res.ok) {
                console.error("Error fetching models:", await res.text());
                break;
            }
            const data = await res.json();
            if (data.models) models.push(...data.models);

            if (data.nextPageToken) {
                url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=100&pageToken=${data.nextPageToken}`;
            } else {
                url = null;
            }
        }

        console.log(`Found ${models.length} models.`);
        const names = models.map(m => m.name);
        console.log("Model Names:", names.join("\n"));

        // Check for specific ones
        const flash = models.find(m => m.name.includes("flash"));
        if (flash) console.log("Found Flash model:", flash.name);

    } catch (e) {
        console.error("Script Error:", e);
    }
}

listAllModels();
