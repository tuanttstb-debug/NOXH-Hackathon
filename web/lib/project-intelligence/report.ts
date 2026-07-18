import type { Citation } from "@/types/legal";
import type { HousingProject, ProjectCitation } from "@/types/project";
import {
  DEFAULT_GOVERNING_DOCUMENT_IDS,
  getDeveloper,
  getGoverningCitations,
  getNewsForProject,
} from "./project-kg";

/**
 * Dựng Project Intelligence Report — thuần code xác định, KHÔNG gọi LLM.
 * Đối chiếu: docs/features/PROJECT_INTELLIGENCE.md §10 (cấu trúc report), §11 (AI Safety).
 *
 * Cùng nguyên tắc kiến trúc đã dùng cho Eligibility Checker: phần KẾT LUẬN do code quyết định
 * từ dữ liệu có nguồn, LLM chỉ diễn giải ở bước sau. Nhờ vậy không có đường nào để LLM
 * thêm một claim không có trong dữ liệu.
 */

export type SectionStatus = "ok" | "no_data";

export interface ReportField {
  label: string;
  value: string;
}

export interface ReportSection {
  id: string;
  title: string;
  status: SectionStatus;
  fields: ReportField[];
  /** Nguồn cho các claim trong khối này — FR-09, bắt buộc, không thương lượng. */
  citations: ProjectCitation[];
  legalCitations?: Citation[];
  /** Vì sao khối này trống — hiển thị thẳng cho người dùng thay vì ẩn đi. */
  emptyReason?: string;
}

export interface ProjectReport {
  project: HousingProject;
  sections: ReportSection[];
  disclaimer: string;
  /** Khối bị loại vì thiếu nguồn — hiển thị công khai, xem ghi chú bên dưới. */
  droppedForMissingSource: string[];
}

/**
 * AI Safety §11.2 — quy tắc cứng: mọi claim phải có nguồn.
 * Ở đây thực thi bằng code: field nào thuộc khối không có citation thì bị LOẠI khỏi report
 * và ghi tên khối vào `droppedForMissingSource` để hiển thị công khai — im lặng bỏ qua
 * sẽ khiến report trông đầy đủ hơn thực tế.
 */
function enforceCitations(section: ReportSection, dropped: string[]): ReportSection {
  const hasSource = section.citations.length > 0 || (section.legalCitations?.length ?? 0) > 0;
  if (section.fields.length > 0 && !hasSource) {
    dropped.push(section.title);
    return {
      ...section,
      status: "no_data",
      fields: [],
      emptyReason: "Đã có dữ liệu nhưng không kèm nguồn tra được — hệ thống loại bỏ thay vì hiển thị.",
    };
  }
  return section;
}

function field(label: string, value: string | number | null): ReportField | null {
  if (value === null || value === "") return null;
  return { label, value: String(value) };
}

function compact(items: (ReportField | null)[]): ReportField[] {
  return items.filter((f): f is ReportField => f !== null);
}

export const REPORT_DISCLAIMER =
  "Báo cáo được tổng hợp tự động từ dữ liệu công khai, chỉ mang tính tham khảo. " +
  "Đây KHÔNG phải lời khuyên đầu tư hay tư vấn pháp lý. " +
  "Trước khi ra quyết định tài chính, hãy kiểm chứng trực tiếp với chủ đầu tư và Sở Xây dựng nơi có dự án.";

