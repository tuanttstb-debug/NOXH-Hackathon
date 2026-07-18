import { createHash } from "crypto";
import { callChat, extractJson } from "@/lib/llm-client";
import { redactPii } from "./analyze";
import type { AnalyzedPost, ExtractedClaim, RawPost } from "@/types/discourse";

/**
 * §4 — Topic + Claim + Sentiment gộp 1 lượt LLM (docs/features/PUBLIC_DISCOURSE_FILTER.md).
 * LLM chỉ TRÍCH XUẤT những gì có trong bài; mọi việc gắn cờ/xếp ưu tiên do `analyze.ts` quyết định.
 */

const SYSTEM_PROMPT = `Bạn là bước trích xuất trong pipeline giám sát thông tin sai lệch về chính sách Nhà ở xã hội (NOXH) Việt Nam.
Bạn KHÔNG đánh giá bài đăng đúng hay sai, KHÔNG đưa ra kết luận pháp lý. Bạn chỉ trích xuất cấu trúc từ nội dung có sẵn.

Trả về DUY NHẤT 1 JSON object, không thêm chữ nào khác:
{
  "topic_l1": string,              // 1 trong: "dieu_kien_thu_huong", "thu_tuc_ho_so", "tai_chinh_gia_ban", "du_an_tien_do", "khac"
  "sentiment_label": "positive" | "negative" | "neutral",
  "emotion_tags": string[],        // tập con của ["lo_lang","buc_xuc","hy_vong"], có thể rỗng
  "affected_group": string | null, // nhóm đối tượng bị ảnh hưởng nếu bài có nêu, vd "người độc thân", "công nhân"
  "claims": [
    {
      "claim_text_raw": string,        // trích NGUYÊN VĂN từ bài, không diễn đạt lại
      "claim_normalized": string,      // [Chủ thể] + [được/phải/bị cấm] + [hành vi] + [điều kiện] + [thời điểm]
      "claim_type": "eligibility" | "procedure" | "financial" | "other",
      "claim_polarity": "assertion" | "question" | "warning",
      "claim_subject": string,
      "claim_omits_conditions": boolean,   // true nếu khẳng định một quyền lợi mà BỎ QUA các điều kiện kèm theo
      "claim_absolute_language": boolean   // true nếu dùng "chắc chắn", "ai cũng", "luôn luôn", "100%", "không cần"...
    }
  ]
}

Quy tắc:
- Chỉ trích xuất claim về CHÍNH SÁCH NOXH. Bài chỉ than vãn/hỏi thăm mà không khẳng định điều gì về chính sách thì "claims" để rỗng.
- "claim_text_raw" phải là chuỗi con xuất hiện thật trong bài. KHÔNG bịa.
- Nếu bài không nêu nhóm đối tượng, "affected_group" để null — KHÔNG suy đoán.`;

interface RawExtraction {
  topic_l1: string;
  sentiment_label: AnalyzedPost["sentimentLabel"];
  emotion_tags: string[];
  affected_group: string | null;
  claims: Array<{
    claim_text_raw: string;
    claim_normalized: string;
    claim_type: ExtractedClaim["claimType"];
    claim_polarity: ExtractedClaim["claimPolarity"];
    claim_subject: string;
    claim_omits_conditions: boolean;
    claim_absolute_language: boolean;
  }>;
}

/**
 * Cụm từ chỉ mức độ khẳng định — KHÔNG thuộc về danh tính của claim.
 * Chúng đã được lưu riêng thành `claimAbsoluteLanguage` / `claimOmitsConditions`, nên loại khỏi
 * hash không mất thông tin. Giữ lại thì cùng một claim diễn đạt khác nhau bị tách thành nhiều
 * claim_id, mỗi cái đếm 1 lượt, `trend_status` không bao giờ đạt `surging` và rule gắn cờ P1
 * (§5) gần như không bao giờ kích hoạt — đã quan sát thấy khi chạy thật trên fixture.
 */
const IDENTITY_NOISE = [
  "chac chan",
  "luon luon",
  "100%",
  "ai cung",
  "khong can dieu kien gi them",
  "khong can dieu kien",
  "khong can lo gi",
  "deu",
  "hoan toan",
];

/**
 * claim_id = hash của claim_normalized đã chuẩn hoá.
 * Known limitation còn lại (§1): claim dùng từ đồng nghĩa hoặc cấu trúc câu khác hẳn vẫn bị tách
 * riêng. Sửa triệt để cần clustering ngữ nghĩa bằng embedding — đã bị cắt khỏi scope 36h.
 */
function claimIdOf(claimNormalized: string): string {
  let key = claimNormalized
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 ]/g, " ");

  IDENTITY_NOISE.forEach((phrase) => {
    key = key.replaceAll(phrase, " ");
  });

  key = key.replace(/\s+/g, " ").trim();
  return "clm_" + createHash("sha1").update(key).digest("hex").slice(0, 8);
}

const VALID_EMOTIONS = new Set(["lo_lang", "buc_xuc", "hy_vong"]);

export async function extractFromPost(post: RawPost): Promise<AnalyzedPost | null> {
  // PII bị che TRƯỚC khi text rời khỏi máy chủ của chúng ta — §7.
  const redactedText = redactPii(post.text);

  const raw = await callChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: redactedText },
  ]);

  const parsed = extractJson<RawExtraction>(raw);
  if (!parsed) return null;

  const claims: ExtractedClaim[] = (parsed.claims ?? [])
    // Bỏ claim mà LLM bịa ra: `claim_text_raw` phải thật sự xuất hiện trong bài.
    .filter((c) => c.claim_text_raw && redactedText.includes(c.claim_text_raw.trim().slice(0, 25)))
    .map((c) => ({
      claimId: claimIdOf(c.claim_normalized),
      claimTextRaw: c.claim_text_raw,
      claimNormalized: c.claim_normalized,
      claimType: c.claim_type,
      claimPolarity: c.claim_polarity,
      claimSubject: c.claim_subject,
      claimOmitsConditions: Boolean(c.claim_omits_conditions),
      claimAbsoluteLanguage: Boolean(c.claim_absolute_language),
    }));

  return {
    post,
    redactedText,
    topicL1: parsed.topic_l1 ?? "khac",
    sentimentLabel: parsed.sentiment_label ?? "neutral",
    emotionTags: (parsed.emotion_tags ?? []).filter((t): t is AnalyzedPost["emotionTags"][number] =>
      VALID_EMOTIONS.has(t)
    ),
    affectedGroup: parsed.affected_group ?? null,
    claims,
  };
}
