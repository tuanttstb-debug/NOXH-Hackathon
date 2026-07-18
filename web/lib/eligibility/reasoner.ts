import type { Citation, EligibilityVerdict } from "@/types/legal";
import {
  HOUSING_ARTICLE_ID,
  PROVINCIAL_COEFFICIENT_ARTICLE_ID,
  getProvincialCoefficient,
  getThresholdForGroup,
  isArticleActive,
  toCitation,
  type MaritalGroup,
} from "./legal-kg";

/**
 * Hồ sơ đã chuẩn hoá (tương ứng schema `docs/08_MO_HINH_DU_LIEU.md`:
 * tinh_trang_hon_nhan, thu_nhap_thang, tinh_trang_nha_o, noi_cu_tru_lam_viec).
 * `residence` là trường thu thập để hiển thị ngữ cảnh — theo `docs/03_YEU_CAU_NGHIEP_VU.md`
 * ("không còn yêu cầu hộ khẩu giấy khắt khe"), nơi cư trú KHÔNG phải điều kiện loại trừ trong
 * bộ quy tắc hiện tại nên không bắt buộc để kết luận, khác với hôn nhân/thu nhập/nhà ở.
 */
export interface EligibilityProfile {
  maritalGroup: MaritalGroup | null;
  monthlyIncomeVnd: number | null;
  hasOwnHousing: boolean | null;
  residence: string | null;
}

export const REQUIRED_FIELD_LABELS: Record<"maritalGroup" | "monthlyIncomeVnd" | "hasOwnHousing", string> = {
  maritalGroup: "Tình trạng hôn nhân",
  monthlyIncomeVnd: "Thu nhập hàng tháng",
  hasOwnHousing: "Tình trạng nhà ở",
};

export interface ThresholdDisplay {
  label: string;
  userValue: number;
  limitValue: number;
  unit: string;
}

export interface DraftConclusion {
  verdict: EligibilityVerdict;
  reasonKey:
    | "eligible_ok"
    | "not_eligible_has_housing"
    | "not_eligible_income_over_cap"
    | "insufficient_missing_fields"
    | "insufficient_unknown_group"
    | "insufficient_threshold_unconfirmed"
    | "insufficient_provincial_coefficient_unknown"
    | "insufficient_fact_check_failed";
  citations: Citation[];
  conflictingCitations?: [Citation, Citation];
  threshold?: ThresholdDisplay;
  missingFields?: string[];
}

/** Bước Validate (agents/eligibility.md #1) — thiếu trường bắt buộc → Thiếu thông tin ngay, không gọi legal_reasoner. */
export function findMissingFields(profile: EligibilityProfile): string[] {
  const missing: string[] = [];
  if (!profile.maritalGroup) missing.push(REQUIRED_FIELD_LABELS.maritalGroup);
  if (profile.monthlyIncomeVnd === null || profile.monthlyIncomeVnd === undefined)
    missing.push(REQUIRED_FIELD_LABELS.monthlyIncomeVnd);
  if (profile.hasOwnHousing === null || profile.hasOwnHousing === undefined)
    missing.push(REQUIRED_FIELD_LABELS.hasOwnHousing);
  return missing;
}

/**
 * legal_reasoner (docs/06_KIEN_TRUC_AI_AGENT.md bước 2-3: Retrieve + Grounded Reasoning).
 * Thuần logic xác định (không gọi LLM) — mọi số liệu lấy từ `legal-kg.ts`, không hard-code
 * lại ngưỡng ở đây (đúng nguyên tắc `docs/08_MO_HINH_DU_LIEU.md`).
 */
