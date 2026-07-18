#!/usr/bin/env node
/**
 * Thu thập bình luận YouTube về chủ đề Nhà ở xã hội → RawPost JSON cho Public Discourse Filter.
 *
 * VÌ SAO YOUTUBE: tính đến 7/2026, đây là nguồn mạng xã hội DUY NHẤT vừa hợp pháp, vừa miễn phí,
 * vừa lấy được ngay. CrowdTangle đã đóng (8/2024); Meta Content Library chỉ cấp cho học viện đã
 * thẩm định và thu phí từ 1/2026; TikTok Research API duyệt ~4 tuần và loại bên thương mại.
 * Chi tiết: ai_context/SESSION_HANDOVER.md.
 *
 * QUOTA (sau thay đổi 01/06/2026 — YouTube tách bucket riêng):
 *   - search.list        → bucket riêng, ~100 lần/ngày. ĐÂY LÀ THỨ KHAN HIẾM DUY NHẤT.
 *   - commentThreads.list → 1 unit, pool chung 10.000/ngày ⇒ tới ~1.000.000 bình luận/ngày.
 * Script cache videoId xuống đĩa để lần chạy sau KHÔNG tốn thêm lần search nào.
 *
 * Chạy:  node scripts/crawl-youtube.mjs [--max-videos 12] [--max-comments 60] [--no-search]
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data", "discourse");
const CACHE_FILE = path.join(DATA_DIR, "youtube-video-cache.json");
const OUT_FILE = path.join(DATA_DIR, "youtube-posts.json");

/** Từ khoá tìm video. Nhắm vào tin chính sách NOXH — nơi bình luận sai lệch tập trung nhiều nhất. */
const QUERIES = [
  "nhà ở xã hội điều kiện mua",
  "nghị định 136/2026 nhà ở xã hội",
  "thu nhập bao nhiêu được mua nhà ở xã hội",
  "hồ sơ đăng ký nhà ở xã hội",
];

const argv = process.argv.slice(2);
const argVal = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : def;
};
const MAX_VIDEOS = argVal("max-videos", 12);
const MAX_COMMENTS_PER_VIDEO = argVal("max-comments", 60);
const NO_SEARCH = argv.includes("--no-search");

/** Đọc .env.local thủ công — script chạy ngoài Next nên không có sẵn cơ chế nạp env. */
async function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const quota = { search: 0, units: 0 };

async function api(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 403 && /quota/i.test(body)) {
      throw new Error(
        `Hết quota YouTube API. Quota reset lúc 00:00 giờ Thái Bình Dương (07:00 hoặc 08:00 giờ VN tuỳ mùa).\n${body.slice(0, 300)}`
      );
    }
    throw new Error(`YouTube API ${endpoint} lỗi HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function searchVideos(query) {
  quota.search += 1;
  const data = await api("search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: 25,
    order: "relevance",
    regionCode: "VN",
    relevanceLanguage: "vi",
  });
  return (data.items ?? []).map((it) => ({
    videoId: it.id.videoId,
    title: it.snippet.title,
    channelTitle: it.snippet.channelTitle,
    publishedAt: it.snippet.publishedAt,
    query,
  }));
}

async function fetchComments(videoId, limit) {
  const out = [];
  let pageToken;
  while (out.length < limit) {
    quota.units += 1;
    let data;
    try {
      data = await api("commentThreads", {
        part: "snippet",
        videoId,
        maxResults: Math.min(100, limit - out.length),
        order: "relevance",
        textFormat: "plainText",
        ...(pageToken ? { pageToken } : {}),
      });
    } catch (err) {
      // Video tắt bình luận trả 403 — bỏ qua, không phải lỗi cần dừng cả mẻ.
      if (/disabled|403/i.test(String(err.message))) return out;
      throw err;
    }
    for (const item of data.items ?? []) {
      const s = item.snippet.topLevelComment.snippet;
      out.push({
        commentId: item.snippet.topLevelComment.id,
        videoId,
        text: s.textOriginal ?? s.textDisplay,
        publishedAt: s.publishedAt,
        likeCount: s.likeCount ?? 0,
      });
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}

async function main() {
  await loadEnv();
  if (!process.env.YOUTUBE_API_KEY) {
    console.error(
      "Thiếu YOUTUBE_API_KEY.\n" +
        "Thêm dòng  YOUTUBE_API_KEY=...  vào web/.env.local (file này đã được .gitignore).\n" +
        "Xem hướng dẫn lấy key: web/data/discourse/HUONG_DAN_YOUTUBE_API.md"
    );
    process.exit(1);
  }
  await mkdir(DATA_DIR, { recursive: true });

  // 1. Lấy danh sách video — ưu tiên cache để không tốn bucket search (thứ khan hiếm duy nhất).
  let videos = [];
  if (existsSync(CACHE_FILE)) {
    videos = JSON.parse(await readFile(CACHE_FILE, "utf8"));
    console.log(`Cache: ${videos.length} video (không tốn lần search nào)`);
  }
  if (!NO_SEARCH && videos.length < MAX_VIDEOS) {
    for (const q of QUERIES) {
      if (videos.length >= MAX_VIDEOS) break;
      console.log(`Tìm: "${q}"`);
      const found = await searchVideos(q);
      const seen = new Set(videos.map((v) => v.videoId));
      videos.push(...found.filter((v) => !seen.has(v.videoId)));
    }
    await writeFile(CACHE_FILE, JSON.stringify(videos, null, 2), "utf8");
  }

  const targets = videos.slice(0, MAX_VIDEOS);
  console.log(`\nKéo bình luận từ ${targets.length} video...\n`);

  // 2. Kéo bình luận → RawPost (khớp web/types/discourse.ts).
  const posts = [];
  for (const v of targets) {
    const comments = await fetchComments(v.videoId, MAX_COMMENTS_PER_VIDEO);
    console.log(`  ${comments.length.toString().padStart(3)} bình luận — ${v.title.slice(0, 60)}`);
    for (const c of comments) {
      posts.push({
        postId: `yt-${c.commentId}`,
        channel: "youtube",
        // URL trỏ thẳng tới bình luận gốc — người kiểm chứng phải mở lại được nguồn.
        url: `https://www.youtube.com/watch?v=${c.videoId}&lc=${c.commentId}`,
        text: c.text,
        publishedAt: c.publishedAt,
        sourceContext: { videoTitle: v.title, channelTitle: v.channelTitle, likeCount: c.likeCount },
      });
    }
  }

  // 3. Khử trùng lặp theo postId.
  const unique = [...new Map(posts.map((p) => [p.postId, p])).values()];
  await writeFile(OUT_FILE, JSON.stringify(unique, null, 2), "utf8");

  console.log(
    `\nXong. ${unique.length} bình luận → ${path.relative(ROOT, OUT_FILE)}\n` +
      `Quota đã dùng: ${quota.search} lần search (trần ~100/ngày) · ${quota.units} unit ` +
      `(trần 10.000/ngày)\n` +
      `Lần chạy sau thêm --no-search để không tốn lần search nào.`
  );
}

main().catch((err) => {
  console.error(`\nLỗi: ${err.message}`);
  process.exit(1);
});
