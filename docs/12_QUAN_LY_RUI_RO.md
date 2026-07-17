# 12 — Quản lý rủi ro

> Đọc trong 4 phút. Tổng hợp rủi ro thành bảng ra quyết định — không lặp chi tiết, chỉ trỏ nguồn.

## Bảng rủi ro

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Trích dẫn sai điều khoản đã hết hiệu lực (do văn bản sửa đổi chồng lấp NĐ 54/2026 và NĐ 136/2026) | **Cao** — ảnh hưởng trực tiếp uy tín "Citation First" | Chỉ nạp Knowledge Graph từ văn bản gốc/hợp nhất; gắn nhãn "đang xác minh" nếu chưa chắc (xem `07_KNOWLEDGE_GRAPH.md`, `08_MO_HINH_DU_LIEU.md`) | Đội (LegalTech + Tech Lead) |
| Nguồn lực 1–2 người trong 48h | **Cao** — rủi ro tiến độ lớn hơn rủi ro kỹ thuật | Giới hạn cứng ở 1 use case (`14_BACKLOG.md`), từ chối mọi mở rộng scope giữa chừng | Chủ dự án |
| Chưa có rubric chấm điểm chính thức | Trung bình | Thiết kế theo triết lý sẵn có (chiều sâu, có reasoning + citation thật) là phương án an toàn nhất khi chưa có rubric | Chủ dự án xác nhận khi có rubric |
| Số liệu ngưỡng thu nhập dùng để demo có thể sai nếu văn bản hợp nhất thay đổi trước giờ demo | Trung bình | Không hard-code số liệu là "sự thật tuyệt đối" trong bất kỳ tài liệu pitch nào; luôn ghi kèm ngày tra cứu | Technical Writer / LegalTech |
| Ingestion thủ công có thể sai sót do không có kiểm chứng chéo (1 người làm) | Trung bình | Ưu tiên kiểm tra chéo tối thiểu 1 lần trước khi coi dữ liệu là FACT (xem `09_KIEN_TRUC_DU_LIEU.md`) | Đội |

## Nguyên tắc quản trị tri thức (áp dụng cho mọi tài liệu)
- Một nội dung — một nơi lưu (Single Source of Truth). Tài liệu này không lặp chi tiết rủi ro, chỉ tổng hợp để ra quyết định nhanh.
- Mọi số liệu pháp lý trong tài liệu pitch/demo phải trỏ được về `07_KNOWLEDGE_GRAPH.md`.

## Khuyến nghị
Xử lý dứt điểm rủi ro "trích dẫn sai điều khoản" trước khi build — đây là rủi ro duy nhất có thể khiến sản phẩm mất điểm ngay trong vài phút đầu demo nếu giám khảo có kiến thức pháp lý và bắt lỗi.
