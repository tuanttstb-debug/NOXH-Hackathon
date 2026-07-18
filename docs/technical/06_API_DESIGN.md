# 06 — API Design

> Đọc trong 8 phút. Bước 8. Đây là **đặc tả** (request/response shape, lỗi, auth, cache) — không phải implementation. Không có code route handler trong tài liệu này, đúng nguyên tắc "Không sinh API implementation".

## 1. Nguyên tắc thiết kế API

- Toàn bộ endpoint nằm dưới namespace `/api/project-intelligence/*`, tách biệt với API của Eligibility Checker (dự kiến `/api/eligibility/*`) dù có thể dùng chung `SynthesisService`/LLM adapter ở tầng dưới.
- Không thiết kế endpoint ghi (POST tạo/sửa Project, Developer, News) ở MVP — dữ liệu được nạp qua quy trình ingestion thủ công (`03_FINAL_ARCHITECTURE.md` §5, §8), không qua API. Tránh thiết kế thừa cho một CRUD backend chưa có nhu cầu.
- Mọi response thành công đều mang `citations[]` nếu nội dung có claim cần nguồn (đúng FR-09).

## 2. Danh sách endpoint

### 2.1 `GET /api/project-intelligence/search`

| | |
|---|---|
| Mục đích | FR-02 Project Search — tìm dự án theo tên/alias |
| Query param | `q` (string, bắt buộc) — text người dùng nhập |
| Response 200 | `{ matches: [{ project_id, name, address, developer_name }] }` — mảng rỗng nếu không có kết quả |
| Response lỗi | Xem mục 4 |
| Cache | Không cache (query nhanh, in-memory lookup, không đáng cache) |

### 2.2 `POST /api/project-intelligence/resolve`

| | |
|---|---|
| Mục đích | FR-01 Entity Resolution — chuẩn hoá text tự do thành `project_id` xác nhận |
| Request body | `{ text: string }` |
| Response 200 (1 kết quả rõ ràng) | `{ status: "resolved", project_id: string }` |
| Response 200 (nhiều ứng viên) | `{ status: "ambiguous", candidates: [{ project_id, name, address }] }` |
| Response 200 (không tìm thấy) | `{ status: "not_found" }` — **không phải lỗi HTTP**, đây là trạng thái nghiệp vụ hợp lệ (đối xứng "Thiếu thông tin" của Eligibility Checker) |
| Cache | Không cache — phụ thuộc input tự do |

### 2.3 `GET /api/project-intelligence/report/{project_id}`

| | |
|---|---|
| Mục đích | FR-03→FR-09 — sinh/trả Project Intelligence Report đầy đủ |
| Path param | `project_id` (bắt buộc, phải đã qua bước resolve) |
| Response 200 | Object theo đúng 11 mục BRD mục 10 — xem schema chi tiết mục 3 |
| Response lỗi | 404 nếu `project_id` không tồn tại trong Data Layer (xem mục 4) |
| Cache | **Có** — theo quyết định B6-B (`03_FINAL_ARCHITECTURE.md`): in-memory `Map<project_id, report>`, không có TTL ở MVP (dataset tĩnh, đóng băng trước demo nên không cần invalidate) |
| Header phản hồi | `X-Cache: HIT \| MISS` — hỗ trợ quan sát latency lúc demo/debug, không phải yêu cầu bắt buộc nhưng rẻ để thêm |

### 2.4 `POST /api/project-intelligence/followup`

| | |
|---|---|
| Mục đích | FR-10 Follow-up Question, rút gọn (Should Have, single-turn — `02_SOLUTION_OPTIONS.md` Phần A) |
| Request body | `{ project_id: string, question: string, report_context: object }` — client gửi lại nguyên `report_context` đã nhận từ 2.3 (stateless, không session store — đúng quyết định rút gọn) |
| Response 200 | `{ answer: string, citations: Citation[] }` |
| Response lỗi | 400 nếu thiếu `report_context` (không được suy đoán ngữ cảnh) |
| Cache | Không cache — câu hỏi tự do |

## 3. Schema chi tiết

### 3.1 Report object (response của 2.3)

