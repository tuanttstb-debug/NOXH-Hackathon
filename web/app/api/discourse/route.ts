import { NextResponse } from "next/server";
import { aggregateClaims, prefilter } from "@/lib/discourse/analyze";
import { extractFromPost } from "@/lib/discourse/extract";
import { syntheticPosts } from "@/mock/discourse-fixtures";
import type { AnalyzedPost, RawPost } from "@/types/discourse";

/**
 * Public Discourse Filter — xử lý theo BATCH một lần, không realtime, không cron
 * (docs/features/PUBLIC_DISCOURSE_FILTER.md §1 — đánh đổi có chủ đích cho scope 36h).
 *
 * Hệ thống KHÔNG tự xác minh và KHÔNG tự publish kết luận đúng/sai. Output chỉ gắn cờ
 * `priority: P1` để CON NGƯỜI xác minh — Claim Verification Agent đã bị cắt khỏi scope
 * vì là rủi ro AI Safety lớn nhất nếu làm vội.
 */
export async function POST(req: Request) {
  let body: { posts?: RawPost[]; useSyntheticFixtures?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Body phải là JSON hợp lệ." } },
      { status: 400 }
    );
  }

  const posts = body.useSyntheticFixtures ? syntheticPosts : body.posts ?? [];
  if (posts.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: "NO_POSTS",
          message:
            "Chưa có bài đăng nào để phân tích. Gửi mảng 'posts', hoặc đặt 'useSyntheticFixtures': true để chạy thử pipeline bằng dữ liệu GIẢ LẬP.",
        },
      },
      { status: 400 }
    );
  }

  const usingSynthetic = posts.some((p) => p.synthetic);

  const { kept, rejected } = prefilter(posts);

  const analyzed: AnalyzedPost[] = [];
  const failed: string[] = [];
  for (const post of kept) {
    try {
      const result = await extractFromPost(post);
      if (result) analyzed.push(result);
      else failed.push(post.postId);
    } catch (err) {
      if (analyzed.length === 0 && failed.length === 0) {
        // Lỗi ngay bài đầu tiên gần như chắc chắn là lỗi cấu hình, không phải lỗi dữ liệu.
        return NextResponse.json(
          {
            error: {
              code: "LLM_PROVIDER_ERROR",
              message: err instanceof Error ? err.message : "Lỗi không xác định khi gọi LLM.",
            },
          },
          { status: 502 }
        );
      }
      failed.push(post.postId);
    }
  }

  const claims = aggregateClaims(analyzed);

  return NextResponse.json({
    warning: usingSynthetic
      ? "⚠️ Kết quả tính trên DỮ LIỆU GIẢ LẬP (synthetic). Không dùng để demo hay báo cáo."
      : undefined,
    stats: {
      received: posts.length,
      rejectedByGate: rejected,
      analyzed: analyzed.length,
      failedExtraction: failed.length,
      claimsFound: claims.length,
      flaggedP1: claims.filter((c) => c.priority === "P1").length,
    },
    claims,
    note: "Hệ thống chỉ phát hiện và gắn cờ. Việc xác minh claim đúng/sai do con người thực hiện — xem docs/features/PUBLIC_DISCOURSE_FILTER.md §1.",
  });
}
