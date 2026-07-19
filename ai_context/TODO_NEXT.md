# TODO_NEXT — NOXH Copilot

> Ưu tiên cho phiên làm việc tiếp theo. Tổng hợp từ `../docs/16_DESIGN_REVIEW.md` (5 khuyến nghị hành động), `../docs/14_BACKLOG.md` (Definition of Done P0), và các OPEN QUESTION đang chặn tiến độ. Cập nhật gần nhất: **2026-07-18**.

> **Cảnh báo scope (2026-07-18)**: 2 module mở rộng đã có tài liệu thiết kế xong — Project Intelligence và Public Discourse Filter (xem `PROJECT_STATE.md` mục "Module mở rộng đề xuất"). **P0 bên dưới KHÔNG đổi** — cả 2 module mới đứng sau P0, không song song. Cả hai đều phụ thuộc dữ liệu Legal KG mà P0 #1 chịu trách nhiệm hiện thực hoá lần đầu.

## P0 — Chặn demo, làm trước tiên
1. ✅ **Build pipeline AI Agent thật** — xong + **verify với LLM thật 2026-07-18**. `web/lib/eligibility/{legal-kg,reasoner,llm}.ts` + `web/app/api/eligibility/route.ts`. Đã chạy thật qua FPT AI Marketplace (model `SaoLa3.1-medium`) cho cả 4 test case chính thức + 2 red-team — tất cả PASS. Xem chi tiết verify trong `SESSION_HANDOVER.md` Session 5.
2. ✅ **Quyết định provider LLM + cách gọi API** — FPT AI Marketplace, endpoint đã xác minh thật: `POST {MKP_API_BASE}/v1/chat/completions`, `GET {MKP_API_BASE}/v1/models`. Model chốt: `SaoLa3.1-medium` (model tiếng Việt, trả `message.content` sạch). **Phát hiện quan trọng:** một số model khác trên cùng marketplace (DeepSeek-V4-Flash, GLM-5.2) là "reasoning model" — mặc định trả `content: null` và dồn hết vào `reasoning_content`; code đã có fallback (`llm.ts`) để không gãy nếu đổi model.
3. ✅ **Nối frontend với backend/API thật** — `use-eligibility-chat.ts` gọi `/api/eligibility`, interface hook không đổi.
4. ✅ **Viết ≥2 test case đối kháng (red-team)** — xong 2026-07-18, thêm TC-05/TC-06 vào `knowledge/evaluation/eligibility_test_cases.md`, **đã chạy thật và PASS cả 2** (ép trả lời chắc chắn khi thiếu dữ liệu; yêu cầu bỏ qua điều kiện loại trừ nhà ở) — verdict không bị ảnh hưởng bởi áp lực/yêu cầu trong câu hỏi, đúng thiết kế (Compose chỉ diễn giải, không đổi kết luận).
5. ✅ **Rehearsal demo** — xong 2026-07-18 (Session 9). Đã rehearsal thật qua UI `/eligibility` trong Chrome bằng `web/verify-ui-rehearsal.mjs` — **16/16 PASS**. Ghi chú cũ "AI không có công cụ trình duyệt" đã sai: repo có sẵn `puppeteer-core`, script tự khởi chạy Chrome headless. Kiểm cả reasoningSteps, citation card + link "Văn bản gốc", threshold bar, checklist, 0 lỗi JS, và verdict lật TC-02↔TC-04 quan sát trên UI. Chạy lại: `cd web && node verify-ui-rehearsal.mjs` (cần `next dev` chạy trước).
6. ✅ **Chạy `npm run lint`** — xong 2026-07-18, 0 warning/error.

7. ✅ **Đối chiếu toàn văn văn bản pháp lý gốc** — xong 2026-07-18. Phát hiện và sửa 2 ngưỡng SAI LUẬT (30tr→35tr, 40tr→50tr), bác bỏ "RISK trọng yếu nhất" (NĐ 54 và NĐ 136 sửa 2 khoản khác nhau, không chồng lấp), viết lại TC-04 theo vùng bất định có thật (hệ số điều chỉnh cấp tỉnh — Điều 30 k1 điểm d). Chạy lại 6/6 test case với LLM thật: PASS.

> **✅ P0 HOÀN TẤT 6/6** (2026-07-18, Session 9). Không còn việc P0 nào treo.
> Hai việc `docs/12_QUAN_LY_RUI_RO.md` và `docs/11_KICH_BAN_DEMO.md` từng ghi ở đây **đã được sửa ở Session 7** — mục này trước đó lỗi thời, đã gỡ.

### Việc ngay tiếp theo
- ~~Cung cấp `YOUTUBE_API_KEY` → chạy crawler~~ → ✅ **xong 2026-07-18 (Session 9): 205 bình luận / 60 video.**
- **QUYẾT ĐỊNH CẦN NGƯỜI DÙNG — số phận Public Discourse Filter.** Đã chạy thật trên 216 bài: **0 P1**, và đã chứng minh **rule không hỏng** (dữ liệu dựng riêng kích hoạt P1 đúng). Nguyên nhân là bản chất dữ liệu: bình luận YouTube dưới video chính sách chủ yếu là **câu hỏi cá nhân**, không phải khẳng định sai lệch; thêm nữa `surging` cần claim xuất hiện ở **2 channel** mà ta chỉ có YouTube + báo chí. Ba hướng:
  1. **Bổ sung nguồn Facebook/Threads** qua `web/data/discourse/manual-posts.json` (dán tay 30–50 bài) — đây là nơi tin sai lệch NOXH thực sự sống, và là hướng duy nhất có khả năng sinh P1 thật.
  2. **Trình bày trung thực**: "quét 216 bài, không phát hiện tin sai lệch lan nhanh" là **kết quả hợp lệ**, kèm bằng chứng rule hoạt động. Trung thực hơn là ép dữ liệu ra P1.
  3. Cắt module khỏi demo nếu thời gian còn lại eo hẹp.
