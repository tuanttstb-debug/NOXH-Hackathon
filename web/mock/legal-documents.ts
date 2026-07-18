import type { LegalDocument, LegalArticle } from "@/types/legal";

/**
 * Nguồn dữ liệu Legal KG (được `lib/eligibility/legal-kg.ts` dùng làm nguồn thật, không chỉ mock).
 *
 * Cập nhật 2026-07-18: các điều khoản đánh dấu `confidence: "verified"` đã được đối chiếu trực tiếp
 * với TOÀN VĂN văn bản gốc do chủ dự án cung cấp tại `web/lib/Legal/` — không còn là dữ liệu thứ cấp.
 * Điều khoản còn `confidence: "pending"` nghĩa là chưa đối chiếu toàn văn, và theo `fact_check` không
 * được dùng làm căn cứ cho kết luận Đủ/Không đủ (chỉ giữ để tra cứu lịch sử hiệu lực).
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
    title:
      "Sửa đổi, bổ sung Nghị định 100/2024/NĐ-CP (đã sửa tại NĐ 261/2025 và NĐ 54/2026) — điều kiện thu nhập",
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
      "'Chưa có nhà ở thuộc sở hữu của mình' được xác định khi đối tượng và vợ/chồng (nếu có) không có tên HOẶC không có nội dung thông tin về nhà ở trong Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất tại tỉnh/thành phố nơi có dự án NOXH.",
    effectiveDate: "2026-02-09",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-30-nd261",
    documentId: "doc-nd-261-2025",
    label: "Điều 30, Khoản 1–2 (sửa đổi)",
    aspect: "tran_thu_nhap",
    summary:
      "Trần thu nhập: độc thân ≤20tr/tháng, độc thân nuôi con ≤30tr/tháng, đã kết hôn (tổng thu nhập) ≤40tr/tháng. ĐÃ HẾT HIỆU LỰC đối với khoản 1 — bị NĐ 136/2026 thay thế toàn bộ (nâng lên 25/35/50tr) kể từ 2026-04-07. Giữ trong KG để tra cứu lịch sử, không dùng làm căn cứ kết luận.",
    effectiveDate: "2025-10-10",
    status: "amended",
    confidence: "verified",
  },
  {
    id: "art-dieu-30-nd136",
    documentId: "doc-nd-136-2026",
    label: "Điều 30, Khoản 1 (sửa đổi)",
    aspect: "tran_thu_nhap",
    summary:
      "Thay thế toàn bộ khoản 1 Điều 30 — trần thu nhập bình quân hàng tháng thực nhận cho đối tượng tại khoản 5, 6, 8 Điều 76 Luật Nhà ở: độc thân/chưa kết hôn ≤25tr (điểm a); độc thân nuôi con dưới tuổi thành niên ≤35tr (điểm a); đã kết hôn, tổng thu nhập hai vợ chồng ≤50tr (điểm b). Thời gian xác định: 12 tháng liền kề tính từ thời điểm cơ quan có thẩm quyền xác nhận (điểm c).",
    effectiveDate: "2026-04-07",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-30-k1d-nd136",
    documentId: "doc-nd-136-2026",
    label: "Điều 30, Khoản 1, Điểm d",
    aspect: "he_so_dieu_chinh_cap_tinh",
    summary:
      "UBND cấp tỉnh được quyết định hệ số điều chỉnh mức thu nhập quy định tại điểm a, điểm b khoản này, nhưng không vượt quá tỷ lệ giữa thu nhập bình quân đầu người tại địa phương so với thu nhập bình quân đầu người của cả nước. Nghĩa là mức 25/35/50tr là trần THEO QUY ĐỊNH TRUNG ƯƠNG — mức áp dụng thực tế tại từng tỉnh có thể cao hơn nếu UBND tỉnh đã ban hành hệ số.",
    effectiveDate: "2026-04-07",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-30-nd54",
    documentId: "doc-nd-54-2026",
    label: "Điều 30, Khoản 2 (sửa đổi thẩm quyền)",
    aspect: "tham_quyen_xac_nhan",
    summary:
      "Đối tượng tại khoản 5 Điều 76 Luật Nhà ở không có hợp đồng lao động: vẫn phải bảo đảm điều kiện thu nhập theo khoản 1 Điều này, và được cơ quan Công an cấp xã nơi thường trú/tạm trú/nơi ở hiện tại xác nhận (trước đây là UBND cấp xã). Thời hạn xác nhận: 07 ngày.",
    effectiveDate: "2026-02-09",
    status: "active",
    confidence: "verified",
  },
];
