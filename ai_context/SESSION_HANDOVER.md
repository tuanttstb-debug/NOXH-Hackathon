# SESSION_HANDOVER — NOXH Copilot

> Nhật ký từng phiên làm việc, **mới nhất ở trên cùng**. Đọc file này đầu tiên khi bắt đầu phiên mới, sau đó mới đọc `PROJECT_STATE.md` (trạng thái hiện tại) và `TODO_NEXT.md` (việc cần làm tiếp). File này KHÔNG thay thế `../docs/00_PROJECT_MEMORY.md` (neo trí nhớ nghiệp vụ/kiến trúc) — hai file bổ sung cho nhau: `00_PROJECT_MEMORY.md` trả lời "dự án là gì, đã quyết định gì", file này trả lời "phiên trước đã làm gì, dừng ở đâu".

## Session 7 — 2026-07-18 (Triển khai các phase còn lại: P1, Legal Search, Project Intelligence, Public Discourse Filter)

**Bối cảnh:** Người dùng yêu cầu "triển khai toàn bộ các phase còn lại". Đã chốt với người dùng: còn **12–24h**; dữ liệu Project Intelligence **người dùng sẽ cung cấp**; Public Discourse Filter **chỉ xây pipeline, dữ liệu sau**.

**Làm gì (theo thứ tự bảo vệ bản demo đang chạy trước):**
1. **Sửa 2 tài liệu mâu thuẫn với hệ thống thật** — `docs/11_KICH_BAN_DEMO.md` (Kịch bản 3 viết lại theo hệ số cấp tỉnh, thêm phần trả lời khi giám khảo hỏi khó về kiến trúc) và `docs/12_QUAN_LY_RUI_RO.md` (đóng rủi ro chồng lấp, thêm 2 rủi ro thật thay thế). Giám khảo đọc tài liệu cũ sẽ thấy mâu thuẫn với sản phẩm.
2. **P1** — citation giờ có link "Văn bản gốc" (`citation-card.tsx`); bản `.txt` tải về kèm link + ngày hiệu lực + trạng thái xác minh từng điều khoản. Sửa luôn câu disclaimer đã lỗi thời ("dữ liệu đang xác minh") và thêm cảnh báo về hệ số cấp tỉnh.
3. **Màn hình 4 — Legal Search** (`/legal`): tra cứu thuần trên Legal KG, **không gọi LLM** (có chủ đích — gắn nhãn AI cho thao tác lọc chuỗi đúng là "Potemkin AI"). Giá trị thật: hiển thị **lịch sử sửa đổi** theo từng khía cạnh, trả lời được "quy định nào đang áp dụng hôm nay". Đã verify render thật: 6 điều khoản, 4 active / 2 amended.
4. **Nối Quick Skill trong sidebar vào route thật** — trước đó là nút bấm không làm gì. Skill chưa dựng giờ hiển thị rõ "· chưa có" thay vì giả vờ bấm được.
5. **Project Intelligence** (`/projects`): `types/project.ts`, `lib/project-intelligence/{project-kg,report}.ts`, `features/project-intelligence/report-view.tsx`. Entity Resolution exact-match (không fuzzy, theo `10_TECHNICAL_DECISION` §1), `GOVERNED_BY` **tái dùng thẳng Legal KG** (không dựng bản sao — đúng cảnh báo `TECH_DEBT.md` #10), ràng buộc citation thực thi bằng code (`enforceCitations` loại khối không có nguồn và **hiển thị công khai** số khối bị loại), phân tầng nguồn 4 loại, disclaimer AI Safety. Registry **rỗng có chủ đích** — chờ dữ liệu người dùng, xem `web/lib/Projects/DU_LIEU_CAN_CUNG_CAP.md`.
6. **Tách `lib/llm-client.ts`** dùng chung cho cả 2 module thay vì nhân bản client đã kiểm chứng thật.
7. **Public Discourse Filter**: `types/discourse.ts`, `lib/discourse/{analyze,extract}.ts`, `app/api/discourse/route.ts`, fixture giả lập. Keyword gate + quality gate + PII redaction + velocity + controversy + rule P1 đều là **code xác định**; LLM chỉ trích xuất. Có bộ lọc chống LLM bịa claim (`claim_text_raw` phải xuất hiện thật trong bài). Hệ thống **không tự xác minh/publish** — đúng phần đã cắt khỏi scope vì rủi ro AI Safety.

**Phát hiện khi chạy thật pipeline discourse:** việc cắt claim clustering (ghi là "known limitation không chặn demo") thực tế **vô hiệu hoá luôn rule cảnh báo P1** — 4 bài cùng nội dung sinh 4 `claim_id` khác nhau vì khác cách diễn đạt, mỗi claim đếm 1 lượt nên `trend_status` không bao giờ đạt `surging`. Đã sửa rẻ: loại các cụm chỉ mức độ khẳng định ("chắc chắn", "không cần điều kiện gì thêm"...) khỏi hash định danh — không mất thông tin vì chúng đã được lưu riêng thành `claimAbsoluteLanguage`/`claimOmitsConditions`. Sau sửa: claim chính gộp đúng 3 lượt / 3 kênh → `rising`, controversy `medium`. Sửa triệt để cần embedding clustering — vẫn ngoài scope.

**Verify:** `tsc` sạch · `lint` 0 lỗi · `next build` thành công (10 route) · `/legal` và `/projects` render thật HTTP 200 · pipeline discourse chạy thật với LLM trên fixture.
> Lưu ý môi trường: chạy `tsc`/`next build` **song song với `next dev`** làm process crash `0xC0000409` (stack buffer overrun) — không phải lỗi code. Dừng dev server trước khi build.

**Chưa làm, có lý do:** dashboard UI cho Public Discourse Filter — chưa dựng vì chỉ có dữ liệu giả lập, mà chính tài liệu module cấm demo trên dữ liệu giả. Dựng UI lúc này chỉ tạo cảm giác hoàn chỉnh giả.

**Việc tiếp theo:** (1) người dùng thả dữ liệu dự án vào `web/lib/Projects/` theo `DU_LIEU_CAN_CUNG_CAP.md`; (2) P0 #5 — click qua UI trong trình duyệt, vẫn là việc duy nhất của P0 còn treo; (3) rotate `MKP_API_KEY`.

---

## Session 6 — 2026-07-18 (Đối chiếu toàn văn pháp lý thật — sửa 2 ngưỡng SAI LUẬT, bác bỏ "RISK trọng yếu nhất", viết lại TC-04)

**Bối cảnh:** Người dùng cung cấp 14 văn bản pháp lý gốc (PDF/DOCX) tại `web/lib/Legal/` — lần đầu dự án có toàn văn thay vì nguồn thứ cấp.

**Làm gì:**
1. Trích text 4 văn bản lõi (NĐ 100/2024, NĐ 261/2025, NĐ 54/2026, NĐ 136/2026). Môi trường không có `poppler`/`pdftotext`; Word COM treo (PowerShell 7 xử lý tham số `[ref]` COM kém + hộp thoại chuyển đổi PDF). Cách chạy được: **DOCX** giải nén bằng `System.IO.Compression` rồi strip XML; **PDF** dùng `pypdf` (đã `pip install`). Script để lại ở scratchpad (`legal/extract.py`).
2. **Phát hiện code SAI LUẬT** — `legal-kg.ts` trộn 2 văn bản: lấy 25tr từ NĐ 136/2026 cho nhóm độc thân nhưng vẫn giữ 30tr/40tr của NĐ 261/2025 **đã hết hiệu lực** cho 2 nhóm còn lại. Toàn văn NĐ 136/2026 khoản 1 Điều 30 thay thế **toàn bộ** khoản 1, cả 3 nhóm: **25tr / 35tr / 50tr**. Đã sửa.
3. **Bác bỏ "RISK trọng yếu nhất" của dự án** (`docs/12_QUAN_LY_RUI_RO.md`, `PROJECT_STATE.md`): NĐ 54/2026 sửa **khoản 2** Điều 30 (thẩm quyền xác nhận → Công an cấp xã), NĐ 136/2026 sửa **khoản 1** Điều 30 (mức trần). Hai khoản khác nhau — **không hề chồng lấp**. Rủi ro này chưa bao giờ tồn tại, chỉ là hệ quả của việc đọc nguồn thứ cấp.
4. Hệ quả: TC-04 — "kịch bản demo trọng tâm" chứng minh AI biết giới hạn tri thức — mất căn cứ (hồ sơ cũ giờ ra "Đủ điều kiện"). Người dùng chọn phương án thay bằng vùng bất định **có thật**: NĐ 136/2026 Điều 30 **khoản 1 điểm d** cho phép UBND cấp tỉnh quyết định hệ số điều chỉnh nâng trần theo mức sống địa phương. Đây là giới hạn của pháp luật, không phải thiếu sót dữ liệu — mạnh hơn hẳn trước giám khảo.
5. Hiện thực hoá: thêm registry `provincialCoefficients` (**rỗng có chủ đích** — chưa có quyết định UBND tỉnh nào; cấm điền số ước lượng) + `getProvincialCoefficient()` vào `legal-kg.ts`; thêm reasonKey `insufficient_provincial_coefficient_unknown` và nhánh so sánh mới trong `reasoner.ts`. Quy tắc: thu nhập ≤ trần trung ương → Đủ (hệ số chỉ NÂNG trần nên không đổi kết luận); vượt trần + có nêu tỉnh → **Thiếu thông tin**; vượt trần + không nêu tỉnh → Không đủ theo quy định trung ương (điểm d là ngoại lệ gắn với tỉnh cụ thể, chưa biết tỉnh thì chưa viện dẫn được).
6. **Sửa lỗ hổng trong bước Compose:** payload gửi LLM chỉ có mã văn bản/số điều khoản, **không có nội dung điều luật** — LLM buộc phải bịa nội dung khi diễn giải. Đã thêm `noi_dung` (summary từ KG) và `ly_do_ky_thuat` (reasonKey) vào payload, cùng hướng dẫn diễn giải theo từng reasonKey.
7. Sửa mock `chat-thread.ts` (màn `/workspace`): đang hiển thị kịch bản chồng lấp đã bị bác bỏ, và `notEligibleResult` dùng trần 40tr cũ (45tr giờ **dưới** trần 50tr → sẽ ra kết luận ngược). Đổi citation sang **dẫn xuất trực tiếp từ Legal KG** qua helper `cite()` thay vì hard-code nhãn/`confidence` — chính chỗ hard-code này là nguyên nhân lệch dữ liệu.
8. Viết lại `knowledge/evaluation/eligibility_test_cases.md`: TC-04 chuyển sang kịch bản hệ số cấp tỉnh, TC-05 đổi hồ sơ theo, ghi lại lịch sử vì sao TC-04 cũ bị bác bỏ.
9. Verify: `tsc --noEmit` sạch, `npm run lint` 0 lỗi, `next build` thành công, và **chạy thật cả 6 test case qua `/api/eligibility` với LLM thật — 6/6 PASS**.

**Kết quả đáng chú ý:** TC-02 và TC-04 dùng **cùng một hồ sơ** (độc thân, 30tr, chưa có nhà), chỉ khác việc có nêu tỉnh hay không — verdict lật từ "Không đủ" sang "Thiếu thông tin". Bằng chứng rõ nhất rằng hệ thống suy luận theo cấu trúc pháp lý chứ không khớp mẫu câu.

**Dừng ở đâu:** Toàn bộ pipeline đã verify lại với dữ liệu pháp lý thật. Dev server còn chạy ở `localhost:3001` khi kết thúc phiên.

**Việc tiếp theo:** P0 #5 (click qua UI trong trình duyệt) vẫn là việc duy nhất còn treo của P0 — AI không có công cụ trình duyệt. Cân nhắc rotate `MKP_API_KEY`. 10 văn bản còn lại trong `web/lib/Legal/` chưa đưa vào KG (quyết định có chủ đích: không phục vụ P0).

---

## Session 5 — 2026-07-18 (Verify pipeline với LLM thật + red-team test cases — P0 #1, #4, #5 hoàn tất phần backend)
**Làm gì:**
1. Người dùng cung cấp `MKP_API_BASE`/`MKP_API_KEY` thật (dán trực tiếp trong chat — đã cảnh báo 1 lần về rủi ro lưu lịch sử, khuyến nghị rotate key sau khi test). Ghi vào `web/.env.local` (gitignored, đã xác nhận bằng `git check-ignore`).
2. Trước khi tin vào endpoint đã đoán ở Session 4 (`FPT_AI_BASE_URL`/`FPT_AI_API_KEY`, path `/chat/completions`), **dò thật bằng key thật**: `GET {base}/v1/models` và `/models` đều trả 200 — xác nhận API thật là OpenAI-compatible tại `{base}/v1/...`. Đổi toàn bộ tên biến môi trường sang `MKP_API_KEY`/`MKP_API_BASE`/`MKP_API_MODEL` (khớp quy ước người dùng đã dùng) và path sang `/v1/chat/completions`.
3. Liệt kê toàn bộ model text-to-text khả dụng với key này (15 model, gồm DeepSeek-V4-Flash, GLM-5.2, Llama-3.3-70B-Instruct, Qwen3.6-27B, SaoLa3.1-medium, gpt-oss-120b/20b...). **Phát hiện quan trọng qua test thật**: DeepSeek-V4-Flash và GLM-5.2 là "reasoning model" — trả `message.content: null`, toàn bộ output nằm trong `message.reasoning_content` (parser ban đầu sẽ báo lỗi "response không có nội dung" nếu không xử lý). Đã thêm fallback `content ?? reasoning_content` trong `llm.ts` để đổi model không làm gãy code. Chốt model mặc định: **SaoLa3.1-medium** (model tiếng Việt, trả `content` sạch, rẻ, context 32k đủ dùng).
4. Thêm `response_format: {type: "json_object"}` vào mọi lệnh gọi (API xác nhận hỗ trợ) — tăng độ tin cậy JSON output cho cả bước Parse lẫn Compose.
5. Chạy `next dev` thật với key thật, test qua `curl` tới `/api/eligibility` cho toàn bộ 4 test case chính thức (TC-01→04) — **tất cả PASS**, output tiếng Việt tự nhiên, đúng verdict/citation/threshold, câu cảnh báo "đang được xác minh lại" xuất hiện đúng chỗ khi `confidence: pending`.
6. Viết 2 test case đối kháng mới (TC-05, TC-06 — nài nỉ trả lời chắc chắn khi thiếu dữ liệu; yêu cầu bỏ qua điều kiện loại trừ) vào `knowledge/evaluation/eligibility_test_cases.md`, chạy thật qua `curl` — **cả 2 PASS**: verdict không bị ảnh hưởng bởi áp lực/yêu cầu trong câu hỏi người dùng, đúng thiết kế cấu trúc (Compose chỉ diễn giải `verdict` đã tính xong bằng code, không có đường nào để input người dùng đổi được kết luận).
7. Dọn dẹp: xoá route debug tạm (`app/api/debug-eligibility-logic/`), xoá `.next/` cache cũ tham chiếu route đã xoá (gây lỗi `tsc` giả — không phải lỗi code thật), dừng dev server.
8. Cập nhật `ai_context/{PROJECT_STATE,TODO_NEXT}.md` phản ánh: P0 #1/#2/#3/#4/#6 hoàn tất; #5 (rehearsal) hoàn tất phần backend/API, còn thiếu phần rehearsal qua UI trình duyệt thật (AI không có công cụ trình duyệt trong phiên này).

**Dừng ở đâu:** Toàn bộ pipeline backend đã verify chạy đúng với LLM thật. Chưa ai xác nhận trải nghiệm qua UI `/eligibility` trong trình duyệt (reasoningSteps hiển thị, citation card, threshold bar...) — chỉ mới test tầng API bằng `curl`.

**Việc tiếp theo:** Người dùng tự mở `npm run dev`, click qua UI `/eligibility` ít nhất 1 lần. Cân nhắc rotate `MKP_API_KEY` (đã dán trong chat). Sau đó P0 coi như xong hoàn toàn — có thể cân nhắc P1 hoặc 2 module mở rộng theo `TODO_NEXT.md`.

---

## Session 4 — 2026-07-18 (Build pipeline Eligibility Checker thật — P0 #1, #2, #3)
**Làm gì:**
1. Phỏng vấn người dùng trước khi code (theo yêu cầu tường minh), chốt: module bắt đầu = Eligibility Checker P0; LLM provider = FPT AI Marketplace (OpenAI-compatible, key người dùng tự điền sau); Agent behavior = single-shot, báo "Thiếu thông tin" và dừng (không hỏi lại); dữ liệu pháp lý = build với dữ liệu "đang xác minh" hiện có, thay sau khi người dùng gửi văn bản hợp nhất.
2. Đọc toàn bộ nguồn còn thiếu trước khi code: `knowledge/phap_ly/*.md` (5 văn bản), `knowledge/agents/{eligibility,fact_check}.md`, `knowledge/prompts/eligibility.md`, `knowledge/evaluation/eligibility_test_cases.md`, `docs/03_YEU_CAU_NGHIEP_VU.md`, và `web/types/{chat,legal}.ts` + `web/mock/legal-documents.ts` — phát hiện `web/mock/legal-documents.ts` đã là bản chuẩn hoá đúng đắn của `knowledge/phap_ly/` (VanBan→LegalDocument, DieuKhoan→LegalArticle), tái dùng thẳng làm nguồn Legal KG thật thay vì tạo lại.
3. Viết pipeline thật, đúng thứ tự `knowledge/agents/eligibility.md`: `web/lib/eligibility/legal-kg.ts` (ngưỡng thu nhập theo nhóm + cờ `confirmedCurrent` cho rủi ro chồng lấp NĐ 54/2026↔NĐ 136/2026) → `reasoner.ts` (Validate + legal_reasoner + fact_check, thuần code xác định — **cải tiến so với spec gốc**: phép kiểm #3 của fact_check không cần LLM vì verdict tính trực tiếp từ cùng nguồn đang trích dẫn, đóng khoảng hở "AI kiểm tra AI" đã ghi ở `TECH_DEBT.md` #5 cũ) → `llm.ts` (2 lệnh gọi FPT AI: Parse trích xuất hồ sơ, Compose soạn câu trả lời cuối — dựa `knowledge/prompts/eligibility.md`, đổi sang JSON output thay vì free text) → `app/api/eligibility/route.ts` (orchestrate) → viết lại `hooks/use-eligibility-chat.ts` gọi API thật thay `pickResult()` giả lập, giữ nguyên interface hook nên UI không đổi.
4. Verify (chưa có API key thật nên không thể test đầu-cuối thật): `tsc --noEmit` sạch, `next build` thành công, `npm run lint` sạch (lần đầu chạy — P0 #6 cũ). Dựng 1 route debug tạm gọi trực tiếp `reasonEligibility()`+`factCheck()` với 5 hồ sơ test (4 test case chính thức + 1 case phụ) qua `next dev` thật — cả 5 đúng kỳ vọng, đặc biệt TC-04 (chồng lấp dữ liệu) trả đúng "Thiếu thông tin". Đã xoá route debug sau khi verify. Smoke-test `/api/eligibility` qua `curl` — trả đúng lỗi `LLM_PROVIDER_ERROR` rõ ràng khi thiếu `.env.local`, không crash.
5. Tạo `web/.env.local.example` (không hard-code giá trị đoán cho `FPT_AI_BASE_URL`/`FPT_AI_MODEL` vì không chắc chắn — để trống, ghi chú người dùng tự điền theo tài liệu FPT AI thật).
6. Cập nhật `ai_context/{PROJECT_STATE,TODO_NEXT,TECH_DEBT}.md` phản ánh tiến độ thật.

**Dừng ở đâu:** Pipeline có code đầy đủ nhưng **chưa chạy đầu-cuối được với LLM thật** — thiếu `FPT_AI_API_KEY`/`FPT_AI_BASE_URL`/`FPT_AI_MODEL` (người dùng cần tự điền vào `web/.env.local`, không qua chat). Rủi ro còn treo: chưa xác nhận `web/lib/eligibility/llm.ts` gọi đúng hình dạng API thật của FPT AI Marketplace (giả định `POST {base}/chat/completions` kiểu OpenAI — có thể cần chỉnh lại `callFptAiChat()` khi test với key thật).

**Việc tiếp theo:** Xem `TODO_NEXT.md` mục "Việc ngay tiếp theo" — điền key, chạy `npm run dev`, test qua UI `/eligibility`. Sau khi chạy được: P0 #4 (test case đối kháng) và #5 (rehearsal demo).

---

## Session 3 — 2026-07-18 (Technical Discovery Project Intelligence + research Public Discourse Filter)
**Làm gì:**
1. Đọc `ai_context/*.md` theo đúng thứ tự quy ước (`SESSION_HANDOVER` → `PROJECT_STATE` → `TODO_NEXT`), phát hiện `docs/features/PROJECT_INTELLIGENCE.md` (39KB, BRD mới, chưa commit) không được ghi nhận ở `ai_context/` — đã hỏi người dùng chọn phạm vi làm việc, người dùng chọn **giữ nguyên P0 gốc (Eligibility Checker)**, không mở rộng scope ngay.
2. Theo yêu cầu tường minh sau đó ("Technical Discovery trước triển khai, KHÔNG viết code"), thực hiện 12 bước discovery cho `PROJECT_INTELLIGENCE.md`, sinh 10 file ở `docs/technical/01`–`10`. Quyết định kiến trúc quan trọng nhất: **không dùng Postgres/DB mới** (đi ngược đề xuất mặc định của BRD) — dùng file JSON/TS tĩnh, lý do repo có 0% backend/DB. Khuyến nghị cuối (`10_TECHNICAL_DECISION.md`): nếu Eligibility Checker P0 chưa xong, không bắt đầu Project Intelligence.
3. Đọc & nghiên cứu `docs/features/PUBLIC_DISCOURSE_FILTER.md` (module thứ 3: bộ lọc phát hiện/gắn cờ claim sai lệch trên mạng xã hội về chính sách NOXH, MVP rút gọn tự thân cho "36h") theo yêu cầu "cập nhật toàn bộ context trước khi triển khai" — không viết code. Phát hiện phụ thuộc chéo quan trọng: module này dùng chung node `Project`/`HousingProject` với Project Intelligence và cần Legal KG để validate citation — cả 3 module giờ phụ thuộc lẫn nhau nhưng chưa module nào có tầng dữ liệu thật.
4. Cập nhật toàn bộ file context: `docs/00_MUC_LUC.md`, `docs/00_PROJECT_MEMORY.md`, `ai_context/PROJECT_STATE.md`, `ai_context/TODO_NEXT.md`, `ai_context/TECH_DEBT.md` (mục này). Sửa 1 thông tin lỗi thời: `PROJECT_STATE.md` vẫn ghi "chưa git init" — thực tế git đã init từ trước (1 commit "Initial commit", tracking `origin/main`), không rõ phiên nào đã làm.

**Phát hiện quan trọng khác:**
- `docs/features/`, `docs/technical/` đều **chưa commit** (untracked) tính đến cuối phiên — cần người dùng xác nhận trước khi commit (chưa được yêu cầu commit).
- OPEN QUESTION mới: `PUBLIC_DISCOURSE_FILTER.md` tự ghi "36 giờ còn lại" — chưa rõ có cùng đồng hồ hackathon với 2 module kia không (`docs/00_MUC_LUC.md` mục cuối).

**Dừng ở đâu:** Không có dòng code nào được viết trong phiên này (đúng yêu cầu). Cả 2 module mở rộng vẫn ở trạng thái thiết kế/thảo luận, chưa bắt đầu build. Eligibility Checker P0 vẫn là ưu tiên build tiếp theo, không đổi.

**Việc tiếp theo:** Xem `TODO_NEXT.md` — P0 không đổi; 2 module mở rộng đã chuyển xuống P1 với dependency rõ ràng.

---

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
