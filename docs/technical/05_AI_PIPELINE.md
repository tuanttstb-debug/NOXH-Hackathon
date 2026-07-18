# 05 — AI Pipeline

> Đọc trong 8 phút. Bước 7. Chi tiết hoá từng giai đoạn của pipeline đã chốt ở `03_FINAL_ARCHITECTURE.md` §6, đánh giá Latency/Accuracy/Grounding theo đúng yêu cầu.

## 1. Pipeline tổng quan

```
User Question → Entity Resolution → [KG Retrieval ∥ News Retrieval ∥ Legal Retrieval] → Hybrid Ranking → Reasoning (1 LLM call) → Citation Binding → Response
```

Ba bước Retrieval chạy song song (không phụ thuộc lẫn nhau — cùng nhận `project_id` làm input từ Entity Resolution).

## 2. Đánh giá từng giai đoạn

| Giai đoạn | Input | Output | Cách hiện thực (theo `03_FINAL_ARCHITECTURE.md`) | Latency ước tính | Accuracy | Grounding |
|---|---|---|---|---|---|---|
| **1. Entity Resolution** | Free text tên dự án | `project_id` đã xác nhận (hoặc danh sách ứng viên) | Fuzzy string match trên `aliasIndex` (in-memory) | < 100ms (không gọi LLM, không network) | Mục tiêu BRD NFR ≥ 80% — phụ thuộc trực tiếp độ đầy đủ của `Project.aliases`; đo bằng tỷ lệ resolve đúng trên tập test thủ công trước demo | Không áp dụng khái niệm hallucination (thuật toán xác định, không sinh nội dung) — rủi ro duy nhất là **false match** (nhầm dự án), giảm bằng ngưỡng similarity + bước xác nhận bắt buộc khi có nhiều ứng viên |
| **2. KG Retrieval** (Project + Developer) | `project_id` | `Project` object + `Developer` object | `Map.get(project_id)` trực tiếp | < 10ms | 100% nếu dữ liệu đã nạp đúng — đây là tra cứu xác định (deterministic), không có sai số thuật toán | Grounding tuyệt đối — dữ liệu trả về nguyên văn từ nguồn đã kiểm chứng lúc ingest, LLM chưa tham gia ở bước này |
| **3. News Retrieval** | `project_id`, (tuỳ chọn: `topic` filter) | Danh sách `News[]` liên quan | `newsByProject.get(project_id)`, lọc thêm theo `topic`/`sentiment` nếu cần (`newsByProjectAndTopic`) | < 20ms | 100% xác định (không phải semantic search — đã chọn keyword/tag filter ở `03_FINAL_ARCHITECTURE.md` §1) | Grounding tuyệt đối cùng lý do trên; **giới hạn đã biết**: recall phụ thuộc chất lượng gắn tag lúc ingest — không phải giới hạn của bước Retrieval |
| **4. Legal Retrieval** | `Project.applicable_legal_doc_ids` | Danh sách `DieuKhoan` **đang hiệu lực** liên quan | Join sang Legal KG đã có (tái dùng), lọc `trang_thai_hieu_luc = đang hiệu lực` | < 10ms | 100% xác định, với điều kiện Legal KG (module Eligibility Checker) đã nạp đúng và cập nhật `trang_thai_hieu_luc` khi có văn bản sửa đổi mới | **Điểm rủi ro grounding cao nhất của toàn pipeline** — nếu Legal KG chưa xử lý đúng rủi ro chồng lấp NĐ 54/2026 ↔ NĐ 136/2026 (`docs/07_KNOWLEDGE_GRAPH.md`), lỗi sẽ lan sang cả Project Intelligence Report. **Phụ thuộc cứng vào chất lượng Legal KG của Eligibility Checker** |
| **5. Hybrid Ranking** | Kết quả 3 bước Retrieval | Context đã gộp, sắp theo mục report (BRD mục 10: Tổng quan/CĐT/Tiến độ/Pháp lý/Tin tích cực/Tin cần lưu ý/...) | Gộp thuần bằng field đã có sẵn (`sentiment`, `topic`, `risk_type`) — **không dùng ML ranking**, vì đã bỏ vector search (quyết định B4) | < 10ms | Không áp dụng (không phải mô hình dự đoán, là quy tắc gộp cố định) | Grounding tuyệt đối — chỉ tổ chức lại dữ liệu đã xác định, chưa sinh nội dung mới |
| **6. Reasoning (1 LLM call)** | Context đã gộp (bước 5) | Draft report có cấu trúc (11 mục theo BRD) + danh sách claim kèm Citation ID nháp | Structured output/function-calling, prompt bắt buộc: "chỉ dùng dữ kiện trong context, không tự suy diễn ngoài phạm vi" (kế thừa ADR-01) | **3–15s** — biến động theo LLM provider/model (OPEN QUESTION đang treo), đây là **phần chiếm phần lớn latency toàn pipeline** | Không đo bằng % — đo qua tỷ lệ claim bị Citation Binding (bước 7) từ chối; mục tiêu vận hành: ít claim bị reject nghĩa là prompt đã ràng buộc tốt | **Rủi ro hallucination cao nhất** — giảm thiểu bằng: (a) prompt chỉ cung cấp context đã truy xuất, không cho phép truy cập tri thức nội tại về dự án cụ thể; (b) Citation Binding là lưới chặn độc lập ở bước sau, không phụ thuộc LLM tự giác |
| **7. Citation Binding** | Draft report + claim list | Report cuối cùng — claim không có Citation ID khớp với dữ liệu đã truy xuất **bị loại bỏ** | Đối chiếu deterministic từng claim với tập ID đã có ở bước 2-4 (không gọi LLM lần 2) | < 100ms | 100% theo thiết kế — đây chính là cơ chế đảm bảo NFR "100% claim quan trọng phải có Citation" (BRD mục 6), không phải một xác suất | Đây **là** lớp Grounding, không chỉ đánh giá nó — quyết định B8-A ở `03_FINAL_ARCHITECTURE.md` |
| **8. Response** | Report đã lọc | JSON trả về UI, render theo template cố định (không để LLM tự do định dạng — đúng BRD mục 9) | Next.js Route Handler trả JSON, cache theo `project_id` (quyết định B6-B) | < 20ms (không tính cache miss ở bước 6) | — | — |

