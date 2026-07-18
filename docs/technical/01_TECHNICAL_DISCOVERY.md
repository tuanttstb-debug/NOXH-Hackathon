# 01 — Technical Discovery: Module "Project Intelligence"

> Đọc trong 12 phút. Tài liệu đầu tiên trong bộ `docs/technical/` — Technical Discovery trước triển khai, theo yêu cầu tường minh "KHÔNG viết code ở giai đoạn này". Không sửa `docs/features/PROJECT_INTELLIGENCE.md` (Requirement gốc) — tài liệu này chỉ đọc và challenge.

## 0. Ghi chú phạm vi đọc tài liệu

Yêu cầu gốc liệt kê 6 nguồn: `PROJECT_INTELLIGENCE.md`, `KNOWLEDGE_GRAPH.md`, `AI_ARCHITECTURE.md`, `DATA_PIPELINE.md`, `TECH_STACK.md`, `API_SPEC.md`. Kiểm tra thực tế trong repo cho thấy chỉ 1/6 tồn tại đúng tên file (`docs/features/PROJECT_INTELLIGENCE.md`). 4 file còn lại **không tồn tại như file độc lập** — nhưng nội dung tương ứng đã có dưới tên khác, viết cho module Eligibility Checker (module đã có trước và đã được xác nhận là P0 hiện hành — xem `ai_context/PROJECT_STATE.md`). Mapping dùng trong tài liệu này:

| Tên trong yêu cầu | File thực tế dùng thay | Ghi chú |
|---|---|---|
| `KNOWLEDGE_GRAPH.md` | `docs/07_KNOWLEDGE_GRAPH.md` + `knowledge/ontology/*.md` | Ontology hiện tại thiết kế cho **Legal Knowledge Graph** (VanBan/DieuKhoan), không phải Project Knowledge Graph (Project/Developer/News) mà `PROJECT_INTELLIGENCE.md` mục 8 mô tả. Hai đồ thị có domain khác nhau — xem mục 3.4. |
| `AI_ARCHITECTURE.md` | `docs/06_KIEN_TRUC_AI_AGENT.md` | Mô tả pipeline 4 bước cho Eligibility Agent, không phải AI Synthesis Agent của Project Intelligence. |
| `DATA_PIPELINE.md` | `docs/09_KIEN_TRUC_DU_LIEU.md` | Mô tả luồng ingestion **thủ công** cho văn bản pháp luật — quy mô nhỏ hơn nhiều so với crawl báo chí/dữ liệu dự án mà Project Intelligence cần. |
| `TECH_STACK.md` | *(không tồn tại)* | Chưa có quyết định stack chính thức nào ngoài frontend (`web/package.json`: Next.js 14, không có SDK LLM, không có DB driver nào được cài). |
| `API_SPEC.md` | *(không tồn tại)* | Đúng như `ai_context/PROJECT_STATE.md` ghi nhận: "Backend/API: Không tồn tại". Không có OpenAPI/route nào được định nghĩa ở bất kỳ đâu trong repo. |

**Hệ quả quan trọng nhất cho Technical Discovery**: không có "tài liệu kỹ thuật hiện có" nào để challenge cho riêng Project Intelligence — toàn bộ mục 8–13 của `PROJECT_INTELLIGENCE.md` (BRD) là cấp độ Solution Design tự nó đã đưa ra quyết định kỹ thuật sơ bộ (VD: "PostgreSQL + pgvector", "Neo4j Phase 2"). Nhiệm vụ Technical Discovery này phải **đối chiếu lại** những quyết định sơ bộ đó với ràng buộc thực tế của repo (0% backend, 1–2 người, thời gian hackathon còn lại không rõ chính xác), không mặc định chấp nhận.

## 1. Business Goal