export function reasonEligibility(profile: EligibilityProfile): DraftConclusion {
  const missingFields = findMissingFields(profile);
  if (missingFields.length > 0) {
    return { verdict: "insufficient_data", reasonKey: "insufficient_missing_fields", citations: [], missingFields };
  }

  // Điều kiện nhà ở là điều kiện loại trừ tuyệt đối — kiểm tra trước, không cần xét thu nhập nếu đã có nhà.
  if (profile.hasOwnHousing) {
    const housingCitation = toCitation(HOUSING_ARTICLE_ID);
    return {
      verdict: "not_eligible",
      reasonKey: "not_eligible_has_housing",
      citations: housingCitation ? [housingCitation] : [],
    };
  }

  const threshold = getThresholdForGroup(profile.maritalGroup as MaritalGroup);
  if (!threshold) {
    return { verdict: "insufficient_data", reasonKey: "insufficient_unknown_group", citations: [] };
  }

  // Cơ chế phòng vệ: ngưỡng chưa đối chiếu được văn bản gốc → không suy đoán, luôn trả Thiếu thông tin.
  // Tính đến 2026-07-18 cả 3 ngưỡng đều `confirmedCurrent: true` nên nhánh này không chạy — giữ lại
  // để lần sửa đổi pháp luật tiếp theo không cần viết lại logic (xem legal-kg.ts).
  if (!threshold.confirmedCurrent) {
    const knownCitation = toCitation(threshold.sourceArticleId);
    const newestDocCitation = toCitation("art-dieu-30-nd136");
    return {
      verdict: "insufficient_data",
      reasonKey: "insufficient_threshold_unconfirmed",
      citations: [knownCitation, newestDocCitation].filter((c): c is Citation => c !== null),
      conflictingCitations:
        knownCitation && newestDocCitation ? [knownCitation, newestDocCitation] : undefined,
    };
  }

  const incomeCitation = toCitation(threshold.sourceArticleId);
  const income = profile.monthlyIncomeVnd as number;

  /*
   * Hệ số điều chỉnh cấp tỉnh (Điều 30 khoản 1 điểm d NĐ 136/2026).
   * Mức 25/35/50tr là trần TRUNG ƯƠNG; UBND cấp tỉnh được nâng lên theo hệ số địa phương.
   * Vì hệ số chỉ NÂNG trần (tỉnh không ban hành thì áp dụng mức trung ương), suy ra:
   *  - Thu nhập ≤ trần trung ương  → chắc chắn đạt, hệ số không thể làm đổi kết luận.
   *  - Thu nhập > trần trung ương  → kết luận phụ thuộc tỉnh đó đã ban hành hệ số hay chưa.
   */
  const provincial = getProvincialCoefficient(profile.residence);
  const effectiveLimitVnd = provincial
    ? Math.round(threshold.limitVnd * provincial.coefficient)
    : threshold.limitVnd;

  const thresholdDisplay: ThresholdDisplay = {
    label: provincial
      ? `Thu nhập của bạn so với ngưỡng tại ${provincial.provinceLabel} (${threshold.label})`
      : `Thu nhập của bạn so với ngưỡng cho phép (${threshold.label})`,
    userValue: Math.round(income / 1_000_000),
    limitValue: Math.round(effectiveLimitVnd / 1_000_000),
    unit: "triệu đ/tháng",
  };

  if (income <= effectiveLimitVnd) {
    return {
      verdict: "eligible",
      reasonKey: "eligible_ok",
      citations: incomeCitation ? [incomeCitation] : [],
      threshold: thresholdDisplay,
    };
  }

  // Vượt trần, mà tỉnh của người dùng chưa có dữ liệu hệ số → KHÔNG kết luận "Không đủ".
  // Đây là giới hạn tri thức có thật: tỉnh đó có thể đã nâng trần lên trên mức thu nhập này.
  if (!provincial && profile.residence) {
    const coefficientCitation = toCitation(PROVINCIAL_COEFFICIENT_ARTICLE_ID);
    return {
      verdict: "insufficient_data",
      reasonKey: "insufficient_provincial_coefficient_unknown",
      citations: [incomeCitation, coefficientCitation].filter((c): c is Citation => c !== null),
      threshold: thresholdDisplay,
    };
  }

  // Không nêu nơi cư trú → trả lời theo đúng quy định trung ương và nói rõ căn cứ đó.
  // Điểm d là ngoại lệ gắn với một tỉnh cụ thể, chưa xác định được tỉnh thì chưa viện dẫn được.
  const coefficientCitation = toCitation(PROVINCIAL_COEFFICIENT_ARTICLE_ID);
  return {
    verdict: "not_eligible",
    reasonKey: "not_eligible_income_over_cap",
    citations: [incomeCitation, coefficientCitation].filter((c): c is Citation => c !== null),
    threshold: thresholdDisplay,
  };
}

/**
 * fact_check (agents/fact_check.md) — 3 phép kiểm, độc lập với bước suy luận ở trên:
 * 1. Tồn tại: citation phải trỏ tới điều khoản thật trong Knowledge Graph — đảm bảo vì `toCitation()`
 *    chỉ trả về non-null khi tìm thấy trong `legalArticles`; citation null đã bị lọc ở `reasonEligibility`.
 * 2. Hiệu lực: mọi citation dùng để kết luận Đủ/Không đủ phải có `status === "active"`.
 * 3. Khớp nội dung: đảm bảo bằng cấu trúc — verdict được tính trực tiếp từ cùng 1 bản ghi ngưỡng
 *    đang trích dẫn (không qua bước LLM suy luận riêng có thể lệch khỏi nguồn), khác với thiết kế gốc
 *    (`knowledge/agents/fact_check.md` mục "Vì sao đây là agent riêng") vốn dùng LLM cho phép kiểm này —
 *    xem `ai_context/TECH_DEBT.md` mục 5. Ở đây phép kiểm #3 không cần chạy runtime vì không có khả năng
 *    lệch theo thiết kế.
 */
export function factCheck(draft: DraftConclusion): DraftConclusion {
  if (draft.verdict === "insufficient_data") return draft; // không cần kiểm hiệu lực cho trạng thái này

  const allActive = draft.citations.every((c) => isArticleActive(c.articleId));
  if (!allActive) {
    return {
      verdict: "insufficient_data",
      reasonKey: "insufficient_fact_check_failed",
      citations: draft.citations,
    };
  }
  return draft;
}