## 3. Latency budget tổng hợp

| Kịch bản | Tổng thời gian ước tính | So với NFR gốc BRD |
|---|---|---|
| Cache hit (đã hỏi dự án này trước đó trong phiên) | < 200ms | Vượt xa mục tiêu "< 3s Production" |
| Cache miss (lần đầu hỏi dự án) | ~ 3–15s (gần như toàn bộ là bước 6 — LLM call) | Đạt mục tiêu MVP "< 8s cache hit" **không áp dụng đúng nghĩa** vì đã đổi kiến trúc — mục tiêu mới cho cache-miss nên là **< 15s**, thay thế mục tiêu "< 30s cần Live Search" của BRD gốc vì Live Search đã bị loại khỏi MVP (`03_FINAL_ARCHITECTURE.md` §1) |

**Đề xuất điều chỉnh NFR cho MVP** (khác BRD gốc, có lý do): vì không còn nhánh "cần Live Search" (BRD NFR bảng mục 6 dòng Latency), NFR Latency của tài liệu này rút còn 1 ngưỡng duy nhất: **cache-miss < 15s, cache-hit < 500ms**. Đơn giản hơn, đo được ngay, không phụ thuộc thành phần chưa xây (Live Search).

## 4. Grounding Evaluation — cách kiểm chứng trước Demo Day

Không có ngân sách xây bộ eval tự động ở MVP (đúng nguyên tắc "không over-engineering"). Đề xuất kiểm chứng thủ công tối thiểu, tương đương cách Eligibility Checker đã dùng 3 kịch bản demo (`docs/11_KICH_BAN_DEMO.md`):

1. Chạy pipeline với ≥ 5 dự án demo, đọc thủ công từng report, đối chiếu mỗi claim với dữ liệu nguồn — đếm số claim sai/không có căn cứ.
2. Cố tình hỏi 1 dự án **không có trong dataset** — xác nhận hệ thống trả lời "Chưa có dữ liệu", không suy đoán (đối xứng với kịch bản "Thiếu thông tin" của Eligibility Checker).
3. Cố tình để 1 News record thiếu `source`/`url` trong dữ liệu test — xác nhận Citation Binding loại bỏ đúng claim liên quan thay vì hiển thị claim không nguồn.

Đây là 3 "red-team test case" tối thiểu — tương đương khuyến nghị P0 #4 đã áp dụng cho Eligibility Checker (`ai_context/TODO_NEXT.md`), lặp lại nguyên tắc cho module mới thay vì phát minh quy trình eval mới.
