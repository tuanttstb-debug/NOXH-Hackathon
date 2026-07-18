# 08 — Work Breakdown Structure

> Đọc trong 10 phút. Bước 10. Epic = Phase (từ `07_IMPLEMENTATION_PLAN.md`). Owner dùng theo **vai trò chức năng**, không phải đầu người — đội 1–2 người sẽ luân phiên đảm nhiệm nhiều vai trò, đúng thực tế đã ghi ở `docs/02_MUC_TIEU_SAN_PHAM.md`.

Ký hiệu Owner: **PO** (Product/quyết định phạm vi) · **Data** (thu thập/gắn nhãn dữ liệu) · **BE** (backend/pipeline) · **FE** (frontend/UI) · **AI** (prompt/LLM integration).

## Epic 1: Xem hồ sơ 1 dự án (Project Snapshot)

| Feature | Task | Subtask | Owner | Estimate | Priority | Dependency |
|---|---|---|---|---|---|---|
| Data nền | Thu thập danh mục dự án demo | Chọn ≥5-20 dự án NOXH có nguồn kiểm chứng được | Data | 2–4h | Must | OPEN QUESTION #4 (`01_TECHNICAL_DISCOVERY.md`) đã trả lời |
| | | Điền `project.ts`: name, aliases, address, developer_id, legal_status, source | Data | 1–2h | Must | Trên |
| | | Điền `developers.ts` tối thiểu (legal_name, project_ids) | Data | 1h | Must | Trên |
| Entity Resolution | Cài thuật toán fuzzy match | Chọn thư viện string-similarity, viết `aliasIndex` | BE | 1–2h | Must | `project.ts` có dữ liệu |
| | | Test thủ công 5 case gõ mơ hồ (kiểu "Ecohome") | BE | 30m | Must | Trên |
| | Xử lý xác nhận đa lựa chọn | UI hiển thị danh sách ứng viên khi ambiguous | FE | 1–2h | Should | API `resolve` trả `status: ambiguous` |
| Retrieval + Reasoning | Chọn & tích hợp LLM provider | Chốt provider, cấu hình API key qua env var | AI | 1–2h | Must | **OPEN QUESTION đang treo — blocker cứng** |
| | Viết prompt Synthesis (mục Tổng quan + Pháp lý sơ bộ) | Structured output theo schema `06_API_DESIGN.md` §3.1 | AI | 2–3h | Must | Provider đã chọn |
| | Citation Binding | Đối chiếu claim ↔ nguồn, loại claim thiếu nguồn | BE | 1–2h | Must | Prompt trả structured output đúng schema |
| API + Cache | Route `search`, `resolve`, `report/{id}` | Implement theo `06_API_DESIGN.md` | BE | 2–3h | Must | Entity Resolution + Reasoning xong |
| | In-memory cache theo `project_id` | Map + `X-Cache` header | BE | 30m | Should | Route report đã chạy |
| UI | Trang tìm kiếm + hiển thị report cơ bản | Tái dùng layout `web/features/eligibility` nếu phù hợp | FE | 3–4h | Must | API report trả đúng schema |

## Epic 2: Đáng tin cậy (Trust Layer)

| Feature | Task | Subtask | Owner | Estimate | Priority | Dependency |
|---|---|---|---|---|---|---|
| Crawl & gắn nhãn News | Chọn 3-5 bài báo/dự án | Ưu tiên nguồn uy tín (báo lớn, cổng thông tin CĐT) | Data | 3–5h | Must | Epic 1 có danh mục dự án |
| | LLM gắn nhãn 1 lần (topic/sentiment/risk_type) | Chạy script ingest 1 lần, không real-time | AI | 1–2h | Should | Bài báo đã thu thập |
| | Người kiểm duyệt review nhãn | Sửa tay nếu LLM gắn sai | Data | 2–3h | Must | Trên |
| Developer profile | Điền `Developer.note` (uy tín/rủi ro tóm tắt tay) | Cho 2-3 CĐT có trong dataset demo | Data | 1h | Should | Danh mục CĐT đã có |
| Retrieval | `newsByProject`, `newsByProjectAndTopic` map | Dựng lúc khởi động server | BE | 1h | Must | News đã có trong `news.ts` |
| Reasoning | Mở rộng prompt Synthesis: mục CĐT + Tin tích cực/Tin cần lưu ý | Thêm nhãn tầng nguồn bắt buộc (AI Safety §11) | AI | 2h | Must | News đã gắn nhãn |
| UI | Hiển thị phân tầng nguồn rõ ràng (4 nhãn) | Không gộp chung định dạng — đúng BRD §11.2 | FE | 2–3h | Must | Reasoning trả đúng `source_tier` |

