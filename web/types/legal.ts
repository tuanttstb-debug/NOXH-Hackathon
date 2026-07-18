/**
 * Kiểu dữ liệu pháp lý dùng chung toàn app.
 * Đối chiếu: knowledge/ontology/node_types.md, knowledge/ontology/metadata.md
 */

export type ConfidenceLevel = "verified" | "pending";
export type EffectStatus = "active" | "amended" | "superseded";

export interface LegalDocument {
  id: string;
  code: string; // VD: "100/2024/NĐ-CP"
  title: string;
  type: "luat" | "nghi_dinh" | "thong_tu";
  issuedDate: string; // ISO date
  effectiveDate: string; // ISO date
  status: EffectStatus;
  sourceUrl: string;
}

export interface LegalArticle {
  id: string;
  documentId: string;
  label: string; // VD: "Điều 30, Khoản 1"
  aspect?: string; // "tran_thu_nhap" | "tham_quyen_xac_nhan" ...
  summary: string;
  effectiveDate: string;
  status: EffectStatus;
  confidence: ConfidenceLevel;
}

export interface Citation {
  articleId: string;
  documentCode: string;
  documentTitle: string;
  articleLabel: string;
  effectiveDate: string;
  confidence: ConfidenceLevel;
  sourceUrl: string;
}

export type EligibilityVerdict = "eligible" | "not_eligible" | "insufficient_data";

/**
 * Kiểu khối kết quả hiển thị. `legal_answer` (thêm 2026-07-19) dành cho câu hỏi TRA CỨU pháp lý —
 * cố ý KHÔNG mượn lại 3 verdict xét điều kiện, vì "đủ/không đủ/thiếu căn cứ" là kết luận về HỒ SƠ
 * của người dùng, không áp dụng được cho một câu hỏi tra cứu văn bản.
 */
export type ResultKind = EligibilityVerdict | "legal_answer";

export interface EligibilityResult {
  verdict: EligibilityVerdict;
  reason: string;
  citations: Citation[];
  confidenceNote?: string;
}
