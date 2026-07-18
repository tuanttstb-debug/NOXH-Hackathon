# 09 — Risk Assessment

> Đọc trong 10 phút. Bước 11. Chỉ ghi rủi ro **mới hoặc đặc thù của Project Intelligence** — rủi ro đã có ở `docs/12_QUAN_LY_RUI_RO.md` (Legal KG, nguồn lực 1-2 người, rubric chưa có) được trích dẫn lại, không lặp chi tiết, đúng nguyên tắc Single Source of Truth.

## 1. Technical Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Chưa chọn LLM provider — blocker cứng toàn bộ Epic 1 (`08_WBS.md`) | **Cao** | Chốt provider trước khi bắt đầu bất kỳ task AI nào; kiến trúc đã thiết kế provider-agnostic (`03_FINAL_ARCHITECTURE.md` §10) để không phải sửa lại khi chọn | Chủ dự án |
| Rate limit LLM khi test lặp trong 48h | Trung bình | Cache theo `project_id` (B6-B) giảm số lần gọi lặp cho cùng dự án | Đội |
| Đưa Postgres/DB mới vào giữa hackathon (nếu ai đó tự ý "nâng cấp" sớm quyết định B3-C) | Trung bình (rủi ro tiềm ẩn, không phải hiện tại) | Giữ nguyên quyết định flat-file cho tới khi Epic 1–4 chạy ổn định; Phase 2 migrate mới xét lại | Tech Lead |
| Nguồn báo bị gỡ bài giữa lúc crawl và lúc demo → citation link chết | Thấp | Lưu snapshot text (không cần ảnh chụp) cho các bài quan trọng dùng làm bằng chứng chính | Data |

## 2. Data Quality Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Alias table thiếu → Entity Resolution accuracy dưới mục tiêu 80% | Trung bình | Test thủ công ≥5 case gõ mơ hồ trước khi coi Epic 1 là xong (`08_WBS.md`) | BE |
| News gắn nhãn sai (LLM tự động, chưa duyệt kỹ) → sentiment/risk hiển thị sai lệch | **Cao** — ảnh hưởng trực tiếp uy tín report | Bắt buộc người kiểm duyệt review nhãn trước khi ghi vào `news.ts` (Crawler Flow, `03_FINAL_ARCHITECTURE.md` §8) — không có ngoại lệ | Data |
| Rủi ro chồng lấp văn bản pháp luật (NĐ 54/2026 ↔ NĐ 136/2026) lan sang Project Intelligence qua `GOVERNED_BY` | **Cao** — kế thừa nguyên trạng từ Legal KG, xem chi tiết `docs/07_KNOWLEDGE_GRAPH.md` | Phase 3 (Legal Intelligence) chỉ bắt đầu **sau khi** Eligibility Checker P0 đã xử lý xong rủi ro này — dependency cứng đã ghi ở `07_IMPLEMENTATION_PLAN.md` | Đội (LegalTech + Tech Lead) |

## 3. AI Safety / Grounding / Hallucination Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| LLM tự suy diễn ngoài phạm vi context đã truy xuất (bịa CĐT/tin tức không có thật) | **Cao** | Citation Binding bắt buộc, deterministic, độc lập với LLM (quyết định B8-A, `03_FINAL_ARCHITECTURE.md`) — không dựa vào prompt instruction đơn thuần | AI Engineer |
| Trộn lẫn thông tin cộng đồng/AI suy luận với thông tin chính thống → hiểu nhầm mức độ tin cậy | **Cao** (BRD tự xác nhận) | 4 tầng nguồn hiển thị tách biệt bắt buộc, đã đưa vào schema (`06_API_DESIGN.md` §3.2 `source_tier`) — không gộp định dạng | FE + AI |
| Report thiên vị vì dữ liệu website CĐT chiếm ưu thế trong News đã crawl | Trung bình | Chủ động đa dạng nguồn khi crawl (ưu tiên báo độc lập song song với nguồn CĐT) — task cụ thể ở `08_WBS.md` Epic 2 | Data |
| Citation Binding loại hết claim → report rỗng hoàn toàn không rõ lý do | Trung bình | Trả lỗi `GROUNDING_FAILED` rõ ràng (`06_API_DESIGN.md` §4) thay vì hiển thị report trống; UI hiển thị tương đương trạng thái "Thiếu thông tin" của Eligibility Checker, không phải lỗi hệ thống | BE |
| Report bị hiểu là tư vấn pháp lý/tài chính chính thức — người dùng dựa vào để quyết định mua nhà thật | **Cao — rủi ro thực tế (real-world harm), không chỉ rủi ro kỹ thuật.** Design Review đã chỉ ra đây là khoảng trống chưa ai xử lý (`docs/16_DESIGN_REVIEW.md` mục Safety) | Disclaimer bắt buộc trong payload API (`ai_assessment.disclaimer`, `06_API_DESIGN.md` §3.1), không chỉ ở UI — mọi client hiển thị đều giữ đúng cảnh báo "không thay thế tư vấn pháp lý/tài chính chuyên nghiệp" | PO + Legal |

