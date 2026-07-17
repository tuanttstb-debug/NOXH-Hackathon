# 13 — Quyết định kiến trúc (ADR)

> Đọc trong 7 phút. Mỗi quyết định ghi theo format Bối cảnh — Quyết định — Đánh đổi — Trạng thái. Trạng thái "Đề xuất" nghĩa là cần chủ dự án xác nhận trước khi build.

## ADR-01: Grounding trước, Generation sau
- **Bối cảnh**: Rủi ro lớn nhất là AI trích dẫn sai/bịa luật (`12_QUAN_LY_RUI_RO.md`).
- **Quyết định**: Agent bắt buộc truy vấn Knowledge Graph trước khi sinh câu trả lời; không cho phép LLM trả lời pháp lý từ tri thức nội tại.
- **Đánh đổi**: Chậm hơn một chút so với để LLM trả lời tự do, nhưng đổi lấy độ tin cậy — chấp nhận được vì mục tiêu demo là "đúng và giải thích được" (`02_MUC_TIEU_SAN_PHAM.md`).
- **Trạng thái**: Đề xuất, khuyến nghị áp dụng bắt buộc.

## ADR-02: Lưu trữ Knowledge Graph đơn giản (không dùng Graph DB đầy đủ ở bản demo)
- **Bối cảnh**: Đội 1–2 người, 48h. Triển khai Graph DB (VD: Neo4j) đầy đủ tốn thời gian vận hành không cần thiết ở quy mô demo.
- **Quyết định**: Dùng cấu trúc dữ liệu đơn giản (dạng bảng/tài liệu có quan hệ tường minh) đủ để biểu diễn các loại thực thể/quan hệ ở `07_KNOWLEDGE_GRAPH.md`, không cần engine đồ thị chuyên dụng cho bản demo.
- **Đánh đổi**: Không thể hiện được sức mạnh truy vấn đồ thị phức tạp ở demo — cần nêu rõ với giám khảo đây là lựa chọn có chủ đích cho 48h, kiến trúc dữ liệu (`07`, `08`, `09`) đã thiết kế để nâng cấp lên Graph DB thật ở Giai đoạn 2 (`10_LO_TRINH_TRIEN_KHAI.md`) mà không đổi mô hình khái niệm.
- **Trạng thái**: Đề xuất.

## ADR-03: Một Agent, một pipeline tuyến tính (không dùng kiến trúc multi-agent)
- **Bối cảnh**: Multi-agent giúp mở rộng nhưng khó debug trong thời gian ngắn với 1–2 người.
- **Quyết định**: Một Agent duy nhất với pipeline 4 bước rõ ràng (`06_KIEN_TRUC_AI_AGENT.md`), không phân chia nhiều agent chuyên biệt.
- **Đánh đổi**: Kém linh hoạt hơn khi mở rộng nghiệp vụ (đa đối tượng, đa loại câu hỏi) — chấp nhận được vì demo chỉ có 1 use case (`14_BACKLOG.md`).
- **Trạng thái**: Đề xuất.

## ADR-04: Ingestion thủ công có kiểm chứng, không tự động hoá (OCR/crawl) ở bản demo
- **Bối cảnh**: Tự động hoá trích xuất văn bản luật (OCR, parser) có rủi ro sai sót cao hơn nhập thủ công có người kiểm tra, và tốn thời gian xây dựng không cần thiết cho 48h.
- **Quyết định**: Nhập dữ liệu pháp lý thủ công, bắt buộc gắn nguồn + ngày hiệu lực cho từng bản ghi (`09_KIEN_TRUC_DU_LIEU.md`).
- **Đánh đổi**: Không mở rộng được nhanh khi có nhiều văn bản — chấp nhận được vì phạm vi demo đã giới hạn số lượng văn bản (`07_KNOWLEDGE_GRAPH.md`).
- **Trạng thái**: Đề xuất.

## Nguyên tắc chung cho công nghệ cụ thể (ngôn ngữ, framework, LLM provider)
Không ràng buộc từ BTC — đội tự chọn theo tiêu chí: (1) đội đã quen thuộc để tối ưu tốc độ build trong 48h, (2) hỗ trợ tốt việc gọi LLM có kiểm soát prompt/grounding, (3) không cần hạ tầng phức tạp để triển khai demo. Quyết định công cụ cụ thể để đội tự chốt khi bắt tay build — tài liệu này không áp đặt một stack cụ thể vì không ảnh hưởng đến tính đúng đắn của kiến trúc.
