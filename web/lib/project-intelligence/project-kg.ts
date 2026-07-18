import { legalArticles, legalDocuments } from "@/mock/legal-documents";
import type { Citation } from "@/types/legal";
import type { Developer, HousingProject, ProjectNews } from "@/types/project";

/**
 * Project Knowledge Graph — tầng dữ liệu cho Project Intelligence.
 * Đối chiếu: docs/features/PROJECT_INTELLIGENCE.md §8, docs/technical/03_FINAL_ARCHITECTURE.md.
 *
 * Lưu trữ: TS tĩnh, KHÔNG Postgres — quyết định ở docs/technical/10_TECHNICAL_DECISION.md,
 * đi ngược đề xuất mặc định của BRD, lý do: repo có 0% backend/DB.
 */

/**
 * === RỖNG CÓ CHỦ ĐÍCH — ĐANG CHỜ DỮ LIỆU THẬT ===
 *
 * Xem `web/lib/Projects/DU_LIEU_CAN_CUNG_CAP.md` để biết cần cung cấp gì.
 *
 * KHÔNG điền dữ liệu mẫu/ước lượng vào đây. Bài học đã ghi ở `docs/12_QUAN_LY_RUI_RO.md`:
 * dữ liệu chưa kiểm chứng từng khiến cả dự án thiết kế một kịch bản demo trọng tâm quanh
 * một rủi ro không tồn tại. Hệ thống trả "chưa có dữ liệu" là hành vi đúng và demo được;
 * hệ thống trả số bịa thì vỡ ngay câu hỏi thứ hai của giám khảo.
 */
export const projects: HousingProject[] = [];
export const developers: Developer[] = [];
export const projectNews: ProjectNews[] = [];

export const hasProjectData = (): boolean => projects.length > 0;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Entity Resolution (FR-01) — exact match trên tên + alias, KHÔNG fuzzy.
 * Điều chỉnh có chủ đích so với quyết định B1-B ở `03_FINAL_ARCHITECTURE.md`: với 2–3 dự án
 * biết trước, fuzzy match không còn cần thiết (`10_TECHNICAL_DECISION.md` §1 mục 2).
 * Trả về danh sách để giữ đúng yêu cầu FR-01: >1 ứng viên thì phải hỏi lại, không tự chọn.
 */
export function resolveProjects(userInput: string): HousingProject[] {
  const q = normalize(userInput);
  if (!q) return [];
  return projects.filter((p) =>
    [p.name, ...p.aliases].some((n) => {
      const key = normalize(n);
      return key === q || key.includes(q) || q.includes(key);
    })
  );
}

export function getProject(projectId: string): HousingProject | undefined {
  return projects.find((p) => p.projectId === projectId);
}

export function getDeveloper(developerId: string): Developer | undefined {
  return developers.find((d) => d.developerId === developerId);
}

export function getNewsForProject(projectId: string): ProjectNews[] {
  return projectNews
    .filter((n) => n.projectId === projectId)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

/**
 * GOVERNED_BY — nối Project sang Legal KG có sẵn của Eligibility Checker.
 * Đây là điểm khác biệt duy nhất so với Gemini/NotebookLM mà chính BRD nhận định (§3.3),
 * và là lý do `10_TECHNICAL_DECISION.md` xếp nó hạng 2 về điểm/giờ đầu tư.
 *
 * Tái dùng thẳng Legal KG, KHÔNG dựng bản sao — đúng cảnh báo ở `ai_context/TECH_DEBT.md` #10
 * về việc hai module xây hai phiên bản Legal KG rồi phải hợp nhất lại.
 */
export function getGoverningCitations(project: HousingProject): Citation[] {
  return project.governedByDocumentIds
    .map((docId) => {
      const doc = legalDocuments.find((d) => d.id === docId);
      if (!doc) return null;
      // Lấy điều khoản đang hiệu lực của văn bản đó làm đại diện trích dẫn.
      const article =
        legalArticles.find((a) => a.documentId === docId && a.status === "active") ??
        legalArticles.find((a) => a.documentId === docId);
      if (!article) return null;
      return {
        articleId: article.id,
        documentCode: doc.code,
        documentTitle: doc.title,
        articleLabel: article.label,
        effectiveDate: article.effectiveDate,
        confidence: article.confidence,
        sourceUrl: doc.sourceUrl,
      } satisfies Citation;
    })
    .filter((c): c is Citation => c !== null);
}

/**
 * Văn bản pháp lý áp dụng cho MỌI dự án NOXH, bất kể địa phương — dùng làm mặc định khi
 * dữ liệu dự án chưa khai báo `governedByDocumentIds`. Chỉ gồm văn bản trung ương đã
 * đối chiếu toàn văn (`confidence: "verified"`).
 */
export const DEFAULT_GOVERNING_DOCUMENT_IDS = ["doc-nd-136-2026", "doc-nd-54-2026"];
