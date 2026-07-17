import puppeteer from "puppeteer-core";
import { join } from "path";

const BASE = "http://localhost:3001";
const OUT = "D:\\Workspace\\NOXH Hackathon\\EVD";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Force prefers-reduced-motion → framer-motion skips all animations, elements render at final state
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 20000 });
await new Promise(r => setTimeout(r, 2500));

async function shot(filename, label) {
  await page.screenshot({ path: join(OUT, filename), fullPage: false });
  console.log(`  ✓ ${label}`);
}

async function scroll(y) {
  await page.evaluate((y) => window.scrollTo({ top: y }), y);
  await new Promise(r => setTimeout(r, 500));
}

console.log("\n🏠 Retake Landing Page screenshots (reduced-motion)\n");

await scroll(0);
await shot("01_landing_hero.png", "01 — Landing: Hero + AI Search Bar");

await scroll(800);
await shot("02_landing_quick_actions.png", "02 — Landing: Quick Actions (4 thẻ)");

await scroll(1700);
await shot("03_landing_feature_grid.png", "03 — Landing: Feature Grid (6 tính năng)");

await scroll(2800);
await shot("04_landing_architecture.png", "04 — Landing: Architecture / Use Case");

await page.close();
await browser.disconnect();
console.log("\n✅ Done!\n");
