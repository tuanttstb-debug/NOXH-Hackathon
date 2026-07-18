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
import { createEvidence, EVD_DIR } from "./test-utils/evidence.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LLM_TIMEOUT = 120000; // 2 lệnh gọi LLM thật/lượt — chậm hơn hẳn mock

// Quy ước dự án: mọi test đều để lại ảnh evidence ở `EVD/` gốc dự án (xem test-utils/evidence.mjs).
const evd = createEvidence("eligibility", "Evidence — Eligibility Checker (rehearsal UI)", "verify-ui-rehearsal.mjs");

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

/** Đếm khối kết quả đã render. `[data-result-card]` do ResultCard gắn — mốc ổn định, không phụ
 *  thuộc nội dung chữ (câu trả lời tra cứu pháp lý không chứa chuỗi verdict nào). */
const countVerdicts = (page) =>
  page.evaluate(() => document.querySelectorAll("[data-result-card]").length);

/**
 * Chờ một khối kết quả MỚI xuất hiện. Truyền `since` = số khối trước khi gửi lượt này.
 * Trong hội thoại nhiều lượt, khối kết quả của lượt trước vẫn nằm trên trang, nên chỉ chờ
 * "có ít nhất 1 khối" sẽ trả về ngay lập tức mà chưa hề đợi câu trả lời mới.
 */
async function waitVerdict(page, since = 0) {
  await page.waitForFunction(
    (n) => document.querySelectorAll("[data-result-card]").length > n,
    { timeout: LLM_TIMEOUT },
    since
  );
  await delay(900); // để animation/typing effect kết thúc trước khi đọc DOM
}

/**
 * Đọc verdict MỚI NHẤT (h3 cuối cùng khớp), không phải cái đầu tiên.
 * Từ 2026-07-19 hội thoại có nhiều lượt nên trang chứa NHIỀU khối kết quả — lấy cái đầu tiên
 * sẽ đọc nhầm kết quả "chưa đủ căn cứ" của lượt 1 và báo fail oan cho lượt cuối.
 */
const readVerdict = (page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("h3")]
        .map((h) => h.textContent?.trim() ?? "")
        .filter((t) => /ĐỦ ĐIỀU KIỆN|KHÔNG ĐỦ|CHƯA ĐỦ CĂN CỨ/.test(t))
        .pop() ?? ""
  );

console.log(`\n🧪 REHEARSAL UI — ${BASE}\n`);

// ── 1. Trang tải được, có composer ────────────────────────────────
console.log("① Tải trang /eligibility");
const page = await browser.newPage();

// Gắn listener TRƯỚC goto — bản đầu gắn sau nên bỏ lọt mọi lỗi phát sinh lúc tải trang đầu tiên.
// Ghi kèm URL nguồn lỗi: message của console chỉ là "Failed to load resource: ... 404", URL nằm ở
// `location()` chứ không nằm trong text, nên lọc theo riêng text sẽ không loại được favicon.
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(`${m.text()} @ ${m.location()?.url ?? ""}`);
});
page.on("pageerror", (e) => consoleErrors.push(String(e)));

const resp = await page.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });
check("HTTP 200", resp.status() === 200, `status ${resp.status()}`);
check("Có composer (textarea)", (await page.$("textarea")) !== null);
await evd.shot(page, "Màn hình khởi đầu Eligibility Checker");

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
await evd.shot(page, "TC-02 Không đủ điều kiện — không nêu tỉnh, trần 25 triệu");

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
await evd.shot(page2, "TC-04 Chưa đủ căn cứ — cùng hồ sơ nhưng nêu tỉnh, verdict lật");

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
await evd.shot(page3, "TC-01 Đủ điều kiện — kèm checklist hồ sơ và nút tải tóm tắt");

// ── 5. Hội thoại nhiều lượt qua UI (tính năng thêm 2026-07-19) ────
console.log("\n⑤ Nhiều lượt qua UI — khai rải rác, hồ sơ phải tích luỹ");
const page4 = await browser.newPage();
await page4.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });

