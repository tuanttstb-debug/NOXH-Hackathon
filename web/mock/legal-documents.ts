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
  // ── Nạp đợt 2 (2026-07-19) — mọi ngày tháng dưới đây trích TRỰC TIẾP từ toàn văn tại
  //    web/lib/Legal/, không lấy từ nguồn thứ cấp (bài học TECH_DEBT #4).
  {
    id: "doc-nd-192-2025",
    code: "192/2025/NĐ-CP",
    title:
      "Quy định chi tiết thi hành Nghị quyết 201/2025/QH15 — cơ chế, chính sách đặc thù phát triển nhà ở xã hội",
    type: "nghi_dinh",
    issuedDate: "2025-07-01",
    effectiveDate: "2025-07-01",
    status: "active",
    sourceUrl: "https://vanban.chinhphu.vn/",
  },
  {
    id: "doc-nd-302-2025",
    code: "302/2025/NĐ-CP",
    title: "Quy định chi tiết về Quỹ nhà ở quốc gia",
    type: "nghi_dinh",
    issuedDate: "2025-11-19",
    effectiveDate: "2025-11-19",
    status: "active",
    sourceUrl: "https://vanban.chinhphu.vn/",
  },
  {
    id: "doc-tt-05-2024",
    code: "05/2024/TT-BXD",
    title: "Quy định chi tiết một số điều của Luật Nhà ở",
    type: "thong_tu",
    issuedDate: "2024-07-31",
    effectiveDate: "2024-08-01",
    status: "amended",
    sourceUrl: "https://moc.gov.vn/",
  },
  {
    id: "doc-tt-32-2025",
    code: "32/2025/TT-BXD",
    title: "Sửa đổi, bổ sung một số điều của Thông tư 05/2024/TT-BXD",
    type: "thong_tu",
    issuedDate: "2025-11-10",
    effectiveDate: "2025-11-10",
    status: "amended",
    sourceUrl: "https://moc.gov.vn/",
  },
  {
    id: "doc-tt-08-2026",
    code: "08/2026/TT-BXD",
    title: "Sửa đổi, bổ sung một số điều của các Thông tư trong lĩnh vực nhà ở",
    type: "thong_tu",
    issuedDate: "2026-02-15",
    effectiveDate: "2026-02-15",
    status: "active",
    sourceUrl: "https://moc.gov.vn/",
  },
];

