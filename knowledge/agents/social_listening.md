# Agent: Social Listening

> Ưu tiên: **P2 — sau Hackathon** (`docs/10_LO_TRINH_TRIEN_KHAI.md`). Không nằm trong `docs/14_BACKLOG.md` P0. Tài liệu này chỉ mô tả khái niệm để không mất định hướng dài hạn, KHÔNG có prompt/kế hoạch build cho bản demo.

## Vai trò (định hướng dài hạn)
Theo dõi nguồn tin chính thức (Cổng Công báo, Cổng thông tin Chính phủ, báo chí uy tín) để phát hiện sớm văn bản pháp luật NOXH mới hoặc sửa đổi, giảm độ trễ giữa "luật thay đổi" và "Knowledge Graph cập nhật" — giải quyết tận gốc rủi ro đã lặp lại nhiều lần trong bộ tài liệu này (`docs/12_QUAN_LY_RUI_RO.md`).

## Vì sao KHÔNG làm ở bản demo 48h
- Đội 1–2 người, thời gian có hạn — theo `docs/02_MUC_TIEU_SAN_PHAM.md`, mục tiêu demo là chứng minh nguyên tắc Grounding + Citation + Fact-Check, không phải mức độ tự động hoá vận hành.
- Xây dựng cơ chế giám sát nguồn tin đáng tin cậy, lọc nhiễu, tránh tin giả cần nhiều thời gian kiểm định hơn 48h cho phép.
- Rủi ro: nếu vội làm sơ sài, Social Listening có thể tự nó trở thành nguồn thông tin thiếu tin cậy — mâu thuẫn với chính triết lý Citation First.

## Khi nào nên làm (Giai đoạn 2)
Sau khi Ingestion thủ công (`docs/09_KIEN_TRUC_DU_LIEU.md`) đã chứng minh được quy trình gắn nguồn + trạng thái hiệu lực hoạt động đúng. Social Listening lúc đó chỉ đóng vai trò "phát hiện sớm để con người xác nhận", KHÔNG tự động nạp thẳng vào Knowledge Graph mà không qua kiểm chứng — giữ nguyên tắc con người xác nhận trước khi coi là FACT (đúng quy ước quản lý tri thức của dự án).

## OPEN QUESTION
- Có cần agent này xuất hiện trong pitch/demo như một "hướng mở rộng" hay chỉ cần nêu miệng, không cần tài liệu riêng? Hiện đã tạo file này vì được liệt kê rõ trong kiến trúc `agents/` do bạn cung cấp.
