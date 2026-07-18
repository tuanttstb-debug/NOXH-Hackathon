// Lấy `promises` từ "fs" thay vì import "fs/promises": bản @types/node đang cài trong repo này
// thiếu hẳn thư mục `fs/` nên không có khai báo cho submodule "fs/promises" (cả dạng có và
// không có tiền tố "node:"). `fs.d.ts` thì có, và đã khai báo `promises`. Chạy `npm install`
// lại có thể khôi phục đủ file, nhưng cách này không phụ thuộc vào việc đó.
import { promises as fs } from "fs";
import path from "path";
import type { RawPost, SourceChannel } from "@/types/discourse";

/**
 * Gộp bài đăng từ các nguồn đã thu thập trên đĩa (`web/data/discourse/`).
 * Chỉ chạy phía server. Xử lý theo BATCH — không realtime, đúng phạm vi đã chốt
 * ở docs/features/PUBLIC_DISCOURSE_FILTER.md §1.
 *
 * Nguồn hiện có:
 *   - youtube-posts.json  ← scripts/crawl-youtube.mjs (YouTube Data API, chính thống & miễn phí)
 *   - manual-posts.json   ← người dùng tuyển tay từ Facebook/TikTok/diễn đàn
 *   - rss-posts.json      ← scripts/crawl-rss.mjs (báo chí VN)
 *
 * Vì sao không crawl trực tiếp Facebook/TikTok: xem ghi chú đầu file crawl-youtube.mjs —
 * các API chính thức đều đã đóng hoặc yêu cầu tư cách học viện + nhiều tuần duyệt.
 */

const DATA_DIR = path.join(process.cwd(), "data", "discourse");

const SOURCE_FILES = ["youtube-posts.json", "manual-posts.json", "rss-posts.json"] as const;

const VALID_CHANNELS: readonly SourceChannel[] = [
  "youtube",
  "facebook",
  "threads",
  "tiktok",
  "bao_chi",
  "dien_dan",
];

/** Loại bản ghi thiếu trường bắt buộc thay vì để pipeline vỡ ở giữa chừng. */
function isValidPost(value: unknown): value is RawPost {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Partial<RawPost>;
  return (
    typeof p.postId === "string" &&
    p.postId.length > 0 &&
    typeof p.text === "string" &&
    p.text.trim().length > 0 &&
    typeof p.url === "string" &&
    /^https?:\/\//.test(p.url) &&
    typeof p.publishedAt === "string" &&
    typeof p.channel === "string" &&
    VALID_CHANNELS.includes(p.channel as SourceChannel)
  );
}

export interface LoadResult {
  posts: RawPost[];
  perSource: Record<string, number>;
  invalidDropped: number;
}

export async function loadCollectedPosts(): Promise<LoadResult> {
  const perSource: Record<string, number> = {};
  const all: RawPost[] = [];
  let invalidDropped = 0;

  for (const file of SOURCE_FILES) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8"));
    } catch {
      // Nguồn chưa thu thập → bỏ qua im lặng, không phải lỗi.
      continue;
    }
    if (!Array.isArray(parsed)) continue;

    const valid = parsed.filter(isValidPost);
    invalidDropped += parsed.length - valid.length;
    perSource[file] = valid.length;
    all.push(...valid);
  }

  // Khử trùng lặp theo postId (một bài có thể xuất hiện ở nhiều nguồn).
  const posts = [...new Map(all.map((p) => [p.postId, p])).values()];
  return { posts, perSource, invalidDropped };
}
