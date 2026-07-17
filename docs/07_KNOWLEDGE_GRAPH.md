# 07 — Knowledge Graph

> Đọc trong 8 phút. Đây là Single Source of Truth cho danh mục văn bản pháp luật và thiết kế đồ thị tri thức.

## Nguồn văn bản (FACT — đã tra cứu 17/07/2026, có nguồn)
Khung pháp lý NOXH hiện hành gồm 1 Luật gốc + 4 Nghị định (1 gốc, 3 sửa đổi/bổ sung liên tiếp):

| Văn bản | Vai trò | Ngày ban hành / hiệu lực | Nguồn |
|---|---|---|---|
| Luật Nhà ở 2023 (Luật số 27/2023/QH15) | Luật gốc | Hiệu lực từ 01/08/2024 | [luatvietnam.vn](https://luatvietnam.vn/dat-dai-nha-o/nha-o-xa-hoi-567-30110-article.html) |
| Nghị định 100/2024/NĐ-CP | Quy định chi tiết phát triển & quản lý NOXH (văn bản lõi) | Ban hành 26/07/2024 | [xaydungchinhsach.chinhphu.vn](https://xaydungchinhsach.chinhphu.vn/nghi-dinh-so-261-2025-nd-cp-quy-dinh-moi-ve-nha-o-xa-hoi-119251013184517247.htm) |
| Nghị định 261/2025/NĐ-CP | Sửa Điều 30 NĐ 100/2024 — nâng trần thu nhập (độc thân ≤20tr, độc thân nuôi con ≤30tr, đã kết hôn tổng thu nhập ≤40tr/tháng); giảm lãi suất vay ưu đãi còn 5,4%/năm | Hiệu lực từ 10/10/2025 | [baochinhphu.vn](https://baochinhphu.vn/sua-doi-nhieu-noi-dung-quan-trong-lien-quan-den-chinh-sach-nha-o-xa-hoi-102251013174542881.htm) |
| Nghị định 54/2026/NĐ-CP | Sửa Điều 29 (điều kiện "chưa có nhà ở" — mở rộng tiêu chí); sửa Điều 30 (chuyển thẩm quyền xác nhận thu nhập từ UBND cấp xã → Công an cấp xã) | Ban hành 09/02/2026 | [xaydungchinhsach.chinhphu.vn](https://xaydungchinhsach.chinhphu.vn/nghi-dinh-so-54-2026-nd-cp-quy-dinh-moi-ve-mua-ban-thue-mua-cho-thue-gia-nha-o-xa-hoi-119260220165054643.htm) |
| Nghị định 136/2026/NĐ-CP | Sửa tiếp Điều 30 — nâng trần thu nhập người độc thân lên ≤25tr/tháng | Ban hành 07/04/2026 | [baochinhphu.vn](https://baochinhphu.vn/chinh-thuc-nang-muc-tran-thu-nhap-duoc-mua-nha-o-xa-hoi-len-25-trieu-dong-thang-tu-7-4-2026-102260408114223058.htm) |

## Thiết kế đồ thị (Schema mức khái niệm)
**Loại thực thể (Node types):**
`VanBan` (văn bản) · `DieuKhoan` (điều/khoản) · `DieuKienThuHuong` (điều kiện thụ hưởng: nhà ở/thu nhập/cư trú) · `NguongSo` (ngưỡng số liệu, ví dụ trần thu nhập) · `DoiTuongThuHuong` (nhóm đối tượng: độc thân, đã kết hôn...).

**Loại quan hệ (Edge types):**
`SUA_DOI_BOI_SUNG` (VanBan → VanBan) · `QUY_DINH` (VanBan → DieuKhoan) · `AP_DUNG_CHO` (DieuKhoan → DoiTuongThuHuong) · `CO_HIEU_LUC_TU` / `HET_HIEU_LUC_TU` (DieuKhoan → Ngày) · `THAY_THE` (DieuKhoan → DieuKhoan, dùng khi một điều khoản thay thế điều khoản cũ).

**Nguyên tắc bắt buộc**: mọi `DieuKhoan` phải có thuộc tính `trang_thai_hieu_luc` (đang hiệu lực / đã bị thay thế) và `ngay_hieu_luc`. Đây là cơ chế trực tiếp giải quyết RISK "trích dẫn sai điều khoản hết hiệu lực" (`12_QUAN_LY_RUI_RO.md`) — thay vì để Agent tự suy luận văn bản nào mới hơn, đồ thị lưu tường minh trạng thái hiệu lực.

## Ví dụ minh hoạ (mô tả, không phải code)
`Điều 30 (NĐ 100/2024)` --[SUA_DOI_BOI_SUNG]--> `Điều 30 (NĐ 261/2025)` --[SUA_DOI_BOI_SUNG]--> `Điều 30 (NĐ 136/2026, phần trần thu nhập)`, song song `Điều 30 (NĐ 261/2025)` --[SUA_DOI_BOI_SUNG]--> `Điều 30 (NĐ 54/2026, phần thẩm quyền xác nhận)`. Hai nhánh sửa đổi từ cùng một điều gốc nhưng khác nội dung (trần thu nhập vs. thẩm quyền xác nhận) — đồ thị phải phân biệt được để không báo xung đột giả.

## RISK
- **Văn bản sửa đổi chồng lấp**: NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 NĐ 100/2024 nhưng theo hai nội dung khác nhau. Cần bản hợp nhất chính thức (Bộ Xây dựng) để đồ thị không nạp nhầm điều khoản đã hết hiệu lực.
- Nguồn tra cứu hiện tại là báo/trang tổng hợp, không phải toàn văn Công báo. Cần thay bằng file toàn văn trước khi nạp chính thức vào Knowledge Graph.

## OPEN QUESTION
- Toàn văn hợp nhất mới nhất của NĐ 100/2024/NĐ-CP — bạn có sẵn file/link chính thức không?
- Phạm vi: chỉ văn bản Trung ương (Luật + Nghị định), hay cần thêm văn bản địa phương?
- Có cần Thông tư hướng dẫn của Bộ Xây dựng/Bộ Tài chính (lãi suất, thủ tục) không?

## TODO
- [ ] Thay nguồn báo bằng văn bản gốc (Công báo Chính phủ / thuvienphapluat.vn bản đầy đủ).
- [ ] Lập bảng mapping "điều khoản gốc → điều khoản đang hiệu lực" trước khi nạp Knowledge Graph.
