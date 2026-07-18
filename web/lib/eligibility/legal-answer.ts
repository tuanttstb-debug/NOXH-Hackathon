import { allArticles, statusLabel, aspectLabel, type ArticleWithDocument } from "@/lib/legal-search";
import { toCitation } from "./legal-kg";
import { callChat, extractJson } from "@/lib/llm-client";
import type { Citation } from "@/types/legal";

/**
 * Trả lời câu hỏi TRA CỨU pháp lý (vd "So sánh Nghị định 261/2025 và 136/2026").
 *
 * Cùng nguyên tắc với luồng xét điều kiện: **truy xuất bằng code xác định từ Legal KG**, LLM chỉ
 * diễn giải nội dung đã truy xuất. LLM KHÔNG được thêm điều khoản, số liệu hay văn bản nào ngoài
 * payload — đây là lý do câu trả lời luôn có trích dẫn kiểm chứng được.
 *
 * Giới hạn trung thực: KG hiện chỉ nạp 4 văn bản lõi (xem PROJECT_STATE.md). Câu hỏi về 10 văn bản
 * còn lại sẽ không có dữ liệu — khi đó hàm này trả về `null` để tầng trên nói thẳng là chưa có,
 * thay vì để LLM bịa.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

export interface Retrieval {
  articles: ArticleWithDocument[];
  /** Văn bản người dùng nhắc đích danh nhưng KHÔNG có trong Knowledge Graph. */
  unmatchedRefs: string[];
}

/**
 * Tìm điều khoản liên quan tới câu hỏi.
 *
 * ⚠️ QUY TẮC CHỐNG GÁN SAI NGUỒN (sửa 2026-07-19 — lỗi do chính bản đầu của file này gây ra):
 * nếu người dùng nhắc ĐÍCH DANH một văn bản, mà văn bản đó không có trong KG, thì TUYỆT ĐỐI
 * KHÔNG được rơi xuống tìm theo từ khoá. Bản đầu làm vậy: hỏi "Thông tư 09/2021 quy định gì về
 * nhà ở xã hội?" thì "nhà ở xã hội" khớp mọi điều khoản, hệ thống trả về nội dung của 4 nghị định
 * khác kèm 6 trích dẫn mà không hề nói rằng nó không có dữ liệu về TT 09/2021 — người đọc sẽ hiểu
 * đó là nội dung của văn bản mình hỏi. Đây là gán sai nguồn, đúng loại lỗi dự án này sinh ra để tránh.
 */
export function retrieveArticles(question: string): Retrieval {
  const q = normalize(question);

  /*
   * Mã văn bản người dùng nhắc đích danh: "261/2025", "NĐ 136/2026", "nghị định 136", "thông tư 09".
   *
   * ⚠️ KHỚP THEO CẤU TRÚC số/năm, KHÔNG khớp chuỗi con. Bản đầu dùng `code.includes(ref)` và đã sai
   * theo 2 cách âm thầm:
   *  - "Thông tư 09/2021": lookahead backtrack bắt ra số "0", rồi "136/2026".includes("0") = true
   *    ⇒ trả về TOÀN BỘ điều khoản cho một văn bản không hề có trong KG.
   *  - "Nghị định 136/2026": backtrack bắt ra "13" ⇒ báo thiếu nhầm "văn bản 13".
   * `(?![\d/])` chặn khớp một phần; so sánh number/year tách rời chặn khớp chuỗi con.
   */
  // Khớp trên bản ĐÃ KHỬ DẤU: người Việt gõ không dấu rất phổ biến ("nghi dinh 136", "thong tu 05").
  const fullCodes = [...question.matchAll(/(\d{1,3})\s*\/\s*(20\d{2})/g)].map(
    (m) => `${Number(m[1])}/${m[2]}`
  );
  const bareNumbers = [
    ...q.matchAll(/(?:nghi\s*dinh|nd|thong\s*tu|tt|luat)\s*(\d{1,3})(?![\d/])/g),
  ].map((m) => String(Number(m[1])));

  /** "136/2026/NĐ-CP" → { num: "136", year: "2026" }. Trả null nếu mã không theo dạng số/năm. */
  const parseCode = (code: string) => {
    const m = code.match(/(\d{1,3})\s*\/\s*(\d{4})/);
    return m ? { num: String(Number(m[1])), year: m[2] } : null;
  };

  const codeMatches = (code: string, ref: string) => {
    const parsed = parseCode(code);
    if (!parsed) return false;
    return ref.includes("/") ? `${parsed.num}/${parsed.year}` === ref : parsed.num === ref;
  };

  const explicitRefs = [...new Set([...fullCodes, ...bareNumbers])];
  if (explicitRefs.length > 0) {
    const matched = new Set<string>();
    const articles = allArticles.filter(({ document }) => {
      const hit = explicitRefs.find((ref) => codeMatches(document.code, ref));
      if (hit) matched.add(hit);
      return Boolean(hit);
    });
    return {
      articles,
      unmatchedRefs: explicitRefs.filter((r) => !matched.has(r)),
    };
  }

  // Không nhắc văn bản nào cụ thể → tìm theo từ khoá nội dung.
  const STOPWORDS = new Set([
    "la", "gi", "the", "nao", "cho", "toi", "cua", "va", "voi", "co", "khong", "duoc", "nhu",
    "ve", "o", "tai", "thi", "bao", "nhieu", "hien", "nay", "so", "sanh", "khac", "quy", "dinh",
  ]);
  const tokens = q.split(/\s+/).filter((t) => t.length > 2 && !STOPWORDS.has(t));
  if (tokens.length === 0) return { articles: [], unmatchedRefs: [] };

  return {
    articles: allArticles.filter(({ article, document }) => {
      const haystack = normalize(
        [article.label, article.summary, document.code, document.title, aspectLabel(article.aspect)].join(" ")
      );
      return tokens.some((t) => haystack.includes(t));
    }),
    unmatchedRefs: [],
  };
}