## Epic 3: Gắn kết pháp lý (Legal Intelligence)

| Feature | Task | Subtask | Owner | Estimate | Priority | Dependency |
|---|---|---|---|---|---|---|
| Cầu nối Legal KG | Thêm `Project.applicable_legal_doc_ids` | Join thủ công dựa trên loại hình NOXH của dự án | Data | 1h | Must | **Eligibility Checker P0 (Legal KG) đã chạy đúng** |
| | Lọc `trang_thai_hieu_luc = đang hiệu lực` khi join | Áp dụng đúng quy tắc chống chồng lấp (`04_DATA_MODEL.md` §3) | BE | 1h | Must | Trên |
| Reasoning | Mở rộng prompt: mục Pháp lý đầy đủ + "thay đổi pháp lý liên quan" | Tái dùng nguyên tắc Grounding của `legal_reasoner` (Eligibility Checker) | AI | 1–2h | Must | Cầu nối đã có dữ liệu |
| UI | Hiển thị trích dẫn Điều/Khoản/Văn bản/ngày hiệu lực | Tái dùng component đã có ở Eligibility Checker nếu có | FE | 1–2h | Should | Reasoning trả đúng citation pháp lý |

## Epic 4: Hỏi thêm & phù hợp cá nhân (Interaction Layer)

| Feature | Task | Subtask | Owner | Estimate | Priority | Dependency |
|---|---|---|---|---|---|---|
| Follow-up | Route `followup` (stateless) | Nhận `report_context`, gọi lại Reasoning | BE | 1–2h | Should | Epic 1 Reasoning ổn định |
| | UI ô hỏi tiếp | Giới hạn 1 lượt cho demo | FE | 1h | Should | Route followup chạy |
| Suitability | Link sang Eligibility Checker | Truyền `project_id` làm context bổ sung | FE/BE | 1–2h | Could | **Eligibility Checker chạy thật (không mock)** — nếu chưa, bỏ task này khỏi demo |

## Epic 5: Dữ liệu mới nhất (Live Layer)

| Feature | Task | Subtask | Owner | Estimate | Priority | Dependency |
|---|---|---|---|---|---|---|
| Live Search | Chọn & tích hợp search API | — | BE | 3–4h | **Won't Have (khuyến nghị không làm)** | Ngân sách API — OPEN QUESTION đang treo |
| | Nối `LiveSearchAdapter` | — | BE | 1–2h | Won't Have | Trên |

> Epic 5 giữ nguyên trong WBS để **không mất kiến trúc** (đúng nguyên tắc "khả năng mở rộng" của Technical Discovery) nhưng đánh dấu rõ Priority = Won't Have cho phạm vi hackathon — xem lý do đầy đủ ở `10_TECHNICAL_DECISION.md`.

## Tổng hợp theo Owner (ước lượng effort quy đổi giờ-người)

| Owner | Tổng giờ ước tính (Epic 1–4) |
|---|---|
| Data | ~11–17h |
| BE | ~10–14h |
| AI | ~6–9h |
| FE | ~8–12h |
| **Tổng** | **~35–52h** (đội 1–2 người luân phiên vai trò, không cộng dồn tuyến tính nếu chỉ 1 người) |

Con số này khớp với ước lượng tổng ở `07_IMPLEMENTATION_PLAN.md` (~17-37h tuỳ kịch bản) khi tính đội 1-2 người làm song song một phần công việc (VD: Data thu thập trong lúc BE dựng pipeline).
