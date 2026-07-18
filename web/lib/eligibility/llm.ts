import type { EligibilityProfile } from "./reasoner";
import type { DraftConclusion } from "./reasoner";
import { getArticle } from "./legal-kg";

import { callChat, extractJson } from "@/lib/llm-client";

interface RawExtractedProfile {
  tinh_trang_hon_nhan: "doc_than" | "doc_than_nuoi_con" | "da_ket_hon" | null;
  thu_nhap_thang_vnd: number | null;
  tinh_trang_nha_o: "chua_co_nha" | "da_co_nha" | null;
  noi_cu_tru_lam_viec: string | null;
  dien_tich_binh_quan_m2: number | null;
}

const EXTRACT_SYSTEM_PROMPT = `Bạn là bước trích xuất thông tin (Parse) trong pipeline Eligibility Checker NOXH — bạn KHÔNG kết luận điều kiện thụ hưởng, chỉ chuẩn hoá dữ liệu người dùng nhập thành JSON.

Trả về DUY NHẤT 1 JSON object, không thêm chữ nào khác, đúng schema:
{
  "tinh_trang_hon_nhan": "doc_than" | "doc_than_nuoi_con" | "da_ket_hon" | null,
  "thu_nhap_thang_vnd": number | null,
  "tinh_trang_nha_o": "chua_co_nha" | "da_co_nha" | null,
  "noi_cu_tru_lam_viec": string | null,
  "dien_tich_binh_quan_m2": number | null
}

Quy tắc:
- "doc_than": độc thân, chưa kết hôn, KHÔNG có con.
- "doc_than_nuoi_con": độc thân/đơn thân nhưng đang nuôi con (kể cả ly hôn nuôi con).
- "da_ket_hon": đã kết hôn, tính thu nhập là TỔNG thu nhập vợ chồng nếu người dùng nêu rõ, nếu chỉ nêu thu nhập cá nhân thì vẫn điền đúng số đó (không tự cộng thêm).
- "thu_nhap_thang_vnd" là số nguyên đơn vị VNĐ (vd "18 triệu" → 18000000). Nếu không nhắc tới thu nhập, để null.
- "tinh_trang_nha_o": "da_co_nha" nếu người dùng hoặc vợ/chồng đang sở hữu nhà; "chua_co_nha" nếu nói chưa có nhà; null nếu không đề cập.
- "dien_tich_binh_quan_m2": diện tích nhà ở BÌNH QUÂN ĐẦU NGƯỜI, đơn vị m² sàn/người, CHỈ điền khi người dùng nói rõ. Nếu người dùng cho tổng diện tích và số người (vd "nhà 40m2, 4 người ở") thì tự chia: 40/4 = 10. Nếu chỉ nói tổng diện tích mà không nói số người, để null. Không đề cập gì thì null.
- Trường nào người dùng không đề cập, để null — KHÔNG suy đoán, KHÔNG tự điền giá trị mặc định.
- Không diễn giải, không thêm field khác ngoài schema trên.`;

export async function extractProfile(userText: string): Promise<EligibilityProfile> {
  const raw = await callChat([
    { role: "system", content: EXTRACT_SYSTEM_PROMPT },
    { role: "user", content: userText },
  ]);

  const parsed = extractJson<RawExtractedProfile>(raw);
  if (!parsed) {
    // Không suy đoán khi không parse được — coi như mọi trường đều thiếu, bước Validate sẽ trả "Thiếu thông tin".
    return {
      maritalGroup: null,
      monthlyIncomeVnd: null,
      hasOwnHousing: null,
      residence: null,
      housingAreaPerPersonM2: null,
    };
  }

  return {
    maritalGroup: parsed.tinh_trang_hon_nhan ?? null,
    monthlyIncomeVnd: parsed.thu_nhap_thang_vnd ?? null,
    hasOwnHousing: parsed.tinh_trang_nha_o === "da_co_nha" ? true : parsed.tinh_trang_nha_o === "chua_co_nha" ? false : null,
    residence: parsed.noi_cu_tru_lam_viec ?? null,
    housingAreaPerPersonM2: parsed.dien_tich_binh_quan_m2 ?? null,
  };
}

/**
 * Bước soạn câu trả lời cuối (knowledge/prompts/eligibility.md) — CHỈ diễn giải, không được đổi kết luận.
 * Khác bản nháp gốc (yêu cầu trả văn bản tự nhiên thuần) — ở đây yêu cầu JSON {reason, suggestion} để tách
 * rõ 2 phần hiển thị trong UI (ResultBlock.reason / .suggestion) mà không phải tự parse free text.
 */
