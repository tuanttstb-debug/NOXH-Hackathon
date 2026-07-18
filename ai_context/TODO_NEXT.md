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
- **Bạn cung cấp `YOUTUBE_API_KEY`** → chạy `cd web && node scripts/crawl-youtube.mjs`. Đây là bước **duy nhất** còn thiếu để có dữ liệu sinh được cảnh báo P1 — RSS báo chí đã xác nhận không sinh P1 (đúng thiết kế: báo chính thống có dẫn nguồn, không dùng ngôn ngữ tuyệt đối). Hướng dẫn lấy key: `web/data/discourse/HUONG_DAN_YOUTUBE_API.md`.
- Khuyến nghị **rotate lại `MKP_API_KEY`** trên FPT AI Marketplace dashboard — key hiện tại đã bị dán trực tiếp vào chat nên coi như đã lộ, dù đã nằm trong `web/.env.local` (gitignored, không commit).
- **Bộ ảnh `EVD/` đã mất** — thư mục chỉ còn 3 ảnh rehearsal của Session 9. 20 ảnh gốc `EVD/01`–`20` mà `PROJECT_STATE.md` tham chiếu không còn tồn tại (chưa từng commit nên không khôi phục được từ git). Nếu cần cho bài demo/nộp bài, chạy lại `web/screenshot.mjs` — lưu ý script trỏ `localhost:3001` và cần Chrome mở sẵn debug port 9222.

## Việc đang chờ NGƯỜI DÙNG (chặn tiến độ, 2026-07-18)
1. **Dữ liệu 2–3 dự án NOXH có nguồn** → thả vào `web/lib/Projects/`, format tự do, theo `DU_LIEU_CAN_CUNG_CAP.md`. Toàn bộ pipeline Project Intelligence đã sẵn sàng, thả dữ liệu vào là có report.
2. **30–50 bài đăng mạng xã hội thật** cho Public Discourse Filter (nếu vẫn muốn demo module này). Pipeline đã chạy được, hiện chỉ có fixture giả lập không dùng để demo được.
3. ~~**P0 #5** — click qua UI `/eligibility` trong trình duyệt~~ → ✅ xong (Session 9, tự động hoá bằng `verify-ui-rehearsal.mjs`).
4. **Rotate `MKP_API_KEY`**.

## P1 — Nếu còn thời gian sau P0
- Hiển thị link tới văn bản gốc trong kết quả (không chỉ tên điều/khoản) — `../docs/14_BACKLOG.md`.
- Màn hình 4 (Legal Search) — bước tiếp theo được ghi nhận ở `../docs/00_PROJECT_MEMORY.md`.
- Giao diện chỉn chu hơn cho 3 màn hình đã dựng (không phải trọng tâm chấm điểm).
- **Project Intelligence** (`../docs/features/PROJECT_INTELLIGENCE.md`) — chỉ bắt đầu sau khi P0 chạy đúng. Xem `../docs/technical/10_TECHNICAL_DECISION.md` cho khuyến nghị "nếu chỉ còn 12h" trước khi bắt đầu.
- **Public Discourse Filter** (`../docs/features/PUBLIC_DISCOURSE_FILTER.md`) — chỉ bắt đầu sau khi P0 chạy đúng VÀ đã trả lời được OPEN QUESTION mốc giờ "36h" ở `../docs/00_MUC_LUC.md`. Cần dữ liệu mẫu 30-50 bài tuyển thủ công trước khi code (mục 10 trong tài liệu gốc).

## OPEN QUESTION cần người dùng trả lời (chặn quyết định, không tự suy diễn)
Đầy đủ ở `../docs/00_MUC_LUC.md` mục "Cần bạn xác nhận sớm nhất".

**✅ Đã trả lời 2026-07-18 bằng toàn văn văn bản gốc tại `web/lib/Legal/`:**
- ~~Toàn văn hợp nhất mới nhất NĐ 100/2024/NĐ-CP~~ — đã có đủ chuỗi sửa đổi.
- ~~Mức trần nhóm "độc thân nuôi con"/"đã kết hôn" có bị NĐ 136/2026 sửa không~~ — **CÓ**, sửa cả 3 nhóm (25/35/50tr). Code trước đó sai, đã sửa.

**Còn treo — ưu tiên hỏi lại nếu bắt đầu phiên mới:**
1. Mốc thời gian 48h chính xác + rubric chấm điểm — ảnh hưởng mức độ ưu tiên P0 vs P1.
2. Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng.
3. Thời lượng demo trước giám khảo — ảnh hưởng kịch bản `11_KICH_BAN_DEMO.md`.
4. Có nên thu thập quyết định hệ số điều chỉnh của một vài UBND tỉnh (TP.HCM, Hà Nội, Bình Dương) để điền vào `provincialCoefficients` không? Nếu có, TC-04 sẽ ra verdict chắc chắn cho các tỉnh đó và "Thiếu thông tin" chỉ còn cho tỉnh chưa có dữ liệu — thể hiện hệ thống mở rộng được. **Chưa làm vì chưa có nguồn quyết định thật.**

## Nguyên tắc khi làm P0
Không mở rộng sang P1/P2 khi P0 chưa chạy đúng và có trích dẫn thật từ đầu đến cuối (`../docs/14_BACKLOG.md`). Không viết thêm tài liệu mới trong `docs/`/`knowledge/` trừ khi cần thiết để build P0 — giá trị biên của tài liệu đã giảm dần theo kết luận `../docs/16_DESIGN_REVIEW.md`.