Giúp người dân **ra quyết định** về một dự án NOXH cụ thể (mua/đăng ký) bằng một báo cáo tổng hợp đa nguồn có trích dẫn — thay vì phải tự đi ghép nối thông tin rời rạc từ báo chí, website CĐT, mạng xã hội, văn bản luật. Khác biệt cốt lõi so với Gemini/NotebookLM: có **domain data model** (Knowledge Graph Project–Developer–News–Legal), phân tầng độ tin cậy nguồn, và liên kết dữ liệu dự án với thay đổi chính sách.

## 2. Functional Requirement (tóm tắt từ BRD mục 5)

| ID | Tên | Bắt buộc theo BRD gốc |
|---|---|---|
| FR-01 | Entity Resolution (chuẩn hoá tên dự án → Project ID, xác nhận khi mơ hồ) | Bắt buộc — MVP |
| FR-02 | Project Search (tìm theo tên/địa phương/CĐT/pháp lý) | Bắt buộc — MVP |
| FR-03 | Project Intelligence (tổng quan dự án) | Bắt buộc — MVP |
| FR-04 | Developer Intelligence (lịch sử CĐT, liên kết rủi ro chéo dự án) | Bắt buộc — MVP |
| FR-05 | News Intelligence (tin tức, sentiment, topic) | Bắt buộc — MVP |
| FR-06 | Legal Intelligence (văn bản áp dụng, thay đổi chính sách) | Bắt buộc — MVP |
| FR-07 | Risk Detection (chậm tiến độ/tranh chấp/vi phạm) | Bắt buộc — MVP |
| FR-08 | Suitability Analysis (đối chiếu hồ sơ cá nhân) | MVP rút gọn |
| FR-09 | Citation (mọi claim có nguồn) | Bắt buộc — không thương lượng |
| FR-10 | Follow-up Question (hỏi tiếp giữ ngữ cảnh) | Bắt buộc — MVP |

**Ghi chú**: BRD gốc đánh dấu 9/10 FR là "Bắt buộc — MVP". Đây chính là điều Bước 2 (Challenge Requirement) phải phản biện — 9/10 "bắt buộc" trong một BRD đơn lẻ, chưa đối chiếu với thời gian thực tế, thường là dấu hiệu của "mọi thứ đều quan trọng" — tức là chưa ưu tiên hoá thật.

## 3. Technical Constraint

1. **Không có backend nào tồn tại.** `web/` là Next.js 14 App Router thuần frontend, mock data, không route API, không DB driver trong `package.json`.
2. **Không có LLM provider nào được chọn.** Đây là OPEN QUESTION đang treo từ phiên làm việc trước (chưa trả lời) — áp dụng cho cả Eligibility Checker lẫn Project Intelligence.
3. **Git mới init, 1 commit duy nhất**, chưa có nhánh/quy trình review — mọi thay đổi lớn (thêm DB, thêm service) cần cân nhắc rủi ro rollback.
4. **Dữ liệu Legal Knowledge Graph (mục 0 ở trên) hiện chỉ mới là ontology + 5 file `.md` "đang xác minh"**, chưa nạp vào bất kỳ hệ lưu trữ có cấu trúc nào (không SQL, không graph engine) — module Eligibility Checker cũng đang ở giai đoạn thiết kế, chưa build.
5. **Không có hạ tầng crawl/embedding/vector search nào tồn tại** — mọi thành phần BRD mục 7–9 đề xuất (Scrapy/Playwright, pgvector, Live Search API) đều là **hạ tầng mới hoàn toàn**, không phải mở rộng từ cái đã có.

## 4. Hackathon Constraint