const COMPOSE_SYSTEM_PROMPT = `Bạn là trợ lý diễn giải kết quả cho người dân về điều kiện mua/thuê mua Nhà ở xã hội (NOXH). Kết luận pháp lý ĐÃ được xác minh trước khi tới bạn — nhiệm vụ của bạn CHỈ là diễn giải sang ngôn ngữ dễ hiểu, KHÔNG được thay đổi kết luận, KHÔNG thêm thông tin pháp lý nào ngoài dữ liệu được cung cấp.

Trả về DUY NHẤT 1 JSON object, không thêm chữ nào khác:
{
  "reason": string,     // giải thích ngắn gọn, tiếng Việt đời thường, không dùng thuật ngữ luật nếu không cần. Nếu có citation "confidence: pending", PHẢI thêm câu: "Số liệu này đang được xác minh lại với văn bản gốc, có thể thay đổi."
  "suggestion": string  // 1 câu gợi ý bước tiếp theo phù hợp với verdict, giọng thân thiện
}

Nếu verdict là "insufficient_data": giải thích cụ thể đang thiếu/chưa chắc chắn điều gì, KHÔNG suy đoán kết quả thay người dùng, suggestion nên mời người dùng cung cấp thêm hoặc chờ xác nhận — không hứa hẹn thời điểm cụ thể.

Diễn giải theo "ly_do_ky_thuat" (chỉ dùng đúng trường hợp được gửi tới, KHÔNG nhắc tới các trường hợp khác):
- "insufficient_provincial_coefficient_unknown": thu nhập của người dùng CAO HƠN mức trần chung của cả nước, NHƯNG Ủy ban nhân dân cấp tỉnh nơi họ ở có quyền quyết định hệ số điều chỉnh nâng mức trần này lên theo mức sống địa phương. Hệ thống chưa có dữ liệu quyết định của tỉnh đó nên KHÔNG kết luận là không đủ điều kiện. Nói rõ đây là giới hạn dữ liệu của hệ thống, không phải người dùng thiếu thông tin. Gợi ý: liên hệ Sở Xây dựng hoặc UBND tỉnh nơi có dự án để hỏi mức trần áp dụng tại địa phương.
- "not_eligible_income_over_cap": thu nhập vượt mức trần theo quy định chung của cả nước. Nêu thêm một câu rằng nếu người dùng cho biết tỉnh/thành phố nơi họ định mua thì kết luận có thể khác, vì tỉnh có quyền nâng mức trần theo hệ số địa phương.
- "not_eligible_has_housing": đã có nhà thuộc sở hữu VÀ diện tích bình quân đầu người từ 15 m² sàn/người trở lên. Nói rõ rằng nếu diện tích bình quân dưới 15 m²/người thì vẫn được mua — đây mới là ranh giới thật, KHÔNG nói "có nhà là không được mua".
- "insufficient_housing_area_unknown": người dùng đã có nhà, NHƯNG luật cho phép người có nhà vẫn mua NOXH nếu diện tích nhà ở bình quân đầu người dưới 15 m² sàn/người. Chưa biết diện tích bình quân nên CHƯA kết luận được. Giải thích cách tính: lấy tổng diện tích sàn chia cho số người đăng ký thường trú tại căn nhà đó (gồm người đứng đơn, vợ/chồng, cha, mẹ và các con). Gợi ý người dùng cho biết diện tích căn nhà và số người cùng thường trú.
- "insufficient_missing_fields": còn thiếu trường thông tin bắt buộc, liệt kê đúng theo "truong_con_thieu".`;

export interface ComposedAnswer {
  reason: string;
  suggestion: string;
}

export async function composeAnswer(
  profile: EligibilityProfile,
  draft: DraftConclusion
): Promise<ComposedAnswer> {
  const payload = {
    verdict: draft.verdict,
    ly_do_ky_thuat: draft.reasonKey,
    ho_so: profile,
    trich_dan: draft.citations.map((c) => ({
      van_ban: c.documentTitle,
      ma_hieu: c.documentCode,
      dieu_khoan: c.articleLabel,
      ngay_hieu_luc: c.effectiveDate,
      do_tin_cay: c.confidence,
      // Nội dung điều khoản là BẮT BUỘC trong payload: thiếu nó, bước Compose không có căn cứ
      // để diễn giải và sẽ phải tự bịa nội dung luật — đúng dạng lỗi mà pipeline này sinh ra để tránh.
      noi_dung: getArticle(c.articleId)?.summary ?? null,
    })),
    nguong_so_sanh: draft.threshold ?? null,
    truong_con_thieu: draft.missingFields ?? null,
  };

  const raw = await callChat([
    { role: "system", content: COMPOSE_SYSTEM_PROMPT },
    { role: "user", content: JSON.stringify(payload) },
  ]);

  const parsed = extractJson<ComposedAnswer>(raw);
  if (!parsed) {
    throw new Error("Không parse được JSON từ bước soạn câu trả lời (compose) — response FPT AI không đúng định dạng.");
  }
  return parsed;
}
