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

/**
 * Khử dấu trước khi so khớp — người Việt gõ không dấu rất phổ biến ("nghi dinh 136", "dieu 76").
 * Bản đầu khớp thẳng chuỗi có dấu nên mọi câu hỏi gõ không dấu đều rơi nhầm vào luồng xét điều kiện.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

/** Tham chiếu văn bản pháp luật: "nghi dinh 136", "NĐ 261/2025", "luat nha o", "thong tu 05", "dieu 30". */
const LEGAL_REFERENCE = /(nghi\s*dinh|nd\s*\d|luat\s|thong\s*tu|dieu\s*\d+|khoan\s*\d+|\d{1,3}\/20\d{2})/;

/** Động từ tra cứu/đối chiếu: người dùng muốn HIỂU quy định, không phải hỏi mình có đủ điều kiện. */
const LOOKUP_VERB =
  /(so\s*sanh|khac\s*nhau|khac\s*gi|thay\s*doi|sua\s*doi|thay\s*the|hieu\s*luc|quy\s*dinh\s*(gi|nao|ra\s*sao|the\s*nao)|noi\s*dung|la\s*gi|tra\s*cuu|ap\s*dung\s*(tu|khi)|con\s*hieu\s*luc)/;

/**
 * Đại từ ngôi thứ nhất — dấu hiệu người dùng đang hỏi về CHÍNH HỌ, tức câu hỏi xét điều kiện,
 * chứ không phải tra cứu quy định chung. Phân biệt:
 *   "Tôi có đủ điều kiện không?"                      → xét điều kiện (có ngôi thứ nhất)
 *   "Thuê nhà ở xã hội có cần điều kiện thu nhập?"     → tra cứu (không có ngôi thứ nhất)
 */
const FIRST_PERSON = /(^|\s)(toi|minh|em|tui|chung\s*toi|vo\s*chong\s*toi|nha\s*em|gia\s*dinh\s*toi)(\s|,|$)/;

/** Câu hỏi về quy định chung, không nhắc văn bản cụ thể: "có cần...", "có phải...", "điều kiện ... là gì". */
const RULE_QUESTION = /(co\s*can|co\s*phai|co\s*bat\s*buoc|dieu\s*kien|thu\s*tuc|ho\s*so|doi\s*tuong\s*nao|ai\s*duoc)/;

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
    currentTurnProfile.residence !== null ||
    currentTurnProfile.housingAreaPerPersonM2 !== null;

  if (hasProfileSignal) return "eligibility";

  const t = normalize(message);

  // Nhắc đích danh văn bản → chắc chắn tra cứu, kể cả khi có ngôi thứ nhất
  // ("cho tôi xem Nghị định 136" vẫn là tra cứu).
  if (LEGAL_REFERENCE.test(t) || LOOKUP_VERB.test(t)) return "legal_lookup";

  // Hỏi về quy định chung mà KHÔNG nói về bản thân → tra cứu.
  // Có ngôi thứ nhất thì giữ luồng xét điều kiện để agent hỏi tiếp trường còn thiếu.
  if (RULE_QUESTION.test(t) && !FIRST_PERSON.test(t)) return "legal_lookup";

  return "eligibility";
}
