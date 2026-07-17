# 01 — Tổng quan dự án: NOXH Copilot

> Đọc trong 5 phút.

## Vấn đề
Chính sách Nhà ở xã hội (NOXH) bị sửa đổi liên tục — 4 lần trong ~20 tháng (2024–2026). Người dân, doanh nghiệp và cả cán bộ thụ lý hồ sơ khó theo kịp điều khoản nào còn hiệu lực. Hệ quả: nộp sai hồ sơ, tư vấn sai, tranh chấp, mất thời gian của cả người dân lẫn cơ quan quản lý.

## Giải pháp
**NOXH Copilot** — nền tảng AI Legal Intelligence, không phải chatbot hỏi-đáp thông thường. Ba năng lực cốt lõi:
1. **Knowledge Graph** hoá toàn bộ quy định NOXH — biết điều khoản nào đang hiệu lực, điều khoản nào đã bị thay thế.
2. **AI Agent có reasoning + citation** — mọi kết luận đều trích dẫn đúng điều/khoản/văn bản, giải thích được vì sao (Explainable AI), không "bịa luật".
3. **Eligibility Checker** — người dân nhập thông tin cá nhân, nhận kết quả đủ/không đủ điều kiện kèm căn cứ pháp lý cụ thể.

## Vì sao khác biệt
Các sản phẩm tra cứu luật hiện có thường là công cụ tìm kiếm văn bản hoặc chatbot trả lời chung chung, không đảm bảo chính xác theo thời điểm hiệu lực. NOXH Copilot đặt **Citation First — Fact Check** làm nguyên tắc thiết kế, không phải tính năng thêm vào sau.

## Giá trị cốt lõi
Knowledge Graph · AI Agent · Legal Reasoning · Fact Check · Eligibility Checker · Citation First · Explainable AI.

## Phạm vi 48h Hackathon
Ưu tiên chiều sâu hơn chiều rộng — một luồng demo (Eligibility Checker cho người dân) chạy đúng, có reasoning và citation thật, thay vì nhiều tính năng hời hợt. Chi tiết mục tiêu đo lường: `02_MUC_TIEU_SAN_PHAM.md`. Chi tiết phạm vi trong/ngoài: `14_BACKLOG.md`.

## FACT
- Bối cảnh pháp lý chi tiết (danh mục văn bản, ngày hiệu lực): `07_KNOWLEDGE_GRAPH.md`.
- Đối tượng người dùng ưu tiên: người dân — chi tiết persona: `04_DOI_TUONG_NGUOI_DUNG.md`.

## OPEN QUESTION
Xem mục "Cần xác nhận" trong `00_MUC_LUC.md` — không lặp lại ở đây để tránh trùng nguồn.
