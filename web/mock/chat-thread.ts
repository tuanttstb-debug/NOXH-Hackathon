import type { ChatMessage, QuickSkill, HistoryItem } from "@/types/chat";
import type { Citation } from "@/types/legal";
import { legalDocuments, legalArticles } from "@/mock/legal-documents";

/**
 * Dựng Citation từ articleId, lấy nhãn/ngày hiệu lực/độ tin cậy TRỰC TIẾP từ Legal KG.
 * Trước 2026-07-18 các citation trong file này hard-code lại nhãn + `confidence` nên lệch khỏi KG
 * mỗi khi dữ liệu pháp lý được cập nhật — đã xảy ra thật khi đối chiếu toàn văn NĐ 136/2026.
 * Dẫn xuất từ một nguồn duy nhất để lỗi lệch đó không tái diễn.
 */
function cite(articleId: string): Citation {
  const article = legalArticles.find((a) => a.id === articleId);
  if (!article) throw new Error(`Mock chat-thread: không tìm thấy điều khoản "${articleId}" trong Legal KG.`);
  const doc = legalDocuments.find((d) => d.id === article.documentId);
  if (!doc) throw new Error(`Mock chat-thread: không tìm thấy văn bản "${article.documentId}" trong Legal KG.`);
  return {
    articleId: article.id,
    documentCode: doc.code,
    documentTitle: doc.title,
    articleLabel: article.label,
    effectiveDate: article.effectiveDate,
    confidence: article.confidence,
    sourceUrl: doc.sourceUrl,
  };
}

const citationDieu30_136 = cite("art-dieu-30-nd136");
const citationDieu30_k1d = cite("art-dieu-30-k1d-nd136");
const citationDieu29_54 = cite("art-dieu-29-k1-nd54");
const citationDieu29_100 = cite("art-dieu-29-k1-nd100");

/** Vợ chồng thu nhập 55 triệu — vượt trần 50 triệu (NĐ 136/2026, Điều 30 k1 điểm b). */
export const notEligibleResult = {
  verdict: "not_eligible" as const,
  headline: "KHÔNG ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội",
  reason:
    "Tổng thu nhập của hộ gia đình (55 triệu/tháng) vượt mức trần cho phép với người đã kết hôn. Để đủ điều kiện, tổng thu nhập vợ chồng không được vượt 50 triệu/tháng theo quy định chung của cả nước.",
  threshold: {
    label: "Tổng thu nhập vợ chồng so với ngưỡng cho phép",
    userValue: 55,
    limitValue: 50,
    unit: "triệu đ/tháng",
  },
  citations: [citationDieu30_136, citationDieu30_k1d],
  suggestion:
    "Bạn có muốn tìm hiểu các hình thức mua nhà ở thương mại phù hợp với mức thu nhập này không?",
};

/** TC-03: Đã có nhà ở thuộc sở hữu → không đủ điều kiện về nhà ở. */
export const hasHouseResult = {
  verdict: "not_eligible" as const,
  headline: "KHÔNG ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội",
  reason:
    "Bạn hoặc vợ/chồng đang có nhà ở thuộc sở hữu tại tỉnh/thành phố nơi đăng ký mua NOXH. Đây là điều kiện loại trừ bắt buộc — không có ngoại lệ.",
  citations: [citationDieu29_54, citationDieu29_100],
  suggestion:
    "Nếu đang có nhà nhưng muốn cải thiện, bạn có thể tìm hiểu các dự án nhà ở thương mại lãi suất ưu đãi.",
};

/**
 * Kịch bản demo — đối chiếu knowledge/evaluation/eligibility_test_cases.md
 * TC-01 (Đủ điều kiện) nối tiếp TC-04 (Thiếu thông tin — hệ số điều chỉnh cấp tỉnh).
 * Nội dung m4 khớp với output THẬT của `/api/eligibility` (chạy 2026-07-18), không phải văn bịa.
 */
