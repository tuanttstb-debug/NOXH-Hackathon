import type { LegalDocument, LegalArticle } from "@/types/legal";

/**
 * Mock data — nội dung lấy từ khnowledge/phap_ly/ (đã tra cứu, có nguồn).
 * Đây là dữ liệu "đang xác minh" (chưa đối chiếu văn bản gốc/Công báo) —
 * xem knowledge/ontology/metadata.md. Dùng để demo, KHÔNG dùng làm căn cứ pháp lý thật.
 */
export const legalDocuments: LegalDocument[] = [
  {
    id: "doc-luat-nha-o-2023",
    code: "27/2023/QH15",
    title: "Luật Nhà ở",
    type: "luat",
    issuedDate: "2023-11-27",
    effectiveDate: "2024-08-01",
    status: "active",
    sourceUrl:
      "https://sxd.laocai.gov.vn/luat--phap-lenh/luat-so-27-2023-qh15-ngay-27-11-2023-luat-nha-o-1282238",
  },
  {
    id: "doc-nd-100-2024",
    code: "100/2024/NĐ-CP",
    title: "Quy định chi tiết phát triển và quản lý nhà ở xã hội",
    type: "nghi_dinh",
    issuedDate: "2024-07-26",
    effectiveDate: "2024-08-01",
    status: "amended",
    sourceUrl:
      "https://vanban.chinhphu.vn/?pageid=27160&docid=210760",
  },
  {
    id: "doc-nd-261-2025",
    code: "261/2025/NĐ-CP",
    title: "Sửa đổi, bổ sung Nghị định 100/2024/NĐ-CP",
    type: "nghi_dinh",
    issuedDate: "2025-10-10",
    effectiveDate: "2025-10-10",
    status: "amended",
    sourceUrl:
      "https://baochinhphu.vn/sua-doi-nhieu-noi-dung-quan-trong-lien-quan-den-chinh-sach-nha-o-xa-hoi-102251013174542881.htm",
  },
  {
    id: "doc-nd-54-2026",
    code: "54/2026/NĐ-CP",
    title: "Sửa đổi điều kiện nhà ở và thẩm quyền xác nhận thu nhập",
    type: "nghi_dinh",
    issuedDate: "2026-02-09",
    effectiveDate: "2026-02-09",
    status: "active",
    sourceUrl:
      "https://xaydungchinhsach.chinhphu.vn/nghi-dinh-so-54-2026-nd-cp-quy-dinh-moi-ve-mua-ban-thue-mua-cho-thue-gia-nha-o-xa-hoi-119260220165054643.htm",
  },
  {
    id: "doc-nd-136-2026",
    code: "136/2026/NĐ-CP",
    title: "Nâng mức trần thu nhập người độc thân",
    type: "nghi_dinh",
    issuedDate: "2026-04-07",
    effectiveDate: "2026-04-07",
    status: "active",
    sourceUrl:
      "https://baochinhphu.vn/chinh-thuc-nang-muc-tran-thu-nhap-duoc-mua-nha-o-xa-hoi-len-25-trieu-dong-thang-tu-7-4-2026-102260408114223058.htm",
  },
];

export const legalArticles: LegalArticle[] = [
  {
    id: "art-dieu-29-k1-nd100",
    documentId: "doc-nd-100-2024",
    label: "Điều 29, Khoản 1",
    aspect: "dieu_kien_nha_o",
    summary:
      "Xác định 'chưa có nhà ở thuộc sở hữu' khi đối tượng và vợ/chồng (nếu có) không có tên trong Giấy chứng nhận quyền sử dụng đất tại tỉnh/thành phố nơi có dự án NOXH.",
    effectiveDate: "2024-08-01",
    status: "amended",
    confidence: "pending",
  },
  {
    id: "art-dieu-29-k1-nd54",
    documentId: "doc-nd-54-2026",
    label: "Điều 29, Khoản 1 (sửa đổi)",
    aspect: "dieu_kien_nha_o",
    summary:
      "Mở rộng tiêu chí 'chưa có nhà ở' — bao gồm cả trường hợp không có thông tin về nhà ở trong Giấy chứng nhận.",
    effectiveDate: "2026-02-09",
    status: "active",
    confidence: "pending",
  },
  {
    id: "art-dieu-30-nd261",
    documentId: "doc-nd-261-2025",
    label: "Điều 30, Khoản 1–2 (sửa đổi)",
    aspect: "tran_thu_nhap",
    summary:
      "Trần thu nhập: độc thân ≤20tr/tháng, độc thân nuôi con ≤30tr/tháng, đã kết hôn (tổng thu nhập) ≤40tr/tháng. Giảm lãi suất vay ưu đãi còn 5,4%/năm.",
    effectiveDate: "2025-10-10",
    status: "amended",
    confidence: "pending",
  },
  {
    id: "art-dieu-30-nd136",
    documentId: "doc-nd-136-2026",
    label: "Điều 30 (sửa đổi mức trần độc thân)",
    aspect: "tran_thu_nhap",
    summary:
      "Nâng trần thu nhập người độc thân chưa kết hôn lên ≤25tr/tháng (tăng 5tr so với NĐ 261/2025).",
    effectiveDate: "2026-04-07",
    status: "active",
    confidence: "pending",
  },
  {
    id: "art-dieu-30-nd54",
    documentId: "doc-nd-54-2026",
    label: "Điều 30, Khoản 2 (sửa đổi thẩm quyền)",
    aspect: "tham_quyen_xac_nhan",
    summary:
      "Chuyển thẩm quyền xác nhận thu nhập từ UBND cấp xã sang Công an cấp xã.",
    effectiveDate: "2026-02-09",
    status: "active",
    confidence: "pending",
  },
];
