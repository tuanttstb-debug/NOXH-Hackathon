import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://localhost:3001";
const OUT = "D:\\Workspace\\NOXH Hackathon\\EVD";

mkdirSync(OUT, { recursive: true });

// Connect to the already-running headless Chrome (port 9222)
const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: { width: 1440, height: 900 },
});

async function newPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  return page;
}

async function goto(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await delay(1200);
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function shot(page, filename, label) {
  await page.screenshot({ path: join(OUT, filename), fullPage: false });
  console.log(`  ✓ ${label}`);
}

async function scroll(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y }), y);
  await delay(400);
}

async function typeInComposer(page, text) {
  const ta = await page.$("textarea");
  if (ta) {
    await ta.focus();
    await page.keyboard.type(text);
    await page.keyboard.press("Enter");
  }
}

async function waitForResult(page, timeout = 10000) {
  await page.waitForFunction(
    () => {
      const els = document.querySelectorAll("h3");
      return [...els].some(h => /ĐỦ ĐIỀU KIỆN|KHÔNG ĐỦ|CHƯA ĐỦ CĂN CỨ/.test(h.textContent ?? ""));
    },
    { timeout }
  );
  await delay(600);
}

console.log("\n📸 Bắt đầu chụp ảnh màn hình NOXH Copilot\n");

// ── LANDING PAGE ─────────────────────────────────────────────────
{
  const page = await newPage();
  console.log("🏠 Landing Page");

  await goto(page, `${BASE}/`);
  await shot(page, "01_landing_hero.png", "01 — Landing: Hero + Search Bar");

  await scroll(page, 680);
  await shot(page, "02_landing_quick_actions.png", "02 — Landing: Quick Actions (4 thẻ)");

  await scroll(page, 1500);
  await shot(page, "03_landing_feature_grid.png", "03 — Landing: Feature Grid (6 tính năng)");

  await scroll(page, 2600);
  await shot(page, "04_landing_architecture.png", "04 — Landing: Architecture Section");

  await page.close();
}

// ── ELIGIBILITY CHECKER — EMPTY STATE ────────────────────────────
{
  const page = await newPage();
  console.log("\n🔍 Eligibility Checker");

  await goto(page, `${BASE}/eligibility`);
  await shot(page, "05_eligibility_empty_state.png", "05 — Eligibility: Empty State (3 ví dụ)");

  // Kịch bản 1: Đủ điều kiện — click example button
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent?.includes("độc thân") && b.textContent?.includes("18 triệu"));
    btn?.click();
  });
  await delay(700);
  await shot(page, "06_eligibility_reasoning_active.png", "06 — Eligibility: Reasoning đang chạy");

  await waitForResult(page);
  await shot(page, "07_eligibility_result_eligible.png", "07 — Eligibility: Kết quả ĐỦ ĐIỀU KIỆN");

  await page.evaluate(() => {
    const el = document.querySelector(".flex-1.overflow-y-auto");
    if (el) el.scrollTop = el.scrollHeight;
  });
  await delay(400);
  await shot(page, "08_eligibility_checklist.png", "08 — Eligibility: Checklist hồ sơ cần chuẩn bị");

  await page.close();
}

// ── ELIGIBILITY — KHÔNG ĐỦ ĐIỀU KIỆN ────────────────────────────
{
  const page = await newPage();
  console.log("\n❌ Kịch bản Không đủ điều kiện");

  await goto(page, `${BASE}/eligibility`);
  await typeInComposer(page, "Vợ chồng tôi tổng thu nhập 45 triệu, chưa có nhà ở Hà Nội. Có đủ điều kiện không?");
  await delay(700);
  await shot(page, "09_eligibility_reasoning_not_eligible.png", "09 — Eligibility: Reasoning cho TC not_eligible");

  await waitForResult(page);
  await shot(page, "10_eligibility_result_not_eligible.png", "10 — Eligibility: Kết quả KHÔNG ĐỦ ĐIỀU KIỆN");

  await page.close();
}

// ── ELIGIBILITY — THIẾU THÔNG TIN ────────────────────────────────
{
  const page = await newPage();
  console.log("\n⚠️  Kịch bản Thiếu thông tin");

  await goto(page, `${BASE}/eligibility`);
  await typeInComposer(page, "Tôi đang nuôi con một mình, lương 22 triệu, chưa có nhà. Tôi có đủ điều kiện không?");
  await delay(700);
  await shot(page, "11_eligibility_reasoning_uncertain.png", "11 — Eligibility: Reasoning cho TC uncertain");

  await waitForResult(page, 12000);
  await shot(page, "12_eligibility_result_insufficient_data.png", "12 — Eligibility: Kết quả CHƯA ĐỦ CĂN CỨ");

  await page.close();
}

// ── ELIGIBILITY — EVIDENCE PANEL ─────────────────────────────────
{
  const page = await newPage();
  console.log("\n📄 Evidence Panel");

  await goto(page, `${BASE}/eligibility`);
  await typeInComposer(page, "Tôi độc thân, chưa có nhà, lương 18 triệu, ở Bình Dương");
  await waitForResult(page);

  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent?.includes("Xem chi tiết"));
    btn?.click();
  });
  await delay(800);
  await shot(page, "13_eligibility_evidence_panel.png", "13 — Eligibility: Evidence Panel (chi tiết trích dẫn)");

  await page.close();
}

// ── AI WORKSPACE ──────────────────────────────────────────────────
{
  const page = await newPage();
  console.log("\n🖥️  AI Workspace");

  await goto(page, `${BASE}/workspace`);
  await shot(page, "14_workspace_overview.png", "14 — Workspace: Toàn cảnh (sidebar + thread + panel)");

  await page.evaluate(() => {
    const el = document.querySelector(".flex-1.overflow-y-auto");
    if (el) el.scrollTop = el.scrollHeight;
  });
  await delay(500);
  await shot(page, "15_workspace_insufficient_data.png", "15 — Workspace: Cuộn xuống CHƯA ĐỦ CĂN CỨ");

  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll("[role='tab']")];
    tabs.find(t => t.textContent?.includes("Suy luận"))?.click();
  });
  await delay(400);
  await shot(page, "16_workspace_reasoning_tab.png", "16 — Workspace: Tab Suy luận");

  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll("[role='tab']")];
    tabs.find(t => t.textContent?.includes("Trích dẫn"))?.click();
  });
  await delay(400);
  await shot(page, "17_workspace_citations_tab.png", "17 — Workspace: Tab Trích dẫn");

  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b =>
      b.getAttribute("aria-label")?.includes("Thu gọn") ||
      b.textContent?.trim() === "Thu gọn"
    );
    btn?.click();
  });
  await delay(500);
  await shot(page, "18_workspace_collapsed_sidebar.png", "18 — Workspace: Sidebar thu gọn");

  const ta = await page.$("textarea");
  if (ta) {
    await ta.focus();
    await page.keyboard.type("Mức lãi suất vay ưu đãi NOXH hiện tại là bao nhiêu?");
    await page.keyboard.press("Enter");
  }
  await delay(900);
  await shot(page, "19_workspace_new_message_reasoning.png", "19 — Workspace: Gửi câu hỏi mới — Reasoning");

  await waitForResult(page, 12000);
  await shot(page, "20_workspace_new_message_result.png", "20 — Workspace: Câu hỏi mới — Kết quả");

  await page.close();
}

await browser.disconnect();

console.log("\n✅ Hoàn tất! Đã lưu 20 ảnh tại:");
console.log(`   ${OUT}\n`);
