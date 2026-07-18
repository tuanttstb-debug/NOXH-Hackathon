# 10 — Technical Decision: Khuyến nghị cuối cùng (kịch bản còn 12h trước Demo)

> Đọc trong 6 phút. Bước 12. Đây là tài liệu duy nhất trong bộ `docs/technical/` đưa ra khuyến nghị hành động trực tiếp — 9 tài liệu trước là phân tích/thiết kế.

## 0. Điều kiện tiên quyết — phải trả lời trước khi đọc phần còn lại

**Eligibility Checker P0 (`ai_context/TODO_NEXT.md`) đã chạy đúng end-to-end chưa?**

| Nếu... | Khuyến nghị |
|---|---|
| **CHƯA xong** | **Không bắt đầu Project Intelligence trong 12h còn lại.** Dồn toàn bộ 12h cho Eligibility Checker P0. Lý do: (1) đây là quyết định đã chốt ở phiên làm việc trước ("Original P0", ngày 2026-07-18); (2) Legal Intelligence — phần khác biệt giá trị cao nhất của Project Intelligence — phụ thuộc cứng vào Legal KG của Eligibility Checker (`07_IMPLEMENTATION_PLAN.md` Phase 3); (3) theo Design Review, 1 module hoàn chỉnh luôn ăn điểm Demo tốt hơn 2 module dở dang (`docs/16_DESIGN_REVIEW.md` tiêu chí Demo). |
| **ĐÃ xong**, LLM provider đã chọn, có Legal KG chạy được | Áp dụng khuyến nghị chi tiết ở mục 1–4 bên dưới |

Phần còn lại của tài liệu giả định kịch bản thứ hai.

## 1. Chắc chắn phải làm (Must-do trong 12h)

| # | Việc | Vì sao không thể cắt |
|---|---|---|
| 1 | Dataset tối thiểu **2–3 dự án** (không phải 20 như BRD gốc) có nguồn thật, đã kiểm chứng | Không có dữ liệu thật thì không có gì để demo — nhưng 20 dự án là quy mô cho News Intelligence đầy đủ (Epic 2 `08_WBS.md`), không phải điều kiện tối thiểu để chứng minh khái niệm |
| 2 | Entity Resolution rút gọn tối đa: **exact match + alias list tay** cho đúng 2-3 dự án đó (không cần fuzzy matching) | Đủ để demo, và với 2-3 dự án đã biết trước, fuzzy match không còn cần thiết — đây là điều chỉnh **ngược lại** quyết định B1-B ở `03_FINAL_ARCHITECTURE.md` khi áp lực thời gian xuống dưới 12h, ghi rõ để không hiểu nhầm là mâu thuẫn |
| 3 | Reasoning + Citation Binding cho khối **Tổng quan + Pháp lý** (gộp Phase 1+3) | Đây là 2 khối chứng minh cả "AI thật" (LLM call có Citation) lẫn "khác biệt với Gemini" (liên kết Legal KG) — giá trị/chi phí cao nhất trong toàn bộ FR |
| 4 | 1 kịch bản demo chạy mượt đầu-cuối cho 1 dự án | Tương đương yêu cầu tối thiểu Definition of Done đã áp dụng cho Eligibility Checker (`docs/14_BACKLOG.md`) — 1 kịch bản đúng còn hơn 3 kịch bản lỗi |
| 5 | Disclaimer AI Safety bắt buộc trong report | Chi phí gần 0 (1 field trong prompt + UI), rủi ro nếu bỏ là cao nhất trong `09_RISK_ASSESSMENT.md` (real-world harm) |

## 2. Có thể mock

| # | Việc | Cách mock chấp nhận được |
|---|---|---|
| 1 | Developer profile | `note` viết tay 1-2 câu, không cần thu thập lịch sử đầy đủ |
| 2 | News/Trust Layer | 2-3 tin **có thật** (không bịa), gắn nhãn tay trực tiếp thay vì chạy qua LLM ingest — bỏ bước "LLM gắn nhãn tự động" của Epic 2, giữ nguyên yêu cầu dữ liệu phải thật |
| 3 | Risk Detection | Bỏ qua nếu không có tin tức nào thật sự mang tín hiệu rủi ro trong 2-3 dự án đã chọn — **không tự tạo rủi ro giả** để có nội dung |
| 4 | Suitability Analysis (FR-08) | Link tĩnh sang trang Eligibility Checker, không tích hợp API thật |

## 3. Nên bỏ hoàn toàn (không làm, không mock)

| # | Việc | Lý do |
|---|---|---|
| 1 | Live Search (Phase 5) | Đã khuyến nghị bỏ từ `03_FINAL_ARCHITECTURE.md` ngay cả ở kịch bản đủ thời gian — rủi ro cao nhất, giá trị demo thấp nhất trên mỗi giờ đầu tư |
| 2 | Follow-up Question (FR-10) | Giá trị tăng thêm thấp so với 1 lượt Q&A đã có trong report; cắt an toàn ở 12h |
| 3 | Project Search filter nâng cao (địa phương/CĐT/pháp lý) | Ô tìm theo tên/alias là đủ cho 2-3 dự án demo |
| 4 | Community discussion (mục 7 report) | Đã thiết kế trả `null` tường minh — giữ nguyên `null`, không cố lấp đầy |

## 4. Tăng điểm Hackathon nhiều nhất (ưu tiên nếu còn dư thời gian sau Must-do)

Xếp theo tỷ lệ điểm/giờ đầu tư, dựa trên các tiêu chí Design Review đã chấm tiềm năng cao nhất (`docs/16_DESIGN_REVIEW.md`: AI-Native 8/10, Safety 8/10):

1. **Citation Binding chạy đúng, có thể demo trực tiếp 1 case bị từ chối vì thiếu nguồn** — chứng minh Grounding thật, không phải khẩu hiệu. Đây là bằng chứng mạnh nhất nếu giám khảo hỏi khó, tương tự kịch bản "Thiếu thông tin" đã là điểm nhấn của Eligibility Checker (`docs/11_KICH_BAN_DEMO.md`).
2. **Liên kết Project ↔ Legal KG thật** (GOVERNED_BY) — đây là điểm khác biệt duy nhất so với Gemini/NotebookLM mà BRD tự nhận định (`docs/features/PROJECT_INTELLIGENCE.md` mục 3.3), và rẻ để làm nếu Eligibility Checker đã xong (2-4h theo `07_IMPLEMENTATION_PLAN.md` Phase 3).
3. **Minh bạch chủ động về kiến trúc thật** khi trình bày: nói rõ "đây là 1 pipeline với 1 lệnh gọi LLM, không phải 3 agent độc lập" (`03_FINAL_ARCHITECTURE.md` §7) — chủ động thừa nhận giới hạn ghi điểm uy tín cao hơn để giám khảo tự phát hiện, đúng bài học đã rút ra từ Design Review về rủi ro "Potemkin AI".
4. **Phân tầng nguồn 4 loại hiển thị rõ trong UI** — chi phí thấp (1 field `source_tier` + style khác nhau), điểm Safety cao.

## 5. Tóm tắt 1 dòng

Nếu chỉ còn 12h: **1 dự án, chạy thật, có Citation thật, liên kết Legal KG thật, nói thật về kiến trúc** — tốt hơn nhiều so với 20 dự án, nhiều tính năng, nhưng không chịu được câu hỏi thứ hai của giám khảo.