await submit(page4, "Tôi đã kết hôn");
await page4.waitForFunction(() => /Hồ sơ đã ghi nhận/.test(document.body.innerText), { timeout: LLM_TIMEOUT });
const afterT1 = await page4.evaluate(() => document.body.innerText);
check("Thanh 'Hồ sơ đã ghi nhận' xuất hiện", /Hồ sơ đã ghi nhận/.test(afterT1));
check("Agent hỏi lại về thu nhập", /thu nhập/i.test(afterT1));
await evd.shot(page4, "Lượt 1 — agent hỏi lại trường còn thiếu, hồ sơ bắt đầu tích luỹ");

await submit(page4, "Hai vợ chồng thu nhập 40 triệu");
await delay(1500);
await page4.waitForFunction(
  () => /đã có nhà|nhà thuộc sở hữu/i.test(document.body.innerText),
  { timeout: LLM_TIMEOUT }
);
check("Agent chuyển sang hỏi tình trạng nhà ở", true);

const before3 = await countVerdicts(page4);
await submit(page4, "Chúng tôi chưa có nhà");
await waitVerdict(page4, before3);
const vMulti = await readVerdict(page4);
check("★ Kết luận được sau 3 lượt khai rải rác", vMulti.includes("ĐỦ ĐIỀU KIỆN") && !vMulti.includes("KHÔNG ĐỦ"), vMulti);
await evd.shot(page4, "Kết luận sau 3 lượt khai rải rác — hội thoại nhiều lượt");

const chipsBefore = await page4.evaluate(() => /Hồ sơ đã ghi nhận/.test(document.body.innerText));
await page4.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Bắt đầu hồ sơ mới"));
  btn?.click();
});
await delay(800);
const chipsAfter = await page4.evaluate(() => /Hồ sơ đã ghi nhận/.test(document.body.innerText));
check("Nút 'Bắt đầu hồ sơ mới' xoá được ngữ cảnh", chipsBefore && !chipsAfter);

// ── 6. Định tuyến ý định qua UI (bug 2026-07-19) ──────────────────
console.log("\n⑥ Câu hỏi tra cứu pháp lý — KHÔNG được rơi vào luồng xét điều kiện");
const page5 = await browser.newPage();
await page5.goto(`${BASE}/eligibility`, { waitUntil: "networkidle2", timeout: 45000 });
await submit(page5, "So sánh Nghị định 261/2025 và 136/2026");
await page5.waitForFunction(
  () => [...document.querySelectorAll("h3")].some((h) => (h.textContent ?? "").trim().length > 5),
  { timeout: LLM_TIMEOUT }
);
await delay(1200);
const legalBody = await page5.evaluate(() => document.body.innerText);
check("KHÔNG hỏi ngược tình trạng hôn nhân", !/bạn độc thân, đang một mình nuôi con/i.test(legalBody));
check("Nêu đúng cả 2 mốc trần (25 và 50 triệu)", /25/.test(legalBody) && /50/.test(legalBody));
check("Có căn cứ điều khoản kèm link văn bản gốc", /Căn cứ/.test(legalBody) && /Văn bản gốc/.test(legalBody));
await evd.shot(page5, "Tra cứu pháp lý — so sánh 2 nghị định, định tuyến đúng ý định");

// ── 7. Không có lỗi JS runtime ────────────────────────────────────
console.log("\n⑦ Lỗi console");
const realErrors = consoleErrors.filter((e) => !/favicon|DevTools|Download the React/i.test(e));
check("Không có lỗi JS runtime", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

await browser.close();

// ── Tổng kết ──────────────────────────────────────────────────────
const failed = results.filter((r) => !r.passed);
evd.writeIndex(
  failed.length
    ? `⚠️ Lần chạy gần nhất có ${failed.length} kiểm thử FAIL — ảnh dưới đây có thể phản ánh trạng thái lỗi.`
    : `✅ Toàn bộ ${results.length} kiểm thử PASS ở lần chạy sinh ra các ảnh này.`
);
console.log(`\n${"─".repeat(56)}`);
console.log(`KẾT QUẢ: ${results.length - failed.length}/${results.length} PASS`);
console.log(`Evidence: ${evd.count} ảnh → ${EVD_DIR} (xem INDEX_eligibility.md)`);
if (failed.length) {
  console.log(`\n❌ FAIL:`);
  failed.forEach((f) => console.log(`   - ${f.name}${f.detail ? ` (${f.detail})` : ""}`));
  process.exitCode = 1;
} else {
  console.log("✅ P0 #5 — UI rehearsal PASS\n");
}
