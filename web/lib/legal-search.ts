import { legalArticles, legalDocuments } from "@/mock/legal-documents";
import type { LegalArticle, LegalDocument } from "@/types/legal";

/**
 * Tra cứu Legal KG — thuần code xác định, KHÔNG gọi LLM.
 *
 * Có chủ đích: đây là tra cứu, không phải suy luận. Gắn nhãn "AI" cho một thao tác lọc chuỗi
 * đúng là dạng "Potemkin AI" mà docs/16_DESIGN_REVIEW.md cảnh báo. Giá trị của màn hình này
 * nằm ở chỗ Knowledge Graph biết điều khoản nào đã bị thay thế bởi văn bản nào — thứ mà
 * tìm kiếm toàn văn thông thường không trả lời được.
 */

export interface ArticleWithDocument {
  article: LegalArticle;
  document: LegalDocument;
}

export interface AspectOption {
  value: string;
  label: string;
  count: number;
}

const ASPECT_LABELS: Record<string, string> = {
  tran_thu_nhap: "Trần thu nhập",
  dieu_kien_nha_o: "Điều kiện nhà ở",
  tham_quyen_xac_nhan: "Thẩm quyền xác nhận",
  he_so_dieu_chinh_cap_tinh: "Hệ số điều chỉnh cấp tỉnh",
  // Thêm 2026-07-19 khi nạp Luật Nhà ở 27/2023 và các văn bản còn lại.
  doi_tuong_huong_chinh_sach: "Đối tượng hưởng chính sách",
  dieu_kien_huong_chinh_sach: "Điều kiện hưởng chính sách",
  hinh_thuc_ho_tro: "Hình thức hỗ trợ",
  gia_ban_thue_mua: "Giá bán, giá thuê mua",
  ho_so_mau_don: "Hồ sơ, mẫu đơn",
};

export function aspectLabel(aspect: string | undefined): string {
  if (!aspect) return "Khác";
  return ASPECT_LABELS[aspect] ?? aspect;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

function withDocument(article: LegalArticle): ArticleWithDocument | null {
  const document = legalDocuments.find((d) => d.id === article.documentId);
  return document ? { article, document } : null;
}

export const allArticles: ArticleWithDocument[] = legalArticles
  .map(withDocument)
  .filter((x): x is ArticleWithDocument => x !== null);

export function availableAspects(): AspectOption[] {
  const counts = new Map<string, number>();
  allArticles.forEach(({ article }) => {
    const key = article.aspect ?? "khac";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: aspectLabel(value), count }))
    .sort((a, b) => b.count - a.count);
}

export interface SearchFilters {
  query: string;
  aspect: string | null;
  /** true = chỉ hiện điều khoản đang hiệu lực (ẩn bản đã bị sửa/thay thế). */
  activeOnly: boolean;
}

export function searchArticles({ query, aspect, activeOnly }: SearchFilters): ArticleWithDocument[] {
  const q = normalize(query.trim());

  return allArticles.filter(({ article, document }) => {
    if (aspect && (article.aspect ?? "khac") !== aspect) return false;
    if (activeOnly && article.status !== "active") return false;
    if (!q) return true;

    const haystack = normalize(
      [article.label, article.summary, document.code, document.title, aspectLabel(article.aspect)].join(" ")
    );
    // Mọi từ khoá đều phải xuất hiện — tránh kết quả nhiễu khi gõ cả cụm.
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });
}

/**
 * Chuỗi sửa đổi theo cùng một khía cạnh, sắp xếp theo ngày hiệu lực.
 * Đây là thứ trả lời được câu hỏi "quy định nào đang áp dụng hôm nay" — giá trị chính của KG.
 */
export function amendmentChainFor(article: LegalArticle): ArticleWithDocument[] {
  if (!article.aspect) return [];
  return allArticles
    .filter((x) => x.article.aspect === article.aspect)
    .sort((a, b) => a.article.effectiveDate.localeCompare(b.article.effectiveDate));
}

export function statusLabel(status: LegalArticle["status"]): string {
  if (status === "active") return "Đang hiệu lực";
  if (status === "amended") return "Đã bị sửa đổi";
  return "Đã bị thay thế";
}
