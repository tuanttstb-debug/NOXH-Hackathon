# 07 — Implementation Plan

> Đọc trong 8 phút. Bước 9. Chia theo **giá trị người dùng nhận được**, không chia theo tầng kỹ thuật (không có "Phase Backend", "Phase Frontend" riêng). Thứ tự Phase được sắp xếp lại so với ví dụ gợi ý trong yêu cầu gốc — lý do nêu rõ ở từng Phase.

## Tổng quan thứ tự

| Phase | Tên (giá trị) | FR liên quan |
|---|---|---|
| 1 | Xem hồ sơ 1 dự án (Project Snapshot) | FR-01, FR-02, FR-03, FR-09 |
| 2 | Đáng tin cậy (Trust Layer) | FR-04, FR-05, FR-07 |
| 3 | Gắn kết pháp lý (Legal Intelligence) | FR-06 |
| 4 | Hỏi thêm & phù hợp cá nhân (Interaction Layer) | FR-10, FR-08 |
| 5 | Dữ liệu mới nhất (Live Layer) | Live Search (đã hạ MVP) |

**Vì sao Legal Intelligence (Phase 3) đứng sau Trust Layer (Phase 2) thay vì ngay đầu**: giá trị nghiệp vụ của Legal Intelligence cao, nhưng **chi phí kỹ thuật để làm đúng thấp nhất trong toàn kế hoạch** nếu làm sau khi Eligibility Checker P0 (Legal KG) đã ổn định — chỉ cần thêm 1 cạnh `GOVERNED_BY`, không xây gì mới (`04_DATA_MODEL.md` §3). Làm sớm hơn tức là phải tạm dùng dữ liệu pháp lý riêng (trùng lặp, vi phạm Single Source of Truth) rồi sửa lại sau — lãng phí hơn.

---

## Phase 1 — Xem hồ sơ 1 dự án (Project Snapshot)

| | |
|---|---|
| **Goal** | Người dùng gõ tên dự án (kể cả gõ mơ hồ) → nhận Project Intelligence Report cơ bản (Tổng quan + Pháp lý sơ bộ) có Citation thật, cho ≥ 5 dự án demo |
| **Deliverable** | Entity Resolution (fuzzy+alias) + Project Search rút gọn + khối "Tổng quan dự án" + Citation Binding chạy đầu-cuối qua `GET /report/{project_id}` |
| **Dependency** | (a) LLM provider đã chọn — OPEN QUESTION đang treo, **block cứng** toàn bộ Phase 1 nếu chưa trả lời; (b) dataset tối thiểu 5-20 dự án đã có nguồn — OPEN QUESTION #4 ở `01_TECHNICAL_DISCOVERY.md` |
| **Risk** | Cao nếu phải tự thu thập dataset từ đầu (không có sẵn danh mục dự án NOXH đã kiểm chứng) — đây là rủi ro tiến độ lớn hơn rủi ro kỹ thuật, đúng dạng rủi ro đã ghi nhận cho Eligibility Checker (`docs/12_QUAN_LY_RUI_RO.md`) |
| **Estimated Time** | 6–8h nếu dataset + provider đã sẵn sàng; **+4–6h** nếu phải tự thu thập dữ liệu dự án |

## Phase 2 — Đáng tin cậy (Trust Layer)

| | |
|---|---|
| **Goal** | Report hiển thị hồ sơ Chủ đầu tư (rút gọn) + Tin tích cực/Tin cần lưu ý có phân tầng nguồn + nhãn rủi ro thủ công |
| **Deliverable** | FR-04 rút gọn, FR-05, FR-07 rút gọn — News đã crawl (~3-5 bài/dự án), gắn `sentiment`/`topic`/`risk_type`, hiển thị đúng AI Safety §11 (4 tầng nguồn) |
| **Dependency** | Phase 1 xong (dùng chung pipeline); dữ liệu News đã crawl + gắn nhãn xong (Crawler Flow, `03_FINAL_ARCHITECTURE.md` §8) |
| **Risk** | **Rủi ro thời gian lớn nhất toàn kế hoạch** — crawl + đọc + gắn nhãn thủ công cho 20-50 dự án là công việc tốn thời gian nhất, không phải công việc code |
| **Estimated Time** | 6–10h — phần lớn là thu thập/gắn nhãn dữ liệu (con người), không phải xây pipeline (đã có từ Phase 1) |

