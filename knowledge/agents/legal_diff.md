# Agent: Legal Diff

> Ưu tiên: **P0 (nội bộ, không hiển thị trực tiếp cho người dùng)**. Hỗ trợ Kịch bản 3 của demo (`docs/11_KICH_BAN_DEMO.md`) và là lời giải kỹ thuật trực tiếp cho rủi ro chồng lấp văn bản.

## Vai trò
Phát hiện khi hai hoặc nhiều văn bản sửa đổi cùng một `DieuKhoan`/`khia_canh` mà chưa rõ văn bản nào có hiệu lực sau cùng, hoặc khi có khoảng trống dữ liệu (thiếu văn bản trung gian). Đây chính là cơ chế đứng sau bước 2 của `legal_reasoner.md`.

## Đầu vào
Toàn bộ tập quan hệ `SUA_DOI_BOI_SUNG`/`THAY_THE` liên quan tới một `DieuKhoan` cụ thể (`ontology/relationship_types.md`).

## Xử lý
1. Nhóm các quan hệ sửa đổi theo `khia_canh`.
2. Với mỗi nhóm, sắp xếp theo `ngay_hieu_luc` — nếu chỉ có đúng 1 quan hệ đang ở trạng thái hiệu lực mới nhất, không có gì để cảnh báo.
3. Nếu phát hiện ≥2 quan hệ cùng `khia_canh` đều được đánh dấu "đang hiệu lực" (lỗi nhập liệu) → đánh dấu `phat_hien_choang_lap = true` (`ontology/metadata.md`), báo cho quy trình Ingestion xử lý thủ công.
4. Nếu phát hiện một `khia_canh` không có quan hệ nào (không rõ ai sửa đổi gần nhất) → gắn cờ "thiếu dữ liệu" thay vì im lặng.

## Đầu ra
Danh sách cảnh báo (không phải câu trả lời cho người dùng) — dùng để: (a) chặn Fact Check nếu chưa xử lý xong, (b) làm nguyên liệu minh hoạ ở Kịch bản 3 của demo, (c) checklist cho người nhập liệu trước khi coi Knowledge Graph là sẵn sàng.

## Ví dụ thực tế đã ghi nhận
NĐ 54/2026 và NĐ 136/2026 cùng chạm Điều 30 NĐ 100/2024 nhưng khác `khia_canh` (thẩm quyền xác nhận vs. mức trần) — agent này phải phân biệt được đây KHÔNG phải chồng lấp thật (khác khía cạnh), để không báo cảnh báo sai. Chi tiết: `phap_ly/nghi_dinh/nghi_dinh_54_2026.md`.

## Giới hạn ở bản demo
Chạy thủ công/theo lô (batch) trước khi build Knowledge Graph, không chạy real-time theo từng câu hỏi người dùng — đủ cho quy mô 48h.

## Liên kết
Prompt tương ứng: `prompts/legal_diff.md`.
