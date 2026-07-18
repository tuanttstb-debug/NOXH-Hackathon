/**
 * Public Discourse Filter — kiểu dữ liệu.
 * Đối chiếu: docs/features/PUBLIC_DISCOURSE_FILTER.md (bản rút gọn 36h).
 * Các trường đã bị cắt khỏi MVP (claim_conditions, sentiment_intensity, claim_cluster_id)
 * KHÔNG khai báo ở đây — xem mục 1 "Bảng cắt giảm phạm vi" của tài liệu gốc.
 */

export type SourceChannel =
  | "youtube"
  | "facebook"
  | "threads"
  | "tiktok"
  | "bao_chi"
  | "dien_dan";

/** Bài đăng thô đầu vào — mọi bài phải có nguồn tra được, không nhận bài không rõ xuất xứ. */
export interface RawPost {
  postId: string;
  channel: SourceChannel;
  /** URL bài gốc. Bắt buộc — không có thì không đưa vào pipeline. */
  url: string;
  text: string;
  publishedAt: string; // ISO datetime
  /** Đánh dấu dữ liệu giả lập dùng để phát triển. Bài thật để `false`/bỏ trống. */
  synthetic?: boolean;
  /** Ngữ cảnh nguồn (tiêu đề video, tên kênh, lượt thích...) — để người kiểm chứng có bối cảnh. */
  sourceContext?: Record<string, string | number>;
}

export type ClaimType = "eligibility" | "procedure" | "financial" | "other";
export type ClaimPolarity = "assertion" | "question" | "warning";
export type SentimentLabel = "positive" | "negative" | "neutral";
export type EmotionTag = "lo_lang" | "buc_xuc" | "hy_vong";
export type TrendStatus = "stable" | "rising" | "surging";
export type ControversyLevel = "low" | "medium" | "high";

export interface ExtractedClaim {
  claimId: string;
  claimTextRaw: string;
  /** [Chủ thể] + [được/phải/bị cấm] + [hành vi] + [điều kiện] + [thời điểm] */
  claimNormalized: string;
  claimType: ClaimType;
  claimPolarity: ClaimPolarity;
  claimSubject: string;
  /** Tín hiệu giá trị nhất của cả thiết kế (tài liệu gốc §4.2) — claim bỏ qua điều kiện kèm theo. */
  claimOmitsConditions: boolean;
  /** Dùng ngôn ngữ tuyệt đối: "chắc chắn", "ai cũng", "luôn luôn"... */
  claimAbsoluteLanguage: boolean;
}

export interface AnalyzedPost {
  post: RawPost;
  /** Text đã che PII — chỉ trường này được hiển thị/ghi log, không dùng `post.text`. */
  redactedText: string;
  topicL1: string;
  sentimentLabel: SentimentLabel;
  emotionTags: EmotionTag[];
  affectedGroup: string | null;
  claims: ExtractedClaim[];
}

/** Tổng hợp theo claim — đơn vị hiển thị trên dashboard. */
export interface ClaimAggregate {
  claimId: string;
  claimNormalized: string;
  claimType: ClaimType;
  claimOmitsConditions: boolean;
  claimAbsoluteLanguage: boolean;
  mentionCount6h: number;
  /** Số kênh khác nhau chứa claim — cách rẻ nhất chống seeding (tài liệu gốc §5). */
  spreadBreadth: number;
  trendStatus: TrendStatus;
  controversyLevel: ControversyLevel;
  /** P1 = cần người xác minh. Hệ thống KHÔNG tự xác minh/publish — cắt có chủ đích. */
  priority: "P1" | "P2";
  postUrls: string[];
  /** Điều khoản trong Legal KG có liên quan để người kiểm chứng đối chiếu. Không phải kết luận đúng/sai. */
  relatedArticleIds: string[];
}
