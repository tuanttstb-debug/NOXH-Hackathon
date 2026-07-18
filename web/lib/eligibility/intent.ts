import type { EligibilityProfile } from "./reasoner";

/**
 * Định tuyến ý định câu hỏi — sửa lỗi "mọi câu hỏi đều rơi vào luồng xét điều kiện".
 *
 * BỐI CẢNH LỖI (2026-07-19): trước bản này `/api/eligibility` mặc định MỌI tin nhắn đều là hồ sơ
 * xét điều kiện. Câu "So sánh Nghị định 261/2025 và 136/2026" bị trích xuất thành hồ sơ rỗng rồi
 * hệ thống hỏi ngược tình trạng hôn nhân — hoàn toàn lạc đề, và không có đường thoát.
 *
 * VÌ SAO KHÔNG DÙNG THÊM 1 LỆNH GỌI LLM ĐỂ PHÂN LOẠI:
 * bước Parse đã chạy sẵn và cho ta tín hiệu mạnh hơn bất kỳ classifier nào — nếu người dùng có
 * nêu BẤT KỲ thông tin hồ sơ nào (hôn nhân/thu nhập/nhà ở/nơi cư trú) thì đó chắc chắn là câu hỏi
 * xét điều kiện. Chỉ khi hồ sơ rỗng hoàn toàn mới cần xét xem có phải câu hỏi tra cứu pháp lý không.
 * Cách này không tốn thêm token, chạy xác định, và giải thích được trước giám khảo.
 */
export type Intent = "eligibility" | "legal_lookup";

/** Tham chiếu văn bản pháp luật: "nghị định 136", "NĐ 261/2025", "luật nhà ở", "thông tư 05", "điều 30". */
const LEGAL_REFERENCE = /(nghị\s*định|nđ\b|luật|thông\s*tư|điều\s*\d+|khoản\s*\d+|\d{2,3}\/20\d{2})/i;

/** Động từ tra cứu/đối chiếu: người dùng muốn HIỂU quy định, không phải hỏi mình có đủ điều kiện. */
const LOOKUP_VERB =
  /(so\s*sánh|khác\s*nhau|khác\s*gì|thay\s*đổi|sửa\s*đổi|thay\s*thế|hiệu\s*lực|quy\s*định\s*(gì|nào|ra\s*sao)|nội\s*dung|là\s*gì|tra\s*cứu|áp\s*dụng\s*(từ|khi)|còn\s*hiệu\s*lực)/i;

/**
 * Ưu tiên hồ sơ trước: câu "Tôi độc thân 30 triệu, theo NĐ 136 tôi có mua được không?" vừa có
 * tham chiếu văn bản vừa có hồ sơ — phải đi luồng xét điều kiện, không phải tra cứu.
 *
 * Khi hồ sơ rỗng VÀ không có dấu hiệu tra cứu (vd "Tôi muốn hỏi về nhà ở xã hội") thì vẫn giữ
 * `eligibility` để agent hỏi tiếp trường còn thiếu — đây là hành vi đúng cho màn Eligibility Checker,
 * KHÔNG đổi (đã verify ở verify-multiturn.mjs mục ①).
 */
export function classifyIntent(message: string, currentTurnProfile: EligibilityProfile): Intent {
  const hasProfileSignal =
    currentTurnProfile.maritalGroup !== null ||
    currentTurnProfile.monthlyIncomeVnd !== null ||
    currentTurnProfile.hasOwnHousing !== null ||
    currentTurnProfile.residence !== null;

  if (hasProfileSignal) return "eligibility";
  if (LEGAL_REFERENCE.test(message) || LOOKUP_VERB.test(message)) return "legal_lookup";
  return "eligibility";
}
