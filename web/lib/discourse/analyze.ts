import { legalArticles } from "@/mock/legal-documents";
import type {
  AnalyzedPost,
  ClaimAggregate,
  ControversyLevel,
  RawPost,
  TrendStatus,
} from "@/types/discourse";

/**
 * Public Discourse Filter — toàn bộ phần XÁC ĐỊNH của pipeline (không gọi LLM).
 * Đối chiếu: docs/features/PUBLIC_DISCOURSE_FILTER.md §3 (Ingestion Filter), §5 (Velocity),
 * §6 (Controversy), §7 (PII Redaction).
 *
 * Cùng nguyên tắc kiến trúc với 2 module trước: LLM chỉ làm phần trích xuất ngôn ngữ,
 * mọi quyết định gắn cờ/ưu tiên đều là code xác định — để kết luận không trôi theo prompt.
 */

/** §3.2 Keyword Gate — giữ nguyên logic gốc. Bài không chạm chủ đề NOXH bị loại trước khi tốn 1 token LLM. */
const KEYWORDS = [
  "nha o xa hoi",
  "noxh",
  "nha xa hoi",
  "nghi dinh 100",
  "nghi dinh 136",
  "nghi dinh 54",
  "nghi dinh 261",
  "thu nhap thap",
  "mua nha gia re",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

export function passesKeywordGate(post: RawPost): boolean {
  const t = normalize(post.text);
  return KEYWORDS.some((k) => t.includes(k));
}

/** §3.3 Content Quality Gate (rút gọn) — loại bài quá ngắn hoặc chỉ là link/emoji. */
export function passesQualityGate(post: RawPost): boolean {
  const stripped = post.text.replace(/https?:\/\/\S+/g, "").trim();
  if (stripped.length < 40) return false;
  const letters = stripped.replace(/[^\p{L}]/gu, "").length;
  return letters / stripped.length > 0.5;
}

/**
 * §7 PII Redaction — rule-based, chạy TRƯỚC khi text đi tới LLM hay được ghi log.
 * Che số điện thoại, email, CCCD. Tên riêng KHÔNG che được bằng rule — đây là known limitation
 * đã ghi trong tài liệu gốc, không được che giấu bằng cách vờ như đã xử lý.
 */
export function redactPii(text: string): string {
  return text
    .replace(/\b(?:\+?84|0)(?:\d[ .-]?){8,10}\d\b/g, "[SĐT đã ẩn]")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g, "[email đã ẩn]")
    .replace(/\b\d{9}\b|\b\d{12}\b/g, "[số giấy tờ đã ẩn]");
}

export function prefilter(posts: RawPost[]): { kept: RawPost[]; rejected: number } {
  const kept = posts.filter((p) => passesKeywordGate(p) && passesQualityGate(p));
  return { kept, rejected: posts.length - kept.length };
}

/** §5 Velocity — công thức đơn giản hoá; không có baseline 7 ngày nên dùng ngưỡng tuyệt đối. */
function trendStatusFor(mentionCount6h: number, spreadBreadth: number): TrendStatus {
  if (mentionCount6h >= 5 && spreadBreadth >= 2) return "surging";
  if (mentionCount6h >= 3) return "rising";
  return "stable";
}

/** §6.2 Controversy — heuristic thô: đếm bài trái chiều sentiment trong cùng claim. */
function controversyFor(sentiments: string[]): ControversyLevel {
  const negative = sentiments.filter((s) => s === "negative").length;
  const positive = sentiments.filter((s) => s === "positive").length;
  const opposing = Math.min(negative, positive);
  if (opposing >= 3) return "high";
  if (opposing >= 1) return "medium";
  return "low";
}

/**
 * Gợi ý điều khoản liên quan để NGƯỜI xác minh đối chiếu — không phải phán quyết đúng/sai.
 * Ranh giới này là quy tắc AI Safety quan trọng nhất của module: tài liệu gốc §1 đã cắt hoàn toàn
 * Claim Verification Agent khỏi scope vì "đây là rủi ro AI Safety lớn nhất nếu làm vội trong 36h".
 */
function relatedArticlesFor(claimNormalized: string): string[] {
  const t = normalize(claimNormalized);
  const aspects: string[] = [];
  if (/(thu nhap|trieu|luong|tran)/.test(t)) aspects.push("tran_thu_nhap");
  if (/(nha o|so huu|co nha|chua co nha)/.test(t)) aspects.push("dieu_kien_nha_o");
  if (/(xac nhan|cong an|ubnd|tham quyen)/.test(t)) aspects.push("tham_quyen_xac_nhan");
  if (/(tinh|thanh pho|dia phuong|he so)/.test(t)) aspects.push("he_so_dieu_chinh_cap_tinh");

  return legalArticles
    .filter((a) => a.status === "active" && a.aspect && aspects.includes(a.aspect))
    .map((a) => a.id);
}

/** Gộp theo claim và áp rule gắn cờ P1 (§5 "Rule cảnh báo rút gọn"). */
export function aggregateClaims(analyzed: AnalyzedPost[]): ClaimAggregate[] {
  const byClaim = new Map<string, { posts: AnalyzedPost[]; claim: AnalyzedPost["claims"][number] }>();

  analyzed.forEach((a) => {
    a.claims.forEach((c) => {
      const entry = byClaim.get(c.claimId);
      if (entry) entry.posts.push(a);
      else byClaim.set(c.claimId, { posts: [a], claim: c });
    });
  });

  return [...byClaim.values()]
    .map(({ posts, claim }) => {
      const mentionCount6h = posts.length;
      const spreadBreadth = new Set(posts.map((p) => p.post.channel)).size;
      const trendStatus = trendStatusFor(mentionCount6h, spreadBreadth);
      const controversyLevel = controversyFor(posts.map((p) => p.sentimentLabel));

      // Rule cảnh báo: đang lan nhanh VÀ (ngôn ngữ tuyệt đối HOẶC bỏ qua điều kiện) → P1.
      const priority: ClaimAggregate["priority"] =
        trendStatus === "surging" && (claim.claimAbsoluteLanguage || claim.claimOmitsConditions)
          ? "P1"
          : "P2";

      return {
        claimId: claim.claimId,
        claimNormalized: claim.claimNormalized,
        claimType: claim.claimType,
        claimOmitsConditions: claim.claimOmitsConditions,
        claimAbsoluteLanguage: claim.claimAbsoluteLanguage,
        mentionCount6h,
        spreadBreadth,
        trendStatus,
        controversyLevel,
        priority,
        postUrls: posts.map((p) => p.post.url),
        relatedArticleIds: relatedArticlesFor(claim.claimNormalized),
      } satisfies ClaimAggregate;
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "P1" ? -1 : 1;
      return b.mentionCount6h - a.mentionCount6h;
    });
}