## 4. Performance Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Latency Reasoning (LLM call) vượt ngưỡng 15s đề xuất nếu provider/model chậm | Trung bình | Cache B6-B giảm số lần gọi lặp; ưu tiên model cân bằng tốc độ khi chọn provider (không nhất thiết model mạnh nhất) | AI Engineer |
| Nếu vẫn triển khai Phase 5 (Live Search), latency có thể vượt 30s và phụ thuộc mạng ngoài ngay lúc demo | Cao nếu làm | Không triển khai Phase 5 trong phạm vi hackathon (khuyến nghị `10_TECHNICAL_DECISION.md`) | Chủ dự án |

## 5. Business Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Trùng lặp công sức với Eligibility Checker nếu tự xây lại Suitability Analysis (FR-08) | Trung bình | Dependency rõ ràng: FR-08 luôn link sang Eligibility Checker, không xây pipeline riêng (`07_IMPLEMENTATION_PLAN.md` Phase 4) | Tech Lead |
| Không có mô hình doanh thu/ai trả tiền cho sản phẩm nói chung | Kế thừa nguyên trạng — xem `docs/16_DESIGN_REVIEW.md` mục Business, không lặp lại ở đây | Project Intelligence không tự giải quyết risk này | PO |
| Tổng effort Epic 1–4 (~35–52h người-giờ, `08_WBS.md`) vượt quỹ thời gian hackathon thực tế còn lại | **Cao nhất trong toàn bộ Risk Assessment** | Xem khuyến nghị cắt giảm cụ thể ở `10_TECHNICAL_DECISION.md` | Chủ dự án |

## 6. Legal Risk

| Rủi ro | Mức độ | Ứng phó | Ai quyết |
|---|---|---|---|
| Crawl/lưu trữ dữ liệu mạng xã hội vi phạm ToS | N/A cho MVP (đã né hoàn toàn bằng quyết định B5-B — không triển khai Live Search/cộng đồng) | Còn treo nếu Phase 2+ sau hackathon triển khai — cần rà soát pháp lý trước khi làm | Chủ dự án (giai đoạn sau) |
| Thông tin cá nhân người dùng (hồ sơ suitability) lưu sai mục đích | Thấp cho MVP — FR-08 chỉ link sang Eligibility Checker, không lưu trữ riêng ở Project Intelligence | Kế thừa nguyên tắc NFR Security của BRD gốc | PO |
| Report bị dùng làm căn cứ pháp lý/tài chính thật | Xem mục 3 (AI Safety) — cùng 1 rủi ro, 2 góc nhìn (kỹ thuật + pháp lý) | Disclaimer bắt buộc + không tự nhận là tư vấn chuyên nghiệp trong toàn bộ copy sản phẩm | PO + Legal |

## Rủi ro kế thừa (trích dẫn, không lặp chi tiết)

- Nguồn lực 1–2 người/48h — `docs/12_QUAN_LY_RUI_RO.md`.
- Chưa có rubric chấm điểm chính thức — `docs/12_QUAN_LY_RUI_RO.md`.
- Ingestion thủ công có thể sai sót do thiếu kiểm chứng chéo (1 người làm) — `docs/09_KIEN_TRUC_DU_LIEU.md`, áp dụng chéo sang News/Project ingestion.

## Khuyến nghị ưu tiên xử lý

1. Chốt LLM provider — mở khoá toàn bộ Epic 1.
2. Xác nhận Eligibility Checker P0 đã/sẽ xong trước Phase 3 — nếu không chắc chắn, loại Phase 3 khỏi phạm vi demo thay vì tự xây Legal KG riêng.
3. Không bỏ qua bước kiểm duyệt nhãn News thủ công dù áp lực thời gian — đây là rủi ro "Cao" duy nhất hoàn toàn nằm trong tầm kiểm soát của đội (không phụ thuộc external OPEN QUESTION nào).
