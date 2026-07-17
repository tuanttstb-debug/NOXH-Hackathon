# 09 — Kiến trúc dữ liệu

> Đọc trong 6 phút. Cách dữ liệu di chuyển trong hệ thống — khác với `08_MO_HINH_DU_LIEU.md` (mô tả hình dạng dữ liệu tĩnh), tài liệu này mô tả luồng và vòng đời dữ liệu.

## Luồng dữ liệu pháp lý (Ingestion → Serving)
1. **Nguồn**: văn bản gốc (Luật, Nghị định) — ưu tiên Công báo Chính phủ/nguồn chính thức, không dùng bài báo tổng hợp làm nguồn cuối (xem OPEN QUESTION `07_KNOWLEDGE_GRAPH.md`).
2. **Chuẩn hoá thủ công có kiểm chứng**: với quy mô 1–2 người/48h, không xây pipeline OCR/tự động tự động hoá trích xuất điều khoản — nhập thủ công nhưng bắt buộc gắn nguồn + ngày hiệu lực cho từng bản ghi. Đánh đổi này ưu tiên độ chính xác hơn tốc độ tự động hoá (xem ADR liên quan ở `13_QUYET_DINH_KIEN_TRUC.md`).
3. **Gắn phiên bản & trạng thái hiệu lực**: mỗi lần nạp một Nghị định sửa đổi, phải cập nhật `trang_thai_hieu_luc` của điều khoản bị thay thế — không chỉ thêm mới.
4. **Lưu trữ (Knowledge Graph Store)**: phục vụ truy vấn cho AI Agent.
5. **Lớp truy vấn cho Agent**: Agent chỉ được đọc, không được ghi vào Knowledge Graph Store — đảm bảo tính toàn vẹn nguồn sự thật.

## Truy vết nguồn gốc (Data Lineage)
Mọi trích dẫn Agent đưa ra phải truy ngược được: `Kết quả trả lời → DieuKhoan → VanBan gốc → link nguồn`. Đây là yêu cầu kỹ thuật trực tiếp phục vụ nguyên tắc Citation First, không phải tính năng phụ.

## Vòng đời khi có văn bản sửa đổi mới
Khi phát hiện một Nghị định/Thông tư sửa đổi mới: (1) thêm `VanBan` mới, (2) tạo quan hệ `SUA_DOI_BOI_SUNG` tới điều khoản bị ảnh hưởng, (3) cập nhật `trang_thai_hieu_luc` của điều khoản cũ thành "đã bị thay thế", (4) KHÔNG xoá dữ liệu cũ — giữ lại để phục vụ tra cứu lịch sử/kiểm chứng.

## Giới hạn có chủ đích (bản demo)
- Không có cơ chế tự động phát hiện văn bản mới (crawl/alert) — cập nhật thủ công.
- Không có cơ chế phân tán/sao lưu — một bản dữ liệu duy nhất, đủ dùng cho demo.

## Liên kết
- Rủi ro liên quan trực tiếp: `12_QUAN_LY_RUI_RO.md`
- Quyết định công nghệ lưu trữ cụ thể: `13_QUYET_DINH_KIEN_TRUC.md`