const LEGAL_SYSTEM_PROMPT = `Bạn là trợ lý tra cứu văn bản pháp luật về Nhà ở xã hội (NOXH) tại Việt Nam.

QUY TẮC TUYỆT ĐỐI:
- CHỈ dùng thông tin trong "dieu_khoan" được cung cấp. TUYỆT ĐỐI KHÔNG thêm điều khoản, con số,
  ngày tháng hay tên văn bản nào không có trong dữ liệu đó — kể cả khi bạn "biết" từ nguồn khác.
- Nếu dữ liệu không đủ để trả lời, nói thẳng là chưa có dữ liệu, KHÔNG suy đoán.
- Chú ý trường "trang_thai": "Đang hiệu lực" nghĩa là quy định hiện hành; "Đã bị sửa đổi"/"Đã bị
  thay thế" nghĩa là KHÔNG còn áp dụng. Khi so sánh, phải nói rõ cái nào đang áp dụng hôm nay.

Trả về DUY NHẤT 1 JSON object, không thêm chữ nào khác:
{
  "headline": string,   // tiêu đề ngắn gọn (tối đa 12 từ), nêu đúng nội dung câu trả lời
  "reason": string,     // trả lời chi tiết, tiếng Việt dễ hiểu. Nêu rõ điều/khoản và văn bản. Nếu là so sánh, chỉ ra khác biệt cụ thể và quy định nào đang áp dụng.
  "suggestion": string  // 1 câu gợi ý bước tiếp theo
}`;

export interface LegalAnswer {
  headline: string;
  reason: string;
  suggestion: string;
  citations: Citation[];
}

export async function answerLegalQuestion(question: string): Promise<LegalAnswer | null> {
  const { articles, unmatchedRefs } = retrieveArticles(question);
  if (articles.length === 0) return null;

  // Giới hạn 8 điều khoản: đủ cho mọi câu so sánh trong KG hiện tại, tránh payload phình to.
  const selected = articles.slice(0, 8);

  const payload = {
    cau_hoi: question,
    dieu_khoan: selected.map(({ article, document }) => ({
      dieu_khoan: article.label,
      van_ban: document.title,
      ma_hieu: document.code,
      khia_canh: aspectLabel(article.aspect),
      noi_dung: article.summary,
      ngay_hieu_luc: article.effectiveDate,
      trang_thai: statusLabel(article.status),
    })),
  };

  const raw = await callChat([
    { role: "system", content: LEGAL_SYSTEM_PROMPT },
    { role: "user", content: JSON.stringify(payload) },
  ]);

  const parsed = extractJson<{ headline: string; reason: string; suggestion: string }>(raw);
  if (!parsed) {
    throw new Error("Không parse được JSON từ bước trả lời tra cứu pháp lý.");
  }

  // Công bố phần KHÔNG trả lời được, ngay trong câu trả lời — không để người đọc tưởng nội dung
  // dưới đây là của văn bản họ hỏi. Ghép bằng code, không giao cho LLM tự nhớ mà nói.
  const disclosure =
    unmatchedRefs.length > 0
      ? `⚠️ Lưu ý: hệ thống chưa có dữ liệu về ${unmatchedRefs
          .map((r) => `văn bản ${r}`)
          .join(", ")} nên phần dưới KHÔNG bao gồm văn bản đó. `
      : "";

  return {
    headline: parsed.headline,
    reason: disclosure + parsed.reason,
    suggestion: parsed.suggestion,
    citations: selected
      .map(({ article }) => toCitation(article.id))
      .filter((c): c is Citation => c !== null),
  };
}