export function buildReport(project: HousingProject): ProjectReport {
  const dropped: string[] = [];
  const developer = getDeveloper(project.developerId);
  const news = getNewsForProject(project.projectId);

  // Khối 1 — Tổng quan dự án (FR-03).
  const overview: ReportSection = {
    id: "tong-quan",
    title: "Tổng quan dự án",
    status: "ok",
    fields: compact([
      field("Địa chỉ", project.address),
      field("Tỉnh/thành phố", project.provinceName),
      field("Quận/huyện", project.districtName),
      field("Quy mô", project.unitCount ? `${project.unitCount.toLocaleString("vi-VN")} căn` : null),
      field("Trạng thái xây dựng", project.constructionStatus),
      field("Trạng thái pháp lý", project.legalStatus),
      field("Thời điểm mở bán", project.launchTime),
    ]),
    citations: project.citations,
  };

  // Khối 2 — Chủ đầu tư (FR-04, chấp nhận mock `note` theo 10_TECHNICAL_DECISION §2).
  const developerSection: ReportSection = {
    id: "chu-dau-tu",
    title: "Chủ đầu tư",
    status: developer ? "ok" : "no_data",
    fields: developer
      ? compact([
          field("Tên pháp nhân", developer.legalName),
          field("Mã số thuế", developer.taxCode),
          field("Ghi chú", developer.note),
        ])
      : [],
    citations: developer?.citations ?? [],
    emptyReason: developer ? undefined : "Chưa có dữ liệu chủ đầu tư được kiểm chứng.",
  };

  // Khối 3 — Pháp lý (FR-06). Đây là khối tạo khác biệt: nối thẳng sang Legal KG đã verified.
  const governingIds =
    project.governedByDocumentIds.length > 0
      ? project.governedByDocumentIds
      : DEFAULT_GOVERNING_DOCUMENT_IDS;
  const legalCitations = getGoverningCitations({ ...project, governedByDocumentIds: governingIds });

  const legalSection: ReportSection = {
    id: "phap-ly",
    title: "Pháp lý áp dụng",
    status: legalCitations.length > 0 ? "ok" : "no_data",
    fields: compact([
      field("Trạng thái pháp lý dự án", project.legalStatus),
      field(
        "Mức trần thu nhập áp dụng",
        `Theo quy định trung ương. UBND ${project.provinceName} có quyền ban hành hệ số điều chỉnh riêng — kiểm tra tại Sở Xây dựng.`
      ),
    ]),
    citations: project.citations,
    legalCitations,
    emptyReason: legalCitations.length > 0 ? undefined : "Chưa xác định được văn bản áp dụng.",
  };

  // Khối 4 — Tin tức (FR-05). Gắn nhãn tay, không qua LLM ingest (10_TECHNICAL_DECISION §2).
  const newsSection: ReportSection = {
    id: "tin-tuc",
    title: "Tin tức liên quan",
    status: news.length > 0 ? "ok" : "no_data",
    fields: news.map((n) => ({
      label: new Date(n.publishedDate).toLocaleDateString("vi-VN"),
      value: `${n.title} — ${n.sourceName}`,
    })),
    citations: news.map((n) => ({
      sourceName: n.sourceName,
      sourceUrl: n.url,
      sourceTier: n.sourceTier,
      retrievedAt: n.publishedDate,
    })),
    emptyReason:
      news.length > 0 ? undefined : "Chưa thu thập được tin tức có nguồn kiểm chứng cho dự án này.",
  };

  // Khối 5 — Rủi ro (FR-07). CỐ Ý để trống khi không có tín hiệu thật.
  // 10_TECHNICAL_DECISION §2 mục 3: "không tự tạo rủi ro giả để có nội dung".
  const riskSection: ReportSection = {
    id: "rui-ro",
    title: "Rủi ro / Tin cần lưu ý",
    status: "no_data",
    fields: [],
    citations: [],
    emptyReason:
      "Không phát hiện tín hiệu rủi ro nào từ nguồn đã thu thập. Trống ở đây nghĩa là CHƯA CÓ BẰNG CHỨNG, " +
      "không đồng nghĩa dự án không có rủi ro.",
  };

  const sections = [overview, developerSection, legalSection, newsSection, riskSection].map((s) =>
    enforceCitations(s, dropped)
  );

  return { project, sections, disclaimer: REPORT_DISCLAIMER, droppedForMissingSource: dropped };
}
