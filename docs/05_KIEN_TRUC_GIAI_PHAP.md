# 05 — Kiến trúc giải pháp (Solution Architecture)

> Đọc trong 8 phút. Kiến trúc khái niệm (logical) — chưa chọn công nghệ cụ thể. Lựa chọn công nghệ nằm ở `13_QUYET_DINH_KIEN_TRUC.md` (ADR).

## Nguyên tắc thiết kế
1. **Grounding trước, Generation sau**: AI Agent không được tự sinh câu trả lời pháp lý nếu chưa truy vấn được căn cứ từ Knowledge Graph. Đây là cách duy nhất đảm bảo Citation First không phải khẩu hiệu.
2. **Tách bạch "nguồn sự thật" khỏi "khả năng diễn giải ngôn ngữ"**: Knowledge Graph giữ vai trò nguồn sự thật (source of truth) về điều khoản/hiệu lực; mô hình ngôn ngữ (LLM) chỉ đảm nhiệm việc hiểu câu hỏi và diễn giải kết quả sang ngôn ngữ tự nhiên — không tự quyết định nội dung pháp lý.
3. **Fact-Check là một bước bắt buộc, không phải tuỳ chọn**: mọi output trước khi trả về người dùng phải được đối chiếu lại với Knowledge Graph.
4. **Đơn giản nhất có thể chứng minh được 3 nguyên tắc trên** — phù hợp ràng buộc 1–2 người/48h (xem `02_MUC_TIEU_SAN_PHAM.md`), không cần hạ tầng production-grade.

## Các khối chức năng (logical components)
| Khối | Vai trò | Đầu vào | Đầu ra |
|---|---|---|---|
| **Legal Ingestion** | Nạp & chuẩn hoá văn bản pháp luật, gắn phiên bản/ngày hiệu lực | Văn bản gốc (Luật, Nghị định) | Dữ liệu có cấu trúc cho Knowledge Graph |
| **Knowledge Graph Store** | Lưu thực thể & quan hệ pháp lý, biết điều khoản nào đang/đã hết hiệu lực | Dữ liệu từ Ingestion | Kết quả truy vấn theo thực thể/quan hệ |
| **AI Agent (Reasoning)** | Hiểu câu hỏi người dùng, truy vấn Knowledge Graph, suy luận, sinh giải thích | Hồ sơ người dùng (form input) | Kết luận nháp + trích dẫn nháp |
| **Fact-Check Layer** | Đối chiếu kết luận của Agent với Knowledge Graph trước khi trả lời | Kết luận nháp | Kết luận đã xác minh hoặc trạng thái "Thiếu thông tin" |
| **Presentation (Demo)** | Hiển thị kết quả, lý do, trích dẫn cho người dùng | Kết luận đã xác minh | Giao diện demo (thiết kế chi tiết không thuộc tài liệu này) |

## Luồng xử lý chính (mô tả nghiệp vụ, không phải luồng kỹ thuật)
Người dùng nhập hồ sơ → AI Agent xác định các quy tắc nghiệp vụ liên quan → truy vấn Knowledge Graph lấy điều khoản đang hiệu lực → Agent soạn kết luận nháp kèm trích dẫn → Fact-Check Layer đối chiếu lại từng trích dẫn với Knowledge Graph → nếu khớp, trả kết quả; nếu không khớp hoặc thiếu dữ liệu, trả trạng thái "Thiếu thông tin".

## Ràng buộc kiến trúc
- Không ràng buộc công nghệ từ BTC (xem `02_scope...` cũ / nay thuộc `10_LO_TRINH_TRIEN_KHAI.md`).
- Đội 1–2 người, 48h → ưu tiên số lượng khối chức năng tối thiểu, không tách microservice nếu không cần thiết cho việc chứng minh nguyên tắc.

## Liên kết
- Chi tiết AI Agent: `06_KIEN_TRUC_AI_AGENT.md`
- Chi tiết Knowledge Graph: `07_KNOWLEDGE_GRAPH.md`
- Chi tiết luồng dữ liệu: `09_KIEN_TRUC_DU_LIEU.md`