- Khuyến nghị **rotate lại `MKP_API_KEY`** trên FPT AI Marketplace dashboard — key hiện tại đã bị dán trực tiếp vào chat nên coi như đã lộ, dù đã nằm trong `web/.env.local` (gitignored, không commit). **Việc này treo từ Session 5, chưa làm.**
- **`favicon.ico` đang 404** — tiểu tiết nhưng giám khảo mở tab sẽ thấy.

## Việc đang chờ NGƯỜI DÙNG (cập nhật 2026-07-19)
1. **Dữ liệu 2–3 dự án NOXH có nguồn** → thả vào `web/lib/Projects/` theo `DU_LIEU_CAN_CUNG_CAP.md`. Pipeline Project Intelligence đã sẵn sàng, thả dữ liệu vào là có report. **Đây là màn hình duy nhất còn rỗng.**
2. **Bài mạng xã hội thật cho Public Discourse Filter** — xem hướng dẫn đầy đủ ở `web/data/discourse/HUONG_DAN_THEM_BAI.md`. ⚠️ Muốn có P1 phải gom **≥5 bài cùng một claim, trải trên ≥2 kênh**; gom bài lẻ tẻ mỗi bài một ý sẽ không bao giờ ra P1 dù thu bao nhiêu.
3. **Rotate `MKP_API_KEY`**.
4. **Quyết định số phận Public Discourse Filter** (3 hướng ở mục trên) — chưa trả lời.

## P1 — trạng thái thật (cập nhật 2026-07-19)
- ~~Link tới văn bản gốc trong kết quả~~ → ✅ xong Session 7.
- ~~Màn hình 4 (Legal Search)~~ → ✅ xong Session 7, route `/legal`.
- ~~Project Intelligence~~ → ✅ code xong Session 7, route `/projects`, **chờ dữ liệu**.
- ~~Public Discourse Filter~~ → ✅ pipeline + crawler xong (Session 7–9). **Chưa có dashboard UI** — chưa dựng vì chưa có dữ liệu sinh được P1.
- Còn lại: **dashboard UI cho Discourse Filter** (chỉ dựng sau khi có dữ liệu thật), giao diện chỉn chu hơn (không phải trọng tâm chấm điểm).

## Nợ kỹ thuật đáng làm tiếp (chi tiết ở `TECH_DEBT.md`)
- **#13** — NĐ 95/2024 chưa nạp được vào Legal KG: PDF scan ảnh, cần OCR tiếng Việt.
- **#7** — chưa có unit test cho `reasoner.ts` (logic thuần, chạy nhanh, không cần LLM — đáng test nhất); chưa phủ `/legal`, `/projects`, `/api/discourse`; chưa có CI.
- **#11** — `redactPii()` chỉ chạy lúc phân tích, crawler vẫn ghi text thô xuống đĩa.

## OPEN QUESTION cần người dùng trả lời (chặn quyết định, không tự suy diễn)
Đầy đủ ở `../docs/00_MUC_LUC.md` mục "Cần bạn xác nhận sớm nhất".

**✅ Đã trả lời 2026-07-18 bằng toàn văn văn bản gốc tại `web/lib/Legal/`:**
- ~~Toàn văn hợp nhất mới nhất NĐ 100/2024/NĐ-CP~~ — đã có đủ chuỗi sửa đổi.
- ~~Mức trần nhóm "độc thân nuôi con"/"đã kết hôn" có bị NĐ 136/2026 sửa không~~ — **CÓ**, sửa cả 3 nhóm (25/35/50tr). Code trước đó sai, đã sửa.

**Còn treo — ưu tiên hỏi lại nếu bắt đầu phiên mới:**
1. Mốc thời gian 48h chính xác + rubric chấm điểm — ảnh hưởng mức độ ưu tiên P0 vs P1.
2. ~~Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng~~ → ✅ **ĐÃ TRẢ LỜI 2026-07-19: CÓ hỏi lại**, áp dụng cho cả `/eligibility` và `/workspace`. Đã hiện thực hoá + verify (Session 10).
3. Thời lượng demo trước giám khảo — ảnh hưởng kịch bản `11_KICH_BAN_DEMO.md`.
4. Có nên thu thập quyết định hệ số điều chỉnh của một vài UBND tỉnh (TP.HCM, Hà Nội, Bình Dương) để điền vào `provincialCoefficients` không? Nếu có, TC-04 sẽ ra verdict chắc chắn cho các tỉnh đó và "Thiếu thông tin" chỉ còn cho tỉnh chưa có dữ liệu — thể hiện hệ thống mở rộng được. **Chưa làm vì chưa có nguồn quyết định thật.**

## Nguyên tắc khi làm P0
Không mở rộng sang P1/P2 khi P0 chưa chạy đúng và có trích dẫn thật từ đầu đến cuối (`../docs/14_BACKLOG.md`). Không viết thêm tài liệu mới trong `docs/`/`knowledge/` trừ khi cần thiết để build P0 — giá trị biên của tài liệu đã giảm dần theo kết luận `../docs/16_DESIGN_REVIEW.md`.
