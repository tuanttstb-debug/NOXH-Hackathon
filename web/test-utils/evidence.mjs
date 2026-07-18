/**
 * evidence.mjs — hạ tầng chụp ảnh evidence dùng chung cho MỌI bộ test.
 *
 * QUY ƯỚC DỰ ÁN (chốt 2026-07-19): mọi test đều phải để lại ảnh evidence tại thư mục `EVD/` ở gốc
 * dự án. Lý do: `EVD/` là bộ chứng cứ nộp bài/demo — trước đây 20 ảnh gốc `EVD/01`–`20` đã bị mất
 * và không khôi phục được vì chưa từng commit (xem SESSION_HANDOVER.md Session 9). Từ nay ảnh do
 * chính test sinh ra nên luôn dựng lại được bằng cách chạy lại test.
 *
 * Mỗi lần chạy, ảnh được đánh số tăng dần theo thứ tự thực thi và kèm nhãn mô tả, đồng thời sinh
 * `EVD/INDEX.md` để người xem biết mỗi ảnh chứng minh điều gì — ảnh không có chú thích thì vô dụng
 * với giám khảo.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

/** Gốc dự án = thư mục cha của `web/`. Không hard-code đường dẫn tuyệt đối để repo còn clone được nơi khác. */
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const EVD_DIR = join(PROJECT_ROOT, "EVD");

/**
 * Tạo bộ chụp ảnh cho một bộ test.
 * @param {string} suiteName tên bộ test — thành tiền tố file, vd "eligibility" → "eligibility_01_....png"
 * @param {string} suiteTitle tiêu đề hiển thị trong INDEX.md
 */
export function createEvidence(suiteName, suiteTitle, scriptName = `verify-${suiteName}.mjs`) {
  mkdirSync(EVD_DIR, { recursive: true });

  /*
   * Xoá ảnh CŨ của đúng bộ test này trước khi chạy.
   * Vì sao cần: số thứ tự gắn theo trình tự thực thi, nên chỉ cần chèn thêm một kịch bản ở giữa là
   * các ảnh sau bị đánh số lại — ảnh của lần chạy trước ở lì lại với tên cũ, không nằm trong INDEX,
   * và người xem không phân biệt được đâu là ảnh hiện hành. Đã xảy ra thật 2026-07-19.
   * Chỉ xoá theo tiền tố của bộ này, không đụng ảnh của bộ khác.
   */
  for (const f of readdirSync(EVD_DIR)) {
    if (f.startsWith(`${suiteName}_`) && f.endsWith(".png")) {
      unlinkSync(join(EVD_DIR, f));
    }
  }

  const entries = [];
  let counter = 0;

  /** Chụp toàn khung nhìn hiện tại. `label` mô tả ảnh CHỨNG MINH điều gì, không phải mô tả thao tác. */
  async function shot(page, label) {
    counter += 1;
    const file = `${suiteName}_${String(counter).padStart(2, "0")}_${slug(label)}.png`;
    await page.screenshot({ path: join(EVD_DIR, file) });
    entries.push({ file, label });
    return file;
  }

  /** Ghi/cập nhật phần của bộ test này trong EVD/INDEX.md. Gọi 1 lần ở cuối. */
  function writeIndex(extra = "") {
    const lines = [
      `# ${suiteTitle}`,
      "",
      `> Sinh tự động bởi \`web/${scriptName}\` — chạy lại test là dựng lại toàn bộ ảnh.`,
      `> Cập nhật: ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
      "",
      ...entries.map((e, i) => `${i + 1}. **${e.label}** — \`${e.file}\``),
    ];
    if (extra) lines.push("", extra);
    writeFileSync(join(EVD_DIR, `INDEX_${suiteName}.md`), lines.join("\n") + "\n", "utf8");
  }

  return { shot, writeIndex, get count() { return counter; } };
}

function slug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
