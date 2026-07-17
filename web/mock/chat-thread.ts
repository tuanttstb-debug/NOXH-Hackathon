import type { ChatMessage, QuickSkill, HistoryItem } from "@/types/chat";
import { legalDocuments, legalArticles } from "@/mock/legal-documents";

const docByCode = (code: string) => legalDocuments.find((d) => d.code === code)!;

const citationDieu30_136 = {
  articleId: "art-dieu-30-nd136",
  documentCode: "136/2026/NĐ-CP",
  documentTitle: docByCode("136/2026/NĐ-CP").title,
  articleLabel: "Điều 30 (sửa đổi mức trần độc thân)",
  effectiveDate: "2026-04-07",
  confidence: "pending" as const,
  sourceUrl: docByCode("136/2026/NĐ-CP").sourceUrl,
};

const citationDieu29_54 = {
  articleId: "art-dieu-29-k1-nd54",
  documentCode: "54/2026/NĐ-CP",
  documentTitle: docByCode("54/2026/NĐ-CP").title,
  articleLabel: "Điều 29, Khoản 1 (sửa đổi)",
  effectiveDate: "2026-02-09",
  confidence: "pending" as const,
  sourceUrl: docByCode("54/2026/NĐ-CP").sourceUrl,
};

const citationDieu30_261 = {
  articleId: "art-dieu-30-nd261",
  documentCode: "261/2025/NĐ-CP",
  documentTitle: docByCode("261/2025/NĐ-CP").title,
  articleLabel: "Điều 30, Khoản 1–2 (sửa đổi)",
  effectiveDate: "2025-10-10",
  confidence: "pending" as const,
  sourceUrl: docByCode("261/2025/NĐ-CP").sourceUrl,
};

const nd100 = legalDocuments.find((d) => d.code === "100/2024/NĐ-CP");

const citationDieu29_100 = {
  articleId: "art-dieu-29-k1-nd100",
  documentCode: "100/2024/NĐ-CP",
  documentTitle: nd100?.title ?? "Quy định chi tiết phát triển và quản lý nhà ở xã hội",
  articleLabel: "Điều 29, Khoản 1 — Điều kiện nhà ở",
  effectiveDate: "2024-08-01",
  confidence: "pending" as const,
  sourceUrl: nd100?.sourceUrl ?? "https://vanban.chinhphu.vn/?pageid=27160&docid=210760",
};

/** TC-02: Vợ chồng thu nhập 45 triệu — vượt trần 40 triệu (NĐ 261/2025). */
export const notEligibleResult = {
  verdict: "not_eligible" as const,
  headline: "KHÔNG ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội",
  reason:
    "Tổng thu nhập của hộ gia đình (45 triệu/tháng) vượt mức trần cho phép với người đã kết hôn. Để đủ điều kiện, tổng thu nhập vợ chồng không được vượt 40 triệu/tháng.",
  threshold: {
    label: "Tổng thu nhập vợ chồng so với ngưỡng cho phép",
    userValue: 45,
    limitValue: 40,
    unit: "triệu đ/tháng",
  },
  citations: [citationDieu30_136, citationDieu30_261],
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
 * TC-01 (Đủ điều kiện) nối tiếp TC-04 (Thiếu thông tin, vùng chồng lấp dữ liệu).
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
      { label: "Kiểm tra chồng lấp dữ liệu giữa các văn bản sửa đổi", status: "done" },
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
    text: "Nếu tôi có thêm một người con thì sao?",
    timestamp: "09:44",
  },
  {
    id: "m4",
    role: "assistant",
    extractedFields: [
      { label: "Tình trạng hôn nhân", value: "Độc thân nuôi con dưới tuổi thành niên" },
      { label: "Thu nhập", value: "18.000.000 đ/tháng (giữ nguyên)" },
    ],
    reasoningSteps: [
      { label: "Cập nhật nhóm đối tượng: độc thân nuôi con", status: "done" },
      { label: "Tra mức trần thu nhập áp dụng cho nhóm này", status: "done" },
      { label: "Phát hiện 2 văn bản quy định khác thời điểm cho nhóm này", status: "done" },
      { label: "Xác định văn bản đang áp dụng tại hôm nay", status: "active" },
    ],
    result: {
      verdict: "insufficient_data",
      headline: "CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN",
      reason:
        "Mức trần thu nhập áp dụng cho nhóm 'độc thân nuôi con' hiện có 2 văn bản khác thời điểm — hệ thống chưa xác nhận được văn bản nào đang áp dụng. Chúng tôi không đoán để tránh cho bạn một câu trả lời có thể sai.",
      citations: [citationDieu30_261, citationDieu30_136],
      conflictingCitations: [citationDieu30_261, citationDieu30_136],
      suggestion: "Đăng ký nhận thông báo khi có xác nhận chính thức?",
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
