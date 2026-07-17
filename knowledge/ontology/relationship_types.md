# Ontology — Relationship Types

> Mở rộng chi tiết từ `docs/07_KNOWLEDGE_GRAPH.md`.

## SUA_DOI_BOI_SUNG (VanBan/DieuKhoan → VanBan/DieuKhoan)
- **Ý nghĩa**: văn bản/điều khoản đích sửa đổi, bổ sung văn bản/điều khoản nguồn.
- **Thuộc tính bắt buộc**: `khia_canh` (khía cạnh nội dung bị sửa — VD: "tran_thu_nhap", "tham_quyen_xac_nhan"). Bắt buộc để phân biệt các nhánh sửa đổi cùng một Điều nhưng khác nội dung, như trường hợp NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 (xem `phap_ly/nghi_dinh/nghi_dinh_54_2026.md`).
- **Cardinality**: một `DieuKhoan` có thể bị sửa bởi nhiều văn bản khác nhau (nhiều nhánh `khia_canh` khác nhau), nhưng mỗi `khia_canh` chỉ có một bản sửa đổi mới nhất đang hiệu lực tại một thời điểm.

## THAY_THE (DieuKhoan → DieuKhoan)
- **Ý nghĩa**: điều khoản đích thay thế hoàn toàn điều khoản nguồn (khác với sửa đổi một phần).
- Khi quan hệ này tồn tại, điều khoản nguồn bắt buộc phải có `trang_thai_hieu_luc = đã bị thay thế`.

## QUY_DINH (VanBan → DieuKhoan)
- **Ý nghĩa**: văn bản chứa điều khoản này.
- Quan hệ 1-nhiều, bắt buộc — mọi `DieuKhoan` phải có đúng 1 quan hệ `QUY_DINH` từ `VanBan` gốc.

## DUOC_HUONG_DAN_BOI (Luật → Nghị định/Thông tư)
- **Ý nghĩa**: văn bản dưới luật hướng dẫn thi hành một Luật.
- VD: `Luật Nhà ở 2023` --[DUOC_HUONG_DAN_BOI]--> `NĐ 100/2024`.

## AP_DUNG_CHO (DieuKienThuHuong → DoiTuongThuHuong)
- **Ý nghĩa**: điều kiện áp dụng cho nhóm đối tượng nào.

## CO_HIEU_LUC_TU / HET_HIEU_LUC_TU (DieuKhoan → date)
- **Ý nghĩa**: mốc thời gian hiệu lực — dùng cho truy vấn "điều khoản nào đang hiệu lực tại ngày X" mà `legal_reasoner` (agent) cần thực hiện ở mỗi lượt hỏi.

## THAM_CHIEU_DEN (DieuKhoan → DieuKhoan, cross-reference)
- **Ý nghĩa**: một điều khoản viện dẫn điều khoản khác mà không sửa đổi nó — VD: NĐ 100/2024 Điều 29 khoản 1 viện dẫn Điều 77 Luật Nhà ở 2023.

## Nguyên tắc kiểm tra tính nhất quán (áp dụng khi nạp dữ liệu)
Trước khi thêm một quan hệ `SUA_DOI_BOI_SUNG` hoặc `THAY_THE` mới, hệ thống (hoặc người nhập liệu) phải kiểm tra: có `khia_canh` nào của `DieuKhoan` đích đã có một quan hệ hiệu lực gần hơn về thời gian chưa — nếu có, quan hệ mới phải cập nhật `trang_thai_hieu_luc` của quan hệ cũ, không được để hai quan hệ cùng `khia_canh` cùng "đang hiệu lực". Đây là quy tắc trực tiếp ngăn lỗi trích dẫn chồng lấp.