| Ràng buộc | Giá trị | Nguồn |
|---|---|---|
| Quy mô đội | 1–2 người | `docs/02_MUC_TIEU_SAN_PHAM.md` |
| Thời lượng | 48h tổng, mốc giờ chính xác **chưa xác nhận** (OPEN QUESTION treo) | `docs/00_MUC_LUC.md`, `ai_context/TODO_NEXT.md` |
| Ưu tiên đã quyết định trong phiên trước | Module Eligibility Checker (P0 gốc) được ưu tiên hoàn thành trước khi mở rộng sang Project Intelligence — xem `ai_context/SESSION_HANDOVER.md` session gần nhất | Quyết định của chủ dự án, ngày 2026-07-18 |
| Nguyên tắc chống lan phạm vi | "Không mở rộng sang P1/P2 khi P0 chưa chạy đúng" | `docs/14_BACKLOG.md`, lặp lại ở `PROJECT_INTELLIGENCE.md` TODO cuối tài liệu |
| Rủi ro lớn nhất đã ghi nhận trước đó | "Potemkin AI" — tài liệu nhiều, code 0% — `docs/16_DESIGN_REVIEW.md` chấm 15/60 trước khi có dòng code nào | Design Review |

**Hệ quả trực tiếp cho Technical Discovery này**: vì kết quả yêu cầu là tài liệu (không code), bản thân việc thực hiện đúng 12 bước KHÔNG vi phạm quyết định ưu tiên Eligibility Checker trước — đây là hoạt động lập kế hoạch song song, không phải chuyển hướng nguồn lực build. Nhưng khuyến nghị cuối (Bước 12 / `10_TECHNICAL_DECISION.md`) phải nêu rõ: nếu thời gian hackathon thực tế còn hạn chế, Project Intelligence là mở rộng **sau** khi Eligibility Checker P0 chạy đúng, không phải thay thế.

## 5. Không bỏ sót requirement — checklist đối chiếu

- [x] 10 Functional Requirement (FR-01→10) — đã liệt kê mục 2, chi tiết hoá MoSCoW ở `02_SOLUTION_OPTIONS.md` §0.
- [x] 7 Non-Functional Requirement (Performance/Latency/Accuracy/Grounding/Citation/Security/Audit) — mang nguyên sang `03_FINAL_ARCHITECTURE.md` §5 và `09_RISK_ASSESSMENT.md`.
- [x] 3 nhóm nguồn dữ liệu (Structured/Semi-structured/Dynamic) — mang sang `04_DATA_MODEL.md` và Solution Options (News Crawl).
- [x] Knowledge Graph: 10 node type, 14 relationship type (BRD mục 8) — đối chiếu với ontology hiện có (Legal KG) ở `04_DATA_MODEL.md`.
- [x] AI Pipeline 10 giai đoạn (BRD mục 9) — đối chiếu ADR-03 (1 agent, pipeline tuyến tính) đã áp dụng cho Eligibility Checker ở `05_AI_PIPELINE.md`.
- [x] Report structure 11 mục (BRD mục 10) — không thay đổi, tham chiếu nguyên trong `06_API_DESIGN.md` (response schema).
- [x] AI Safety — 4 tầng nguồn, Hard Rule "không citation = không đưa vào report" (BRD mục 11) — mang nguyên vào `09_RISK_ASSESSMENT.md`, đây là quy tắc không thương lượng, không challenge.
- [x] 7 risk đã liệt kê trong BRD (mục "Tổng hợp Risk") — hợp nhất với risk từ `docs/12_QUAN_LY_RUI_RO.md` (Legal KG) ở `09_RISK_ASSESSMENT.md`, tránh trùng lặp.
- [x] 11 TODO triển khai BRD gốc — đối chiếu 1-1 với Implementation Plan (`07_IMPLEMENTATION_PLAN.md`) và WBS (`08_WBS.md`).

## OPEN QUESTION mang sang từ BRD gốc (chưa trả lời, không tự suy diễn)

1. LLM provider cụ thể — treo từ phiên trước, ảnh hưởng cả 2 module.
2. Mốc giờ 48h chính xác + rubric chấm điểm.
3. Ngân sách Live Search API (nếu triển khai FR liên quan) — BRD tự nêu risk "chi phí Live Search tăng không kiểm soát" nhưng chưa có số ngân sách cụ thể.
4. Có nguồn dữ liệu ~20 dự án NOXH demo thật chưa, hay cần đội tự thu thập trong quỹ thời gian hackathon (ảnh hưởng trực tiếp Phase 1 của Implementation Plan)?
