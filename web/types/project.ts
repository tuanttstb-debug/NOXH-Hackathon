/**
 * Kiểu dữ liệu Project Intelligence.
 * Đối chiếu: docs/features/PROJECT_INTELLIGENCE.md §8.1 (Node) và §8.2 (Relationship).
 *
 * PHẠM VI CÓ CHỦ ĐÍCH — theo docs/technical/10_TECHNICAL_DECISION.md (kịch bản <24h):
 * chỉ hiện thực hoá các node/quan hệ phục vụ khối "Tổng quan" (FR-03) và "Pháp lý" (FR-06),
 * cộng Citation (FR-09, không thương lượng). Các node Risk/Topic/Person/Organization trong BRD
 * KHÔNG được khai báo ở đây vì chưa có dữ liệu thật — khai báo type rỗng chỉ tạo ảo giác
 * về năng lực hệ thống. Thêm khi có dữ liệu, không thêm trước.
 */

import type { ConfidenceLevel } from "./legal";

/** Phân tầng nguồn (PROJECT_INTELLIGENCE.md §7, §11.2) — hiển thị khác nhau trong UI. */
export type SourceTier = "chinh_thong" | "bao_chi" | "cong_dong" | "ai_suy_luan";

export const SOURCE_TIER_LABEL: Record<SourceTier, string> = {
  chinh_thong: "Nguồn chính thống",
  bao_chi: "Báo chí",
  cong_dong: "Cộng đồng",
  ai_suy_luan: "AI suy luận",
};

/** Mọi claim trong report BẮT BUỘC có nguồn — FR-09, "không thương lượng". */
export interface ProjectCitation {
  /** Nhãn hiển thị, vd "Cổng thông tin Sở Xây dựng TP.HCM". */
  sourceName: string;
  sourceUrl: string;
  sourceTier: SourceTier;
  /** Ngày tra cứu/crawl — bắt buộc để người đọc biết dữ liệu cũ tới mức nào. */
  retrievedAt: string; // ISO date
}

export interface Developer {
  developerId: string;
  legalName: string;
  taxCode: string | null;
  /** Ghi chú viết tay 1-2 câu — chấp nhận mock theo 10_TECHNICAL_DECISION §2. */
  note: string | null;
  citations: ProjectCitation[];
}

export interface HousingProject {
  projectId: string;
  name: string;
  /** Tên gọi khác — dùng cho Entity Resolution bằng exact match, không fuzzy (10_TECHNICAL_DECISION §1). */
  aliases: string[];
  address: string;
  provinceName: string;
  districtName: string | null;
  developerId: string;

  legalStatus: string | null;
  constructionStatus: string | null;
  /** Quy mô: số căn hộ. null nếu không có nguồn xác nhận — KHÔNG ước lượng. */
  unitCount: number | null;
  launchTime: string | null;

  /**
   * GOVERNED_BY — trỏ tới `id` trong Legal KG (`web/mock/legal-documents.ts`).
   * Đây là liên kết tạo nên khác biệt so với Gemini/NotebookLM mà BRD tự nhận định (§3.3).
   */
  governedByDocumentIds: string[];

  citations: ProjectCitation[];
  /** "verified" chỉ khi mọi trường trên đã đối chiếu nguồn chính thống. */
  confidence: ConfidenceLevel;
}

/** Một mục tin tức đã gắn nhãn TAY (không qua LLM ingest) — 10_TECHNICAL_DECISION §2. */
export interface ProjectNews {
  newsId: string;
  projectId: string;
  title: string;
  url: string;
  publishedDate: string;
  sourceName: string;
  sourceTier: SourceTier;
  sentiment: "tich_cuc" | "tieu_cuc" | "trung_lap";
}