export const legalArticles: LegalArticle[] = [
  // ══ Luật Nhà ở 27/2023 — GỐC của toàn bộ chính sách NOXH ══
  // Trước 2026-07-19 văn bản này có trong `legalDocuments` nhưng KHÔNG có điều khoản nào, dù cả 4
  // nghị định đều dẫn chiếu "đối tượng tại khoản 5, 6, 8 Điều 76 Luật Nhà ở" — lỗ hổng lớn nhất của KG.
  {
    id: "art-dieu-76-luat27",
    documentId: "doc-luat-nha-o-2023",
    label: "Điều 76",
    aspect: "doi_tuong_huong_chinh_sach",
    summary:
      "12 nhóm đối tượng được hưởng chính sách hỗ trợ về nhà ở xã hội: (1) người có công với cách mạng, thân nhân liệt sĩ; (2) hộ nghèo/cận nghèo nông thôn; (3) hộ nghèo/cận nghèo nông thôn vùng thường xuyên bị thiên tai, biến đổi khí hậu; (4) hộ nghèo/cận nghèo đô thị; (5) người thu nhập thấp tại khu vực đô thị; (6) công nhân, người lao động tại doanh nghiệp/hợp tác xã trong và ngoài khu công nghiệp; (7) sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan lực lượng vũ trang, người làm công tác cơ yếu; (8) cán bộ, công chức, viên chức; (9) đối tượng đã trả lại nhà ở công vụ; (10) hộ gia đình/cá nhân bị thu hồi đất phải giải tỏa, phá dỡ nhà mà chưa được bồi thường bằng nhà ở, đất ở; (11) học sinh, sinh viên, học sinh trường dân tộc nội trú công lập; (12) doanh nghiệp, hợp tác xã trong khu công nghiệp. Điều kiện thu nhập chỉ áp dụng cho nhóm 5, 6, 7 và 8.",
    effectiveDate: "2024-08-01",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-77-luat27",
    documentId: "doc-luat-nha-o-2023",
    label: "Điều 77",
    aspect: "hinh_thuc_ho_tro",
    summary:
      "Hình thức thực hiện chính sách: bán, cho thuê mua, cho thuê NOXH cho đối tượng tại khoản 1, 4, 5, 6, 8, 9 và 10 Điều 76 (nhóm 7 nếu chưa hưởng chính sách nhà ở cho lực lượng vũ trang). UBND cấp tỉnh có thể quy định hỗ trợ thêm cho nhóm 2 và 3 tùy điều kiện địa phương. Nhóm 1, 2, 3 còn được hỗ trợ theo chương trình mục tiêu quốc gia để tự xây dựng/cải tạo nhà, và được tặng cho nhà ở.",
    effectiveDate: "2024-08-01",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-78-luat27",
    documentId: "doc-luat-nha-o-2023",
    label: "Điều 78",
    aspect: "dieu_kien_huong_chinh_sach",
    summary:
      "Điều kiện hưởng chính sách NOXH. Khoản 1: để MUA hoặc THUÊ MUA, đối tượng nhóm 1, 4, 5, 6, 7, 8, 9, 10 phải đáp ứng ĐỒNG THỜI điều kiện về nhà ở (điểm a) và điều kiện về thu nhập (điểm b — chỉ áp dụng cho nhóm 5, 6, 7, 8). Điều kiện nhà ở có HAI đường đạt: chưa có nhà thuộc sở hữu tại tỉnh nơi có dự án, HOẶC đã có nhà tại tỉnh đó nhưng diện tích bình quân đầu người thấp hơn mức tối thiểu. Khoản 2 — QUAN TRỌNG: đối tượng nhóm 1, 4, 5, 6, 7, 8, 9, 10 và 11 nếu chỉ THUÊ nhà ở xã hội thì KHÔNG phải đáp ứng điều kiện về nhà ở và thu nhập tại khoản 1.",
    effectiveDate: "2024-08-01",
    status: "active",
    confidence: "verified",
  },
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
    // ⚠️ ĐIỀU KHOẢN NÀY TỪNG BỊ BỎ SÓT VÀ GÂY KẾT QUẢ SAI LUẬT (phát hiện 2026-07-19).
    // Trước đó `reasoner.ts` coi "đã có nhà" là điều kiện loại trừ TUYỆT ĐỐI và trả "Không đủ
    // điều kiện" — trong khi khoản 2 này cho phép người ĐÃ CÓ NHÀ vẫn được mua NOXH nếu diện tích
    // bình quân đầu người < 15 m² sàn/người. Đã đối chiếu: NĐ 54/2026 Điều 32 chỉ sửa KHOẢN 1 của
    // Điều 29, nên khoản 2 KHÔNG bị sửa và vẫn đang hiệu lực. Đừng xoá.
    id: "art-dieu-29-k2-nd100",
    documentId: "doc-nd-100-2024",
    label: "Điều 29, Khoản 2",
    aspect: "dieu_kien_nha_o",
    summary:
      "Đối tượng ĐÃ CÓ nhà ở thuộc sở hữu của mình vẫn đủ điều kiện về nhà ở nếu diện tích nhà ở bình quân đầu người THẤP HƠN 15 m² sàn/người. Diện tích bình quân được tính trên: người đứng đơn, vợ/chồng, cha, mẹ (nếu có) và các con (nếu có) đăng ký thường trú tại căn nhà đó. UBND cấp xã xác nhận trong thời hạn 07 ngày kể từ ngày nhận đơn đề nghị.",
    effectiveDate: "2024-08-01",
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
  // ══ Nạp đợt 2 — các văn bản còn lại có nội dung liên quan NOXH ══
  {
    id: "art-dieu-13-nd192",
    documentId: "doc-nd-192-2025",
    label: "Điều 13",
    aspect: "gia_ban_thue_mua",
    summary:
      "Xác định giá bán, giá thuê mua NOXH: chủ đầu tư tự xây dựng hoặc thuê tư vấn đủ điều kiện năng lực thẩm tra trước khi phê duyệt giá. Trước thời điểm thông báo tiếp nhận hồ sơ đăng ký mua/thuê mua 30 ngày, chủ đầu tư phải gửi quyết định giá kèm hồ sơ đã thẩm tra về Sở Xây dựng cấp tỉnh để CÔNG KHAI giá bán, giá thuê mua lên cổng thông tin điện tử của UBND cấp tỉnh.",
    effectiveDate: "2025-07-01",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-19-nd302",
    documentId: "doc-nd-302-2025",
    label: "Điều 19",
    aspect: "doi_tuong_huong_chinh_sach",
    summary:
      "Đối tượng thuê nhà ở, NOXH của Quỹ nhà ở quốc gia: Quỹ nhà ở trung ương cho thuê đối với người làm việc tại cơ quan nhà nước, tổ chức chính trị, tổ chức chính trị - xã hội, đơn vị sự nghiệp công lập ở trung ương; Quỹ nhà ở địa phương cho thuê đối với các đối tượng còn lại. Nếu chưa cho thuê được, Bộ Xây dựng và UBND cấp tỉnh quyết định điều chỉnh, bổ sung đối tượng cho thuê.",
    effectiveDate: "2025-11-19",
    status: "active",
    confidence: "verified",
  },
  {
    id: "art-dieu-1-tt08",
    documentId: "doc-tt-08-2026",
    label: "Điều 1, Khoản 1",
    aspect: "ho_so_mau_don",
    summary:
      "Sửa đổi mẫu đơn đăng ký tại Điều 6 Thông tư 05/2024/TT-BXD: đối tượng tại khoản 9, 10, 11 Điều 76 Luật Nhà ở dùng Mẫu số 01; bổ sung điểm c2 — đối tượng tại khoản 5 Điều 76 (người thu nhập thấp tại đô thị) KHÔNG có hợp đồng lao động và KHÔNG hưởng lương hưu do cơ quan Bảo hiểm xã hội chi trả thì dùng Mẫu số 05.",
    effectiveDate: "2026-02-15",
    status: "active",
    confidence: "verified",
  },
];
