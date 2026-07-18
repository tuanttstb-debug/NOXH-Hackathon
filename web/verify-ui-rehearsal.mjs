/**
 * verify-ui-rehearsal.mjs — P0 #5: rehearsal Eligibility Checker QUA UI THẬT trong trình duyệt.
 *
 * Vì sao tồn tại: toàn bộ verify trước đây (Session 5/6) chạy ở tầng API bằng `curl`. Không ai
 * xác nhận UI thật render đúng — reasoningSteps chạy hết 4 bước, citation card có nội dung,
 * threshold bar hiện đúng số. Build sạch KHÔNG chứng minh được điều đó.
 *
 * Đây là TEST CÓ ASSERTION, không phải script chụp ảnh (khác `screenshot.mjs`). Thoát code 1 nếu fail.
 *
 * Chạy: node verify-ui-rehearsal.mjs   (cần `next dev` đang chạy ở BASE)
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = join(process.cwd(), "..", "EVD", "rehearsal");
const LLM_TIMEOUT = 120000; // 2 lệnh gọi LLM thật/lượt — chậm hơn hẳn mock

mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, passed, detail = "") {
  results.push({ name, passed, detail });
  console.log(`  ${passed ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
  args: ["--no-sandbox"],
});

async function submit(page, text) {
  const ta = await page.$("textarea");
  if (!ta) throw new Error("Không tìm thấy textarea composer trên /eligibility");
  await ta.focus();
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
}

async function waitVerdict(page) {
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("h3")].some((h) =>
        /ĐỦ ĐIỀU KIỆN|KHÔNG ĐỦ|CHƯA ĐỦ CĂN CỨ/.test(h.textContent ?? "")
      ),
    { timeout: LLM_TIMEOUT }
  );
  await delay(900); // để animation/typing effect kết thúc trước khi đọc DOM
}

const readVerdict = (page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("h3")]
        .map((h) => h.textContent?.trim() ?? "")
        .find((t) => /ĐỦ ĐIỀU KIỆN|KHÔNG ĐỦ|CHƯA ĐỦ CĂN CỨ/.test(t)) ?? ""
  );

console.log(`\n🧪 REHEARSAL UI — ${BASE}\n`);

// ── 1. Trang tải được, có composer ────────────────────────────────
console.log("① Tải trang /eligibility");
const page = await browser.newPage();
const resp = await page.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });
check("HTTP 200", resp.status() === 200, `status ${resp.status()}`);
check("Có composer (textarea)", (await page.$("textarea")) !== null);

const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));

// ── 2. TC-02: không nêu tỉnh → KHÔNG ĐỦ ───────────────────────────
console.log("\n② TC-02 — độc thân, 30tr, chưa có nhà, KHÔNG nêu tỉnh");
await submit(page, "Tôi độc thân, thu nhập 30 triệu một tháng, chưa có nhà ở.");
await delay(600);

// reasoningSteps phải hiện TRONG LÚC chờ — đây là thứ chỉ UI mới kiểm được
const stepsDuring = await page.evaluate(
  () => document.body.innerText.match(/Hiểu câu hỏi|Truy vấn Knowledge Graph|Fact-Check/g)?.length ?? 0
);
check("reasoningSteps hiển thị khi đang xử lý", stepsDuring > 0, `${stepsDuring} bước`);

await waitVerdict(page);
const v02 = await readVerdict(page);
check("TC-02 verdict = KHÔNG ĐỦ ĐIỀU KIỆN", v02.includes("KHÔNG ĐỦ"), v02);

const body02 = await page.evaluate(() => document.body.innerText);
check("Có trích dẫn văn bản (Nghị định/Điều)", /Nghị định|NĐ\s|Điều\s*\d/.test(body02));
check("Có link 'Văn bản gốc' (P1 Session 7)", body02.includes("Văn bản gốc"));
check("Threshold bar hiện mức trần 25 triệu", /25[.,]?\s*(triệu|000)/.test(body02));
// Lưu ý: ReasoningTrace render 4 NÚT TRÒN nhưng chỉ hiện MỘT nhãn chữ tại một thời điểm
// (`currentLabel`) — có chủ đích, xem features/workspace/reasoning-trace.tsx. Vì vậy phải đếm
// node trong DOM, không đếm nhãn trong innerText.
const trace = await page.evaluate(() => {
  const icons = [...document.querySelectorAll("div.rounded-full.border")].filter((el) =>
    /^\d$/.test(el.textContent?.trim() ?? "") || el.querySelector("svg")
  );
  const done = icons.filter((el) => el.className.includes("success")).length;
  return { total: icons.length, done };
});
check("4 nút reasoning render đủ", trace.total >= 4, `${trace.total} nút`);
check("4/4 bước reasoning ở trạng thái done", trace.done >= 4, `${trace.done}/4 done`);
await page.screenshot({ path: join(OUT, "01_tc02_not_eligible.png") });

// ── 3. TC-04: cùng hồ sơ + nêu tỉnh → verdict phải LẬT ────────────
console.log("\n③ TC-04 — CÙNG hồ sơ nhưng CÓ nêu TP.HCM (verdict phải lật)");
const page2 = await browser.newPage();
await page2.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });
await submit(page2, "Tôi độc thân, thu nhập 30 triệu một tháng, chưa có nhà ở, muốn mua nhà ở xã hội tại TP.HCM.");
await waitVerdict(page2);
const v04 = await readVerdict(page2);
check("TC-04 verdict = CHƯA ĐỦ CĂN CỨ", v04.includes("CHƯA ĐỦ CĂN CỨ"), v04);
check("★ Verdict LẬT giữa TC-02 và TC-04", v02 !== v04 && v02 && v04, `"${v02}" → "${v04}"`);

const body04 = await page2.evaluate(() => document.body.innerText);
check("Nêu lý do hệ số cấp tỉnh", /hệ số|cấp tỉnh|UBND|Ủy ban nhân dân/i.test(body04));
await page2.screenshot({ path: join(OUT, "02_tc04_insufficient_data.png") });

// ── 4. TC-01: đủ điều kiện → phải có checklist ────────────────────
console.log("\n④ TC-01 — độc thân, 18tr, chưa có nhà → ĐỦ ĐIỀU KIỆN + checklist");
const page3 = await browser.newPage();
await page3.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });
await submit(page3, "Tôi độc thân, lương 18 triệu, chưa có nhà ở Bình Dương.");
await waitVerdict(page3);
const v01 = await readVerdict(page3);
check("TC-01 verdict = ĐỦ ĐIỀU KIỆN", v01.includes("ĐỦ ĐIỀU KIỆN") && !v01.includes("KHÔNG ĐỦ"), v01);

await page3.evaluate(() => {
  const el = document.querySelector(".flex-1.overflow-y-auto");
  if (el) el.scrollTop = el.scrollHeight;
});
await delay(600);
const body01 = await page3.evaluate(() => document.body.innerText);
check("Checklist hồ sơ hiện khi đủ điều kiện", /hồ sơ|chuẩn bị|giấy tờ/i.test(body01));
check("Có nút tải bản tóm tắt", /Tải|tóm tắt|\.txt/i.test(body01));
await page3.screenshot({ path: join(OUT, "03_tc01_eligible.png") });

// ── 5. Không có lỗi JS runtime ────────────────────────────────────
console.log("\n⑤ Lỗi console");
const realErrors = consoleErrors.filter((e) => !/favicon|DevTools|Download the React/i.test(e));
check("Không có lỗi JS runtime", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

await browser.close();

// ── Tổng kết ──────────────────────────────────────────────────────
const failed = results.filter((r) => !r.passed);
console.log(`\n${"─".repeat(56)}`);
console.log(`KẾT QUẢ: ${results.length - failed.length}/${results.length} PASS`);
console.log(`Ảnh rehearsal: ${OUT}`);
if (failed.length) {
  console.log(`\n❌ FAIL:`);
  failed.forEach((f) => console.log(`   - ${f.name}${f.detail ? ` (${f.detail})` : ""}`));
  process.exit(1);
}
console.log("✅ P0 #5 — UI rehearsal PASS\n");
