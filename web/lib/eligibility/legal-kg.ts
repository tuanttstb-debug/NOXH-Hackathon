import { legalArticles, legalDocuments } from "@/mock/legal-documents";
import type { Citation } from "@/types/legal";

/**
 * Trần thu nhập theo nhóm đối tượng (docs/07_KNOWLEDGE_GRAPH.md, docs/08_MO_HINH_DU_LIEU.md — NguongSo).
 *
 * Cập nhật 2026-07-18 — đối chiếu TOÀN VĂN NĐ 136/2026 (`web/lib/Legal/7_ND_136-2026_ok/`):
 * cả 3 mức đều lấy từ khoản 1 Điều 30 do NĐ 136/2026 thay thế toàn bộ, hiệu lực 2026-04-07.
 * Trước bản sửa này, code lấy 25tr từ NĐ 136 cho nhóm độc thân nhưng vẫn giữ 30tr/40tr của
 * NĐ 261/2025 đã hết hiệu lực cho 2 nhóm còn lại — sai luật, đã sửa.
 *
 * Rủi ro "chồng lấp NĐ 54/2026 ↔ NĐ 136/2026" ghi ở docs/12_QUAN_LY_RUI_RO.md KHÔNG tồn tại:
 * NĐ 54/2026 sửa khoản 2 Điều 30 (thẩm quyền xác nhận), NĐ 136/2026 sửa khoản 1 Điều 30
 * (mức trần) — hai khoản khác nhau, không mâu thuẫn. Đã kiểm chứng trên toàn văn cả hai.
 *
 * `confirmedCurrent = false` giữ lại như cơ chế phòng vệ cho lần sửa đổi pháp luật tiếp theo:
 * bất kỳ ngưỡng nào chưa đối chiếu được văn bản gốc phải trả "Thiếu thông tin", không suy đoán.
 */
export type MaritalGroup = "doc_than" | "doc_than_nuoi_con" | "da_ket_hon";

export interface IncomeThreshold {
  group: MaritalGroup;
  label: string;
  limitVnd: number;
  sourceArticleId: string;
  confirmedCurrent: boolean;
}

export const incomeThresholds: IncomeThreshold[] = [
  {
    group: "doc_than",
    label: "Độc thân chưa kết hôn",
    limitVnd: 25_000_000,
    sourceArticleId: "art-dieu-30-nd136",
    confirmedCurrent: true,
  },
  {
    group: "doc_than_nuoi_con",
    label: "Độc thân nuôi con dưới tuổi thành niên",
    limitVnd: 35_000_000,
    sourceArticleId: "art-dieu-30-nd136",
    confirmedCurrent: true,
  },
  {
    group: "da_ket_hon",
    label: "Đã kết hôn (tổng thu nhập vợ chồng)",
    limitVnd: 50_000_000,
    sourceArticleId: "art-dieu-30-nd136",
    confirmedCurrent: true,
  },
];

/**
 * Điều 30 khoản 1 điểm d NĐ 136/2026 — UBND cấp tỉnh được quyết định hệ số điều chỉnh mức thu nhập
 * tại điểm a/b, trần là tỷ lệ thu nhập bình quân đầu người địa phương so với cả nước.
 * Hệ quả: các mức 25/35/50tr ở trên là trần TRUNG ƯƠNG, không nhất thiết là mức áp dụng tại tỉnh
 * nơi có dự án. Đây là giới hạn tri thức có THẬT của hệ thống (không phải thiếu sót dữ liệu):
 * muốn biết mức áp dụng thật phải tra quyết định của từng UBND tỉnh — dữ liệu chưa có trong KG.
 */
export const PROVINCIAL_COEFFICIENT_ARTICLE_ID = "art-dieu-30-k1d-nd136";

export interface ProvincialCoefficient {
  /** Tên tỉnh/thành phố trực thuộc trung ương, viết thường không dấu để so khớp. */
  provinceKey: string;
  provinceLabel: string;
  /** Hệ số nhân áp dụng cho mức trần tại điểm a/b khoản 1 Điều 30. */
  coefficient: number;
  /** Số hiệu quyết định của UBND tỉnh — bắt buộc có thì mới được đưa vào đây. */
  decisionRef: string;
}

/**
 * RỖNG CÓ CHỦ ĐÍCH — tính đến 2026-07-18 chưa thu thập được quyết định ban hành hệ số điều chỉnh
 * của bất kỳ UBND tỉnh nào. KHÔNG được điền số ước lượng vào đây: mỗi bản ghi phải dẫn được
 * `decisionRef` là quyết định thật, đúng nguyên tắc "Grounding trước Generation"
 * (docs/13_QUYET_DINH_KIEN_TRUC.md ADR-01). Registry rỗng khiến mọi trường hợp thu nhập vượt trần
 * trung ương mà có nêu nơi cư trú đều trả "Thiếu thông tin" — đúng, vì hệ thống thật sự không biết.
 */
export const provincialCoefficients: ProvincialCoefficient[] = [];

function normalizeProvince(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\b(tinh|thanh pho|tp\.?|tt)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tra hệ số điều chỉnh của tỉnh từ chuỗi nơi cư trú do người dùng nêu. Chưa có dữ liệu → luôn undefined. */
export function getProvincialCoefficient(residence: string | null): ProvincialCoefficient | undefined {
  if (!residence) return undefined;
  const key = normalizeProvince(residence);
  return provincialCoefficients.find((p) => key.includes(p.provinceKey));
}

/** Điều kiện nhà ở (Điều 29 NĐ 100/2024, sửa bởi NĐ 54/2026) — 1 điều khoản duy nhất, đang hiệu lực. */
export const HOUSING_ARTICLE_ID = "art-dieu-29-k1-nd54";

export function getThresholdForGroup(group: MaritalGroup): IncomeThreshold | undefined {
  return incomeThresholds.find((t) => t.group === group);
}

export function getArticle(articleId: string) {
  return legalArticles.find((a) => a.id === articleId);
}

/** Trạng thái hiệu lực bắt buộc để dùng làm căn cứ cho kết luận Đủ/Không đủ (fact_check.md phép kiểm #2). */
export function isArticleActive(articleId: string): boolean {
  return getArticle(articleId)?.status === "active";
}

/** Dựng Citation object từ articleId — dùng chung 1 nguồn dữ liệu (legalArticles/legalDocuments), không lặp. */
export function toCitation(articleId: string): Citation | null {
  const article = getArticle(articleId);
  if (!article) return null;
  const doc = legalDocuments.find((d) => d.id === article.documentId);
  if (!doc) return null;
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
