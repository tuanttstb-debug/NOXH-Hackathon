#!/usr/bin/env node
/**
 * Thu thập tin báo chí VN về Nhà ở xã hội qua RSS → RawPost JSON.
 *
 * RSS là kênh nhà xuất bản CHỦ ĐỘNG công bố để được đọc bằng máy — không phải scraping,
 * không cần vượt qua cơ chế chống bot, không đụng ToS. Đây là lý do chọn RSS thay vì parse HTML.
 *
 * LƯU Ý VỀ PHẠM VI: đây là BÁO CHÍ, không phải DƯ LUẬN XÃ HỘI. Dùng để bổ sung ngữ cảnh và
 * đối chiếu, không thay thế được bình luận người dân (YouTube/Facebook). Xem
 * docs/features/PUBLIC_DISCOURSE_FILTER.md §7 về phân tầng nguồn.
 *
 * Chạy:  node scripts/crawl-rss.mjs
 */

import { writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data", "discourse");
const OUT_FILE = path.join(DATA_DIR, "rss-posts.json");

/**
 * Feed đã kiểm chứng trả HTTP 200 ngày 2026-07-18.
 * Đã thử và LOẠI: baochinhphu.vn và xaydungchinhsach.chinhphu.vn — mọi đường dẫn RSS đều 404,
 * hai site này không phát hành RSS công khai (dù là nguồn chính thống tốt nhất về nội dung).
 * Muốn lấy nội dung từ đó phải parse HTML — cân nhắc riêng, không gộp vào đây.
 */
const FEEDS = [
  { name: "VnExpress — Bất động sản", url: "https://vnexpress.net/rss/bat-dong-san.rss" },
  { name: "Dân trí — Bất động sản", url: "https://dantri.com.vn/rss/bat-dong-san.rss" },
  { name: "CafeF — Bất động sản", url: "https://cafef.vn/bat-dong-san.rss" },
  { name: "Tuổi Trẻ — Kinh doanh", url: "https://tuoitre.vn/rss/kinh-doanh.rss" },
  { name: "Thanh Niên — Kinh tế", url: "https://thanhnien.vn/rss/kinh-te.rss" },
];

/** Chỉ giữ tin thật sự về NOXH — feed là feed chung, phần lớn tin không liên quan. */
const KEYWORDS = ["nhà ở xã hội", "noxh", "nhà xã hội", "nhà ở giá rẻ", "thu nhập thấp"];

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function tag(item, name) {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]).replace(/<[^>]+>/g, "").trim() : "";
}

async function fetchFeed(feed) {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "NOXH-Copilot-Hackathon/1.0 (research; contact via repo)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items
    .map((raw) => ({
      title: tag(raw, "title"),
      link: tag(raw, "link"),
      description: tag(raw, "description"),
      pubDate: tag(raw, "pubDate"),
    }))
    .filter((it) => it.title && it.link);
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const posts = [];

  for (const feed of FEEDS) {
    try {
      const items = await fetchFeed(feed);
      const relevant = items.filter((it) => {
        const hay = `${it.title} ${it.description}`.toLowerCase();
        return KEYWORDS.some((k) => hay.includes(k));
      });
      console.log(`${feed.name}: ${relevant.length}/${items.length} tin liên quan NOXH`);

      for (const it of relevant) {
        const published = it.pubDate ? new Date(it.pubDate) : new Date();
        posts.push({
          // Hash toàn bộ link, KHÔNG cắt tiền tố base64: link cùng một site chung tiền tố nên
          // base64 cắt ngắn trùng nhau, khiến bước khử trùng lặp xoá nhầm tin khác nhau.
          postId: `rss-${createHash("sha1").update(it.link).digest("hex").slice(0, 12)}`,
          channel: "bao_chi",
          url: it.link,
          text: `${it.title}. ${it.description}`.trim(),
          publishedAt: (isNaN(published.getTime()) ? new Date() : published).toISOString(),
          sourceContext: { feedName: feed.name },
        });
      }
    } catch (err) {
      // Một feed hỏng không được làm gãy cả mẻ.
      console.warn(`${feed.name}: bỏ qua (${err.message})`);
    }
  }

  const unique = [...new Map(posts.map((p) => [p.postId, p])).values()];
  await writeFile(OUT_FILE, JSON.stringify(unique, null, 2), "utf8");
  console.log(`\nXong. ${unique.length} tin → ${path.relative(ROOT, OUT_FILE)}`);

  if (unique.length === 0) {
    console.log(
      "Không có tin nào khớp từ khoá NOXH ở thời điểm này — bình thường, các feed này là feed chung."
    );
  }
}

main().catch((err) => {
  console.error(`Lỗi: ${err.message}`);
  process.exit(1);
});
