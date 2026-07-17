# SESSION_HANDOVER — NOXH Copilot

> Nhật ký từng phiên làm việc, **mới nhất ở trên cùng**. Đọc file này đầu tiên khi bắt đầu phiên mới, sau đó mới đọc `PROJECT_STATE.md` (trạng thái hiện tại) và `TODO_NEXT.md` (việc cần làm tiếp). File này KHÔNG thay thế `../docs/00_PROJECT_MEMORY.md` (neo trí nhớ nghiệp vụ/kiến trúc) — hai file bổ sung cho nhau: `00_PROJECT_MEMORY.md` trả lời "dự án là gì, đã quyết định gì", file này trả lời "phiên trước đã làm gì, dừng ở đâu".

## Session 2 — 2026-07-17 (thiết lập ai_context)
**Làm gì:** Khảo sát toàn bộ trạng thái dự án (docs/, knowledge/, web/, EVD/) và khởi tạo thư mục `ai_context/` với 4 file chuẩn (`SESSION_HANDOVER.md`, `PROJECT_STATE.md`, `TODO_NEXT.md`, `TECH_DEBT.md`) theo chuẩn handover đang dùng ở các dự án khác của người dùng — mục đích: AI vào phiên mới nắm trạng thái nhanh mà không phải đọc lại toàn bộ ~40 file `docs/`+`knowledge/`.

**Phát hiện khi khảo sát (không phải việc mới làm trong phiên này):**
- `web/` đã có 3/10 màn hình dựng thật bằng Next.js 14 (Landing, AI Workspace, Eligibility Checker), toàn bộ dữ liệu mock, **chưa có bất kỳ lệnh gọi LLM/AI thật nào** — xem `TECH_DEBT.md`.
- 20 ảnh evidence trong `EVD/` (01–20) chụp đủ các trạng thái UI: Landing (4 ảnh), Eligibility Checker (9 ảnh — cả 3 verdict Đủ/Không đủ/Thiếu thông tin), AI Workspace (7 ảnh — tabs Reasoning/Citations/Graph, sidebar collapsed).
- Không có git repository ở thư mục gốc dự án (`git status` báo "not a git repository").
- `web/README.md` tự ghi chú: ESLint đã cấu hình nhưng chưa từng chạy `npm run lint` trong phiên phát triển.
- `docs/16_DESIGN_REVIEW.md` (review trước khi có code) chấm 15/60, kết luận "dừng viết tài liệu, bắt đầu build" — phiên build UI (không rõ session nào, không có git log để tra) đã thực hiện đúng khuyến nghị này cho 3 màn hình P0 nhưng phần AI Agent thật (pipeline 4 bước) vẫn chưa có dòng nào chạy.

**Dừng ở đâu:** Chưa thực hiện thay đổi code/docs nào ngoài việc tạo `ai_context/`. Chưa trả lời được `git init` có nên làm không (chưa hỏi người dùng).

**Việc tiếp theo:** Xem `TODO_NEXT.md`.

---

## Session 1 — 2026-07-17 (khởi tạo dự án, ước tính từ nội dung tài liệu)
> Suy ra từ nội dung `docs/00_PROJECT_MEMORY.md` và mtime file — không có git log để xác nhận chính xác ranh giới phiên.

**Làm gì:**
1. Viết bộ tài liệu nghiệp vụ/kiến trúc `docs/` (16 file, 00–16) và `knowledge/` (24 file: `phap_ly/`, `ontology/`, `agents/`, `prompts/`, `evaluation/`, `datasets/`) — toàn bộ bằng tiếng Việt, quy ước FACT/ASSUMPTION/DECISION/TODO/RISK/OPEN QUESTION.
2. Phân tích 1 tài liệu UI tham khảo (TPBank BIZ) do người dùng cung cấp, quyết định **không** kế thừa mental model điều hướng của nó (navigation-first) vì ngược nguyên tắc AI-first.
3. Thiết kế UI/UX qua 2 vòng: vòng 1 (`docs/UI/01`–`09`) theo mô hình Screen-based 7 màn hình; vòng 2 phản biện chính mình (đóng vai Design Director Microsoft Copilot, `docs/UI/10_AI_NATIVE_UX_REVIEW.md`) → redesign sang Thread-based (`docs/UI/11_AI_NATIVE_REDESIGN.md`), thêm 3 component AI-Native: Mini Knowledge Graph Trace, Legal Timeline Chip, Threshold Comparison Bar.
4. Thực hiện Design Review toàn diện (`docs/16_DESIGN_REVIEW.md`) — chấm điểm 6 tiêu chí (15/60 hiện tại, 41/60 tối đa khả thi), challenge session đóng vai 5 bên (Ban giám khảo/Microsoft/Google/Anthropic/McKinsey), kết luận: dừng viết doc, bắt đầu build.
5. Dựng code Next.js 14 + Tailwind cho 3 màn hình P0 (Landing, AI Workspace, Eligibility Checker), dùng mock data, chụp 20 ảnh evidence.

**Quyết định quan trọng của phiên:**
- Kiến trúc: Grounding trước Generation, 1 agent pipeline tuyến tính (không multi-agent), lưu trữ Knowledge Graph dạng cấu trúc đơn giản (không Graph DB), ingestion thủ công có kiểm chứng — tất cả ở trạng thái **"Đề xuất"**, chưa có code hiện thực hoá (`docs/13_QUYET_DINH_KIEN_TRUC.md`).
- Design System: đổi từ đề xuất ban đầu sang Indigo/Slate, dark mode mặc định — lý do ghi trong `docs/UI/07_DESIGN_SYSTEM.md`.
- Font Inter dùng qua system font-stack (không qua `next/font/google`) để build không phụ thuộc mạng.

**Dừng ở đâu:** 3/10 màn hình dựng xong, build (`next build`) và dev (`next dev`) chạy được, nhưng 0% pipeline AI thật, 0 lần rehearsal demo, 8 OPEN QUESTION nghiệp vụ chưa trả lời (xem `docs/00_MUC_LUC.md` mục "Cần bạn xác nhận sớm nhất").

## Khi bắt đầu phiên làm việc mới
1. Đọc file này (session gần nhất) → `PROJECT_STATE.md` → `TODO_NEXT.md`.
2. Nếu cần chi tiết nghiệp vụ/kiến trúc: `../docs/00_PROJECT_MEMORY.md` → `../docs/00_MUC_LUC.md`.
3. Nếu cần chi tiết build: `../knowledge/README.md`.
4. Hỏi người dùng nếu có OPEN QUESTION nào vừa được trả lời — không tự suy diễn.
5. Sau khi hoàn thành việc trong phiên, thêm 1 mục "Session N" mới lên đầu file này (không sửa các session cũ), cập nhật `PROJECT_STATE.md` và `TODO_NEXT.md` tương ứng.