| Field | Kiểu | Mục BRD tương ứng |
|---|---|---|
| `project_id` | string | — |
| `generated_at` | datetime | Minh bạch thời điểm sinh report |
| `data_as_of` | date | **Thay thế Live Search** — giá trị `max(crawled_at)` của các News dùng trong report (quyết định B5-B) |
| `overview` | object `{ text, citations[] }` | Mục 1 — Tổng quan dự án |
| `developer` | object `{ text, citations[] }` | Mục 2 — Chủ đầu tư |
| `progress` | object `{ text, citations[] }` | Mục 3 — Tiến độ |
| `legal` | object `{ text, citations[] }` | Mục 4 — Pháp lý |
| `positive_news` | array `{ text, citations[] }` | Mục 5 |
| `watch_news` | array `{ text, citations[] }` | Mục 6 |
| `community_discussion` | array \| `null` | Mục 7 — **`null` ở MVP** vì Live Search/cộng đồng chưa triển khai (không trả mảng rỗng giả — `null` thể hiện rõ "chưa có nguồn này", tránh hiểu nhầm là "đã tra nhưng không có gì") |
| `legal_changes` | array `{ text, citations[] }` | Mục 8 |
| `ai_assessment` | object `{ text, citations[], disclaimer: "Đây là suy luận của AI..." }` | Mục 9 — disclaimer bắt buộc trong payload, không chỉ ở UI, để mọi client hiển thị đều giữ đúng cảnh báo |
| `suitability` | object \| `null` | Mục 10 — `null` nếu người dùng chưa cung cấp hồ sơ (FR-08 rút gọn) |
| `citations` | `Citation[]` | Mục 11 — danh sách đầy đủ, hợp nhất từ mọi mục trên |

### 3.2 Citation object

| Field | Kiểu | Ghi chú |
|---|---|---|
| `citation_id` | string | Theo cấu trúc composite ở `04_DATA_MODEL.md` §6 |
| `source_type` | enum(`project`, `developer`, `news`, `legal`) | |
| `source_tier` | enum(`chính thống`, `báo chí`, `cộng đồng`, `AI suy luận`) | Bắt buộc theo AI Safety §11 BRD |
| `label` | string | Text hiển thị, VD: `"Theo Báo Xây Dựng, 12/03/2026"` |
| `url` | url \| `null` | `null` chỉ hợp lệ khi `source_type = legal` và văn bản chưa có bản online (hiếm) |

## 4. Error Model

Áp dụng 1 shape lỗi thống nhất cho toàn bộ 4 endpoint:

| Field | Kiểu | Ghi chú |
|---|---|---|
| `error.code` | string | VD: `PROJECT_NOT_FOUND`, `MISSING_CONTEXT`, `LLM_PROVIDER_ERROR` |
| `error.message` | string | Thông điệp người đọc được (tiếng Việt) |

| HTTP Status | Khi nào dùng |
|---|---|
| 400 | Thiếu param bắt buộc (VD: thiếu `report_context` ở followup) |
| 404 | `project_id` không tồn tại ở `GET /report/{project_id}` |
| 422 | `resolve` nhận input rỗng/không hợp lệ |
| 500 | Lỗi nội bộ — **bao gồm cả trường hợp Citation Binding loại bỏ toàn bộ claim** (report rỗng hoàn toàn) — trả 500 kèm `code: "GROUNDING_FAILED"` thay vì trả report rỗng như thành công, để client phân biệt được "không có dữ liệu" (404) với "có dữ liệu nhưng AI không sinh được nội dung có căn cứ" (500 + GROUNDING_FAILED) |
| 502/503 | LLM provider timeout/lỗi ở bước Reasoning — không retry tự động quá 1 lần (tránh chi phí token nhân đôi ngoài kiểm soát, đúng risk đã nêu ở BRD) |

## 5. Authentication

**Không có auth ở MVP** — nhất quán với scope Backlog Eligibility Checker ("Tài khoản người dùng, lưu lịch sử tra cứu" là P2, `docs/14_BACKLOG.md`). Không thiết kế thừa cơ chế login/token cho 1 buổi demo không cần phân biệt người dùng.

**Bảo vệ chi phí LLM** (không phải auth, nhưng liên quan): giới hạn tốc độ đơn giản theo IP hoặc theo session token ẩn (không cần đăng nhập) — mục đích duy nhất là tránh 1 lượt demo lỗi (double-click) gọi lặp LLM, không phải chống lạm dụng thật sự. Không cần thiết kế phức tạp hơn cho phạm vi 1 buổi demo có kiểm soát.

## 6. Caching (tổng hợp, tham chiếu `03_FINAL_ARCHITECTURE.md` B6-B)

| Endpoint | Có cache? | Khoá cache | Invalidate khi nào |
|---|---|---|---|
| `search` | Không | — | — |
| `resolve` | Không | — | — |
| `report/{project_id}` | Có | `project_id` | Không có cơ chế invalidate tự động ở MVP — dataset đóng băng trước Demo Day (`03_FINAL_ARCHITECTURE.md` §1 News Crawl). Cần restart server nếu sửa dữ liệu tĩnh sau khi đã cache |
| `followup` | Không | — | — |