## Phase 3 — Gắn kết pháp lý (Legal Intelligence)

| | |
|---|---|
| **Goal** | Report liên kết đúng văn bản pháp luật đang hiệu lực áp dụng cho dự án + mục "thay đổi pháp lý liên quan gần đây" |
| **Deliverable** | FR-06 — cạnh `GOVERNED_BY` (Project → Legal KG), lọc theo `trang_thai_hieu_luc` |
| **Dependency** | **Cứng: Eligibility Checker P0 (Legal Knowledge Graph) phải đã chạy đúng.** Đây là ràng buộc quan trọng nhất toàn kế hoạch — không có lựa chọn thay thế an toàn (tự xây Legal KG riêng vi phạm Single Source of Truth, đã loại ở Bước 2) |
| **Risk** | Nếu Eligibility Checker P0 chưa xong khi tới Phase 3 → **hoãn toàn bộ Phase 3**, không có phương án B |
| **Estimated Time** | 2–4h (chi phí thấp, vì dữ liệu Legal KG đã có sẵn từ module khác — đúng lý do sắp xếp thứ tự ở trên) |

## Phase 4 — Hỏi thêm & phù hợp cá nhân (Interaction Layer)

| | |
|---|---|
| **Goal** | Người dùng hỏi tiếp 1 lượt trong ngữ cảnh report; xem mức độ phù hợp cá nhân nếu đã có hồ sơ |
| **Deliverable** | FR-10 rút gọn (single follow-up, stateless), FR-08 rút gọn (link sang Eligibility Checker, không xây lại) |
| **Dependency** | Phase 1–3 xong; **Eligibility Checker pipeline phải chạy thật** (không phải mock) để FR-08 có giá trị — nếu Eligibility Checker vẫn dùng mock, FR-08 nên bỏ khỏi demo thay vì hiển thị kết quả giả (tránh lặp lại rủi ro "Potemkin AI") |
| **Risk** | Thấp về kỹ thuật; rủi ro chính là **giá trị demo phụ thuộc hoàn toàn vào tiến độ module khác** ngoài tầm kiểm soát của Phase này |
| **Estimated Time** | 3–5h |

## Phase 5 — Dữ liệu mới nhất (Live Layer)

| | |
|---|---|
| **Goal** | Escape hatch gọi Live Search thật khi cache thiếu hoặc người dùng yêu cầu cập nhật |
| **Deliverable** | Nối `LiveSearchAdapter` (đã thiết kế stub ở `03_FINAL_ARCHITECTURE.md`) với 1 search API thật |
| **Dependency** | Phase 1–4 ổn định; ngân sách/API key cho search API — OPEN QUESTION đang treo (`01_TECHNICAL_DISCOVERY.md`) |
| **Risk** | **Cao nhất toàn kế hoạch** — chi phí/rate-limit không kiểm soát (BRD tự nêu Risk #6), phụ thuộc mạng ngoài ngay lúc demo trực tiếp |
| **Estimated Time** | 4–6h nếu làm — **khuyến nghị không làm trong phạm vi hackathon**, xem lý do đầy đủ ở `10_TECHNICAL_DECISION.md` |

---

## Tổng thời gian ước tính

| Kịch bản | Tổng giờ |
|---|---|
| Dataset + LLM provider đã sẵn sàng, chỉ làm Phase 1–4 | ~17–27h |
| Phải tự thu thập dataset từ đầu, làm Phase 1–4 | ~27–37h |
| Làm cả Phase 5 | +4–6h nữa |

**Nhận định quan trọng nhất của tài liệu này**: tổng thời gian Phase 1–4 (chưa tính Phase 5) đã tương đương hoặc vượt quỹ thời gian còn lại của một hackathon 48h nếu tính luôn thời gian đã dùng cho Eligibility Checker (đã dùng phần lớn thời gian ban đầu để viết tài liệu, theo `docs/16_DESIGN_REVIEW.md`). Điều này **xác nhận lại** quyết định đã chốt ở phiên trước: Project Intelligence là mở rộng sau khi Eligibility Checker P0 chạy đúng, không phải công việc song song trong cùng 48h — chi tiết khuyến nghị ở `10_TECHNICAL_DECISION.md`.
