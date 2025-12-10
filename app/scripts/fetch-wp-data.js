import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// --------------------------------------
// CONFIG
// --------------------------------------
const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error("❌ ERROR: BASE_URL is not defined in .env");
  process.exit(1);
}

// Map: WordPress slug → local folder name
const CONTENT_TYPES = {
  "staff": "staff",
  "operations-group": "operations_groups",
  "organization": "organizations",
  "project": "projects",
  "research-group": "research_groups",
};

// --------------------------------------
// Fetch ALL pages for a content type
// --------------------------------------
async function fetchAllPages(endpoint) {
  const perPage = 100;
  const firstUrl = `${BASE_URL}/${endpoint}?per_page=${perPage}&page=1`;

  const firstRes = await fetch(firstUrl);
  if (!firstRes.ok) throw new Error(`${endpoint} → ${firstRes.status}`);

  const totalPages = parseInt(firstRes.headers.get("X-WP-TotalPages")) || 1;
  const firstPageData = await firstRes.json();

  if (totalPages <= 1) return firstPageData;

  const more = [];
  for (let page = 2; page <= totalPages; page++) {
    more.push(
      fetch(`${BASE_URL}/${endpoint}?per_page=${perPage}&page=${page}`)
        .then(r => r.json())
    );
  }

  const rest = await Promise.all(more);
  return [...firstPageData, ...rest.flat()];
}

// --------------------------------------
// MAIN
// --------------------------------------
async function run() {
  console.log("📥 Fetching WordPress data...\n");

  const globalUpdated = new Date().toISOString();
  let totalRecords = 0;
  let totalTypes = 0;

  for (const [apiSlug, localFolder] of Object.entries(CONTENT_TYPES)) {
    try {
      console.log(`→ Fetching "${apiSlug}"`);
      const items = await fetchAllPages(apiSlug);

      totalRecords += items.length;
      totalTypes++;

      const outputDir = path.resolve("src/data", localFolder);
      await fs.mkdir(outputDir, { recursive: true });

      const outPath = path.join(outputDir, "index.json");
      const payload = {
        updated: globalUpdated,
        items
      };

      await fs.writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");
      console.log(`   ✔ ${items.length} saved → ${outPath}`);
    } catch (err) {
      console.error(`   ✖ Error for ${apiSlug}:`, err.message);
    }
  }

  // Write global timestamp file
  const lastUpdatedPath = path.resolve("src/data/_last-updated.json");
  await fs.writeFile(
    lastUpdatedPath,
    JSON.stringify({ updated: globalUpdated }, null, 2),
    "utf8"
  );

  console.log("\n📦 SUMMARY");
  console.log(`   Content types processed: ${totalTypes}`);
  console.log(`   Total records collected: ${totalRecords}`);
  console.log(`   Global timestamp saved → ${lastUpdatedPath}`);
  console.log("\n✨ All done!");
}

run();