export const initialThread: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Tôi độc thân, chưa có nhà, lương 18 triệu, ở Bình Dương. Tôi có đủ điều kiện mua NOXH không?",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    extractedFields: [
      { label: "Tình trạng hôn nhân", value: "Độc thân chưa kết hôn" },
      { label: "Tình trạng nhà ở", value: "Chưa có nhà" },
      { label: "Thu nhập", value: "18.000.000 đ/tháng" },
      { label: "Nơi cư trú", value: "Bình Dương" },
    ],
    reasoningSteps: [
      { label: "Xác định nhóm đối tượng: độc thân chưa kết hôn", status: "done" },
      { label: "Đối chiếu Điều 29 — điều kiện nhà ở (NĐ 54/2026)", status: "done" },
      { label: "Đối chiếu Điều 30 — điều kiện thu nhập (NĐ 136/2026)", status: "done" },
      { label: "Fact-Check: xác nhận điều khoản đang hiệu lực", status: "done" },
    ],
    result: {
      verdict: "eligible",
      headline: "ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội",
      reason:
        "Thu nhập của bạn (18 triệu/tháng) thấp hơn mức trần cho phép với người độc thân, và bạn chưa có nhà ở thuộc sở hữu.",
      threshold: {
        label: "Thu nhập của bạn so với ngưỡng cho phép",
        userValue: 18,
        limitValue: 25,
        unit: "triệu đ/tháng",
      },
      citations: [citationDieu30_136, citationDieu29_54],
      suggestion: "Bạn có muốn biết bước tiếp theo cần chuẩn bị hồ sơ gì không?",
    },
    timestamp: "09:41",
  },
  {
    id: "m3",
    role: "user",
    text: "Nếu lương tôi tăng lên 30 triệu và tôi mua ở TP.HCM thì sao?",
    timestamp: "09:44",
  },
  {
    id: "m4",
    role: "assistant",
    extractedFields: [
      { label: "Thu nhập", value: "30.000.000 đ/tháng (cập nhật)" },
      { label: "Nơi cư trú", value: "TP. Hồ Chí Minh" },
    ],
    reasoningSteps: [
      { label: "Cập nhật thu nhập: 30 triệu đ/tháng", status: "done" },
      { label: "So với trần trung ương nhóm độc thân: 25 triệu — đã vượt", status: "done" },
      { label: "Kiểm tra quyền điều chỉnh của UBND cấp tỉnh (Điều 30 k1 điểm d)", status: "done" },
      { label: "Tra quyết định hệ số của TP. Hồ Chí Minh", status: "active" },
    ],
    result: {
      verdict: "insufficient_data",
      headline: "CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN",
      reason:
        "Thu nhập của bạn cao hơn mức trần chung của cả nước (25 triệu/tháng), nhưng UBND cấp tỉnh có quyền quyết định hệ số điều chỉnh nâng mức trần này theo mức sống địa phương. Hệ thống chưa có dữ liệu quyết định của TP. Hồ Chí Minh nên chưa thể kết luận bạn không đủ điều kiện.",
      threshold: {
        label: "Thu nhập của bạn so với ngưỡng trung ương (Độc thân chưa kết hôn)",
        userValue: 30,
        limitValue: 25,
        unit: "triệu đ/tháng",
      },
      citations: [citationDieu30_136, citationDieu30_k1d],
      suggestion:
        "Bạn nên liên hệ Sở Xây dựng TP. Hồ Chí Minh để hỏi mức trần áp dụng tại địa phương.",
    },
    timestamp: "09:44",
  },
];

export const quickSkills: QuickSkill[] = [
  {
    id: "eligibility",
    label: "Kiểm tra điều kiện",
    description: "Đủ/không đủ điều kiện mua NOXH, có căn cứ",
    icon: "eligibility",
  },
  {
    id: "search",
    label: "Tra cứu văn bản",
    description: "Tìm đúng điều khoản đang hiệu lực",
    icon: "search",
  },
  {
    id: "factcheck",
    label: "Fact Check",
    description: "Đối chiếu tin tức/bài đăng với luật thật",
    icon: "factcheck",
  },
  {
    id: "diff",
    label: "So sánh văn bản",
    description: "2 nghị định khác nhau ở đâu",
    icon: "diff",
  },
];

export const historyItems: HistoryItem[] = [
  {
    id: "h1",
    title: "Điều kiện mua NOXH — độc thân",
    preview: "Tôi độc thân, chưa có nhà, lương 18 triệu...",
    updatedAt: "Hôm nay, 09:44",
  },
  {
    id: "h2",
    title: "Lãi suất vay ưu đãi NOXH 2026",
    preview: "Mức lãi suất hiện hành là bao nhiêu?",
    updatedAt: "Hôm qua",
  },
  {
    id: "h3",
    title: "So sánh NĐ 100/2024 và NĐ 261/2025",
    preview: "Hai nghị định khác nhau ở điều khoản nào?",
    updatedAt: "3 ngày trước",
  },
];

export const promptSuggestions: string[] = [
  "Tôi mới cưới, lương 2 vợ chồng 35 triệu, có đủ điều kiện không?",
  "Thủ tục xác nhận thu nhập hiện nay do ai cấp?",
  "So sánh Nghị định 261/2025 và 136/2026",
];

/** Ví dụ dành riêng cho Eligibility Checker (Focus Mode) — chỉ xoay quanh việc kiểm tra điều kiện. */
export const eligibilityExamplePrompts: string[] = [
  "Tôi độc thân, chưa có nhà, lương 18 triệu, ở Bình Dương. Tôi có đủ điều kiện mua NOXH không?",
  "Vợ chồng tôi thu nhập 30 triệu/tháng, đã có 1 con, có đủ điều kiện thuê NOXH không?",
  "Tôi đang thuê nhà, thu nhập 12 triệu, chưa kết hôn, có đủ điều kiện không?",
];
