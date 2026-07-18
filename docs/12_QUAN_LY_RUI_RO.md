# 12 — Quản lý rủi ro

> Đọc trong 4 phút. Tổng hợp rủi ro thành bảng ra quyết định — không lặp chi tiết, chỉ trỏ nguồn.

## Bảng rủi ro

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| ~~Trích dẫn sai điều khoản do NĐ 54/2026 và NĐ 136/2026 chồng lấp~~ | ✅ **ĐÃ ĐÓNG 2026-07-18** | Đối chiếu toàn văn cả hai: NĐ 54/2026 sửa **khoản 2** Điều 30 (thẩm quyền xác nhận), NĐ 136/2026 sửa **khoản 1** (mức trần) — hai khoản khác nhau, **không hề chồng lấp**. Rủi ro này là sản phẩm của việc đọc nguồn thứ cấp. Chi tiết: `ai_context/SESSION_HANDOVER.md` Session 6 | Đã xử lý |
| Trích dẫn số liệu đã hết hiệu lực do KG không được cập nhật khi luật sửa đổi | **Cao** — đã xảy ra thật một lần | Nợ này **đã gây thiệt hại thật**: code từng dùng trần 30tr/40tr của NĐ 261/2025 đã hết hiệu lực cho 2/3 nhóm đối tượng. Ứng phó hiện tại: mọi điều khoản dùng làm căn cứ phải có `confidence: "verified"` (đã đối chiếu toàn văn) và `status: "active"`; `fact_check()` chặn ở runtime. Mọi lần luật sửa đổi phải cập nhật `web/mock/legal-documents.ts` + `web/lib/eligibility/legal-kg.ts` | Đội (LegalTech + Tech Lead) |
| Mức trần áp dụng tại địa phương khác trần trung ương (hệ số điều chỉnh cấp tỉnh — NĐ 136/2026 Điều 30 k1 điểm d) | Trung bình — **giới hạn tri thức có thật, không khắc phục được bằng đọc kỹ văn bản** | Không suy đoán: registry `provincialCoefficients` để rỗng, hệ thống trả "Thiếu thông tin" khi thu nhập vượt trần trung ương và người dùng có nêu tỉnh. Đây là hành vi đúng, đồng thời là kịch bản demo trọng tâm (`11_KICH_BAN_DEMO.md` Kịch bản 3) | Đội |
| Nguồn lực 1–2 người trong 48h | **Cao** — rủi ro tiến độ lớn hơn rủi ro kỹ thuật | Giới hạn cứng ở 1 use case (`14_BACKLOG.md`), từ chối mọi mở rộng scope giữa chừng | Chủ dự án |
| Chưa có rubric chấm điểm chính thức | Trung bình | Thiết kế theo triết lý sẵn có (chiều sâu, có reasoning + citation thật) là phương án an toàn nhất khi chưa có rubric | Chủ dự án xác nhận khi có rubric |
| Số liệu ngưỡng thu nhập dùng để demo có thể sai nếu văn bản hợp nhất thay đổi trước giờ demo | Trung bình | Không hard-code số liệu là "sự thật tuyệt đối" trong bất kỳ tài liệu pitch nào; luôn ghi kèm ngày tra cứu | Technical Writer / LegalTech |
| Ingestion thủ công có thể sai sót do không có kiểm chứng chéo (1 người làm) | Trung bình | Ưu tiên kiểm tra chéo tối thiểu 1 lần trước khi coi dữ liệu là FACT (xem `09_KIEN_TRUC_DU_LIEU.md`) | Đội |

## Nguyên tắc quản trị tri thức (áp dụng cho mọi tài liệu)
- Một nội dung — một nơi lưu (Single Source of Truth). Tài liệu này không lặp chi tiết rủi ro, chỉ tổng hợp để ra quyết định nhanh.
- Mọi số liệu pháp lý trong tài liệu pitch/demo phải trỏ được về `07_KNOWLEDGE_GRAPH.md`.

## Khuyến nghị
~~Xử lý dứt điểm rủi ro "trích dẫn sai điều khoản" trước khi build~~ — **đã xử lý 2026-07-18** bằng cách đối chiếu toàn văn 4 văn bản lõi do chủ dự án cung cấp (`web/lib/Legal/`).

**Bài học rút ra, áp dụng cho 2 module mở rộng:** dữ liệu gắn nhãn "đang xác minh" không chỉ làm giảm độ tin cậy — nó đã **định hướng sai cả kiến trúc lẫn kịch bản demo** (dự án từng thiết kế nguyên một kịch bản demo trọng tâm quanh một rủi ro không tồn tại). Với Project Intelligence và Public Discourse Filter: không bắt đầu xây tầng suy luận trên dữ liệu chưa kiểm chứng nguồn.
