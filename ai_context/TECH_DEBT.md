# TECH_DEBT — NOXH Copilot

> Nợ kỹ thuật đã biết, ghi nhận có chủ đích để không lặp lại phát hiện ở mỗi phiên. Không phải TODO (xem `TODO_NEXT.md` cho thứ tự ưu tiên xử lý) — file này chỉ liệt kê VẤN ĐỀ và bối cảnh. Cập nhật gần nhất: **2026-07-17**.

## Nghiêm trọng — ảnh hưởng trực tiếp uy tín demo

### 1. Không có lệnh gọi LLM/AI thật nào trong toàn bộ codebase
Toàn bộ nhãn "AI Agent", "AI Workspace", "Reasoning Trace" trong `web/` hiện là mock data tĩnh (`web/mock/`) + hiệu ứng typing giả lập (`hooks/use-typing-effect.ts`) mô phỏng việc AI đang "suy nghĩ". `../docs/16_DESIGN_REVIEW.md` tự gọi đây là rủi ro **"Potemkin AI"** — nếu giám khảo hỏi "cho tôi xem 4 agent chạy độc lập ở đâu", chưa có câu trả lời trung thực nào khác ngoài "chưa có, chỉ có tài liệu mô tả".
**Vì sao chưa xử lý:** Tài liệu kiến trúc (`docs/05`–`09`, `knowledge/agents/`, `knowledge/prompts/`) hoàn chỉnh về mặt mô tả nhưng dự án ưu tiên dựng UI trước để có gì đó "chạy được" trên màn hình, đúng khuyến nghị của chính Design Review — nhưng khuyến nghị đó ưu tiên **cả hai** (UI + luồng AI thô), phần AI thô chưa được thực hiện.

### 2. Không có git repository
Thư mục gốc dự án (`D:\Workspace\NOXH Hackathon`) không phải git repo — không có lịch sử commit, không thể rollback nếu một thay đổi làm hỏng bản demo đang chạy được. Rủi ro tăng dần khi càng gần giờ demo.
**Vì sao chưa xử lý:** Chưa được yêu cầu; cần hỏi người dùng trước khi `git init` (tránh giả định phạm vi ngoài yêu cầu).

### 3. Knowledge Graph không phải cấu trúc dữ liệu truy vấn được
`knowledge/phap_ly/*.md` là văn bản Markdown mô tả, không phải schema/DB có thể query bằng code. ADR-02 (`../docs/13_QUYET_DINH_KIEN_TRUC.md`) chấp nhận điều này có chủ đích cho quy mô demo 48h ("không cần Graph DB đầy đủ") — nhưng tính đến thời điểm này, kể cả "cấu trúc đơn giản dạng bảng" mà ADR-02 mô tả cũng **chưa được hiện thực hoá**, chỉ có Markdown thuần.
**Đánh đổi đã chấp nhận:** Không thể hiện được graph traversal thật ở demo — cần nói rõ với giám khảo đây là lựa chọn có chủ đích, không phải thiếu sót (theo đúng tinh thần ADR-02).

## Trung bình — ảnh hưởng chất lượng, chưa chặn demo

### 4. Dữ liệu pháp lý chưa xác minh nguồn gốc
5 văn bản trong `knowledge/phap_ly/` đều gắn `do_tin_cay = "đang xác minh"` (`knowledge/ontology/metadata.md`) — lấy từ nguồn thứ cấp, chưa đối chiếu Công báo/văn bản gốc. Rủi ro cụ thể nhất: NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 NĐ 100/2024/NĐ-CP nhưng khác khía cạnh — nếu build Eligibility Checker trên dữ liệu này mà không cảnh báo, có thể trích dẫn điều khoản đã hết hiệu lực.
**Đánh đổi:** `../docs/16_DESIGN_REVIEW.md` khuyến nghị chấp nhận dữ liệu "đang xác minh" để build thử thay vì chờ hoàn hảo — debt này được giữ nguyên có chủ đích để không chặn tiến độ code.

### 5. Fact-check dùng AI kiểm tra AI cho 1/3 phép kiểm
`knowledge/agents/fact_check.md` tự thừa nhận 2/3 phép kiểm tra nên là code thuần, nhưng phép kiểm thứ 3 (khớp logic) vẫn thiết kế dùng LLM — nghĩa là không phải kiểm chứng độc lập thật sự, lỗi hệ thống có thể lặp lại ở cả 2 bước mà không bị bắt. Đây là spec, chưa có code nên chưa "hiện thực" thành nợ kỹ thuật thật, nhưng cần lưu ý khi build P0 #1 (`TODO_NEXT.md`) để không copy nguyên spec có lỗ hổng này.

### 6. Chưa từng chạy ESLint
`web/README.md` tự ghi chú: ESLint đã cấu hình (`eslint-config-next`) nhưng chưa chạy `npm run lint` trong toàn bộ phiên phát triển. Có thể có lỗi style/type ẩn chưa phát hiện dù `next build` báo thành công.

### 7. Không có test tự động
Không tìm thấy file test/verify nào trong `web/` hay project root (khác với các dự án khác của người dùng thường có `verify_*.mjs`). Có 2 script hỗ trợ chụp ảnh (`web/screenshot.mjs`, `web/screenshot-landing.mjs`, `web/debug-opacity.mjs`) nhưng đây là công cụ chụp evidence, không phải test có assertion.

## Thấp — ghi nhận, không cần xử lý gấp

### 8. Không có quản lý secret/API key
Chưa có `.env.example` hay tài liệu nào mô tả cách truyền API key LLM khi P0 #1/#2 (`TODO_NEXT.md`) được triển khai. Cần thiết lập trước khi nối API thật, tránh hard-code key vào code (rủi ro bảo mật nếu sau này đẩy lên git công khai).

### 9. Font qua system stack thay vì `next/font/google`
Quyết định có chủ đích (build không phụ thuộc mạng) — không phải nợ cần xử lý, ghi lại để không ai "fix" nhầm thành lỗi trong phiên sau. Xem chú thích trong `web/app/layout.tsx`.
