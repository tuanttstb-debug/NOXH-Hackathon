# SESSION_HANDOVER — NOXH Copilot

> Nhật ký từng phiên làm việc, **mới nhất ở trên cùng**. Đọc file này đầu tiên khi bắt đầu phiên mới, sau đó mới đọc `PROJECT_STATE.md` (trạng thái hiện tại) và `TODO_NEXT.md` (việc cần làm tiếp). File này KHÔNG thay thế `../docs/00_PROJECT_MEMORY.md` (neo trí nhớ nghiệp vụ/kiến trúc) — hai file bổ sung cho nhau: `00_PROJECT_MEMORY.md` trả lời "dự án là gì, đã quyết định gì", file này trả lời "phiên trước đã làm gì, dừng ở đâu".

## Session 10 — 2026-07-19 (Hội thoại nhiều lượt — trả lời OPEN QUESTION #2 treo từ Session 4)

**Bối cảnh:** Người dùng báo hệ thống "trả lời thành từng câu đơn lẻ, không ghép nối được dữ liệu giữa các lượt" và "không phân biệt nổi 2 vợ chồng = đã kết hôn", yêu cầu tuning NLU "đạt chuẩn ChatGPT".

**ĐO TRƯỚC KHI SỬA — và kết quả lật ngược chẩn đoán ban đầu:**
Chạy 12 câu tiếng Việt đời thường qua bước Parse: **12/12 ĐÚNG**, gồm cả `"2 vợ chồng tôi"`, `"Nhà em có 2 vợ chồng"`, `"Tôi lấy vợ rồi, hai đứa được 40 triệu"`, `"18 củ"` (tiếng lóng), `"18 triệu rưỡi"` (số lẻ), `"một mình nuôi 2 đứa nhỏ"`. **NLU không hề hỏng.** Nếu đã đi tinh chỉnh prompt/đổi model theo báo cáo ban đầu thì sẽ tốn công mà không sửa được gì.

**Nguyên nhân thật — mất ngữ cảnh giữa các lượt:** `use-eligibility-chat.ts` chỉ gửi `{message}`, route chỉ đọc `body.message`. Lượt 4 ("Chúng tôi chưa có nhà") xoá sạch hôn nhân + thu nhập đã khai ở lượt 2-3 → vĩnh viễn `insufficient_data`. Triệu chứng "không hiểu 2 vợ chồng" chỉ là **hệ quả** của việc này. **Bài học: đo trước, đừng sửa theo mô tả triệu chứng.**

**Quyết định của người dùng (đóng OPEN QUESTION #2):** agent **CÓ hỏi lại** đúng trường còn thiếu; áp dụng cho **cả `/eligibility` và `/workspace`**.

**Đã làm:**
1. `mergeProfile()` (`reasoner.ts`) — gộp hồ sơ tích luỹ, **code xác định**. Quy tắc: giá trị mới khác null ghi đè giá trị cũ (nhờ đó câu sửa sai "à nhầm, 45 triệu" hoạt động tự nhiên).
2. Route nhận `knownProfile`, trả `profile` đã gộp + `followUpQuestion`. Câu hỏi gợi mở đặt ở **tầng code** (`FOLLOW_UP_QUESTIONS`), không để LLM tự nghĩ — đảm bảo hỏi đúng trường mà `findMissingFields()` xác định. Hỏi **từng câu một**, không dồn 3 câu.
3. Hook giữ `profile` giữa các lượt + `reset()`.
4. UI: thanh "Hồ sơ đã ghi nhận" + nút "Bắt đầu hồ sơ mới" — người dùng **thấy** hệ thống đang nhớ gì và sửa được.

**Vì sao KHÔNG nhồi lịch sử hội thoại cho LLM:** giữ nguyên tắc "LLM trích xuất, code quyết định". Nhồi lịch sử làm hồ sơ trôi theo cách diễn đạt và có thể phá tính chất "input người dùng không đổi được verdict" (TC-05/TC-06). Cách hiện tại cũng không tốn thêm token theo độ dài hội thoại.

**Verify:** `verify-multiturn.mjs` (mới) **14/14 PASS** — giữ ngữ cảnh, hỏi đúng trường thiếu, ghi đè khi sửa, hồi quy NLU 6/6, **red-team mở rộng qua nhiều lượt vẫn không đổi được verdict**, tương thích ngược khi không gửi `knownProfile`. `verify-ui-rehearsal.mjs` mở rộng lên **21/21 PASS**. `tsc` sạch · `lint` 0 lỗi · `next build` 10 route.

**2 bug trong chính bộ test (không phải lỗi sản phẩm) — đã sửa:**
- `readVerdict()` lấy h3 **đầu tiên**; hội thoại nhiều lượt có nhiều khối kết quả nên nó đọc nhầm kết quả lượt 1 và báo fail oan.
- `waitVerdict()` chỉ chờ "có ít nhất 1 khối kết quả" → trả về ngay vì khối của lượt trước vẫn còn trên trang. Đã đổi sang chờ **số khối tăng lên**.
- Ngoài ra bộ lọc lỗi console không loại được favicon vì URL nằm ở `location()` chứ không nằm trong text; listener lại gắn **sau** `goto` nên bỏ lọt lỗi lúc tải trang đầu. Đã sửa cả hai.

⚠️ **Lưu ý môi trường:** chạy `verify-ui-rehearsal.mjs` **ngay sau khi sửa file `.tsx`** có thể fail giả (timeout ở lượt đầu) vì Next.js đang biên dịch lại và hot-reload nuốt mất input đã gõ. Chạy lại lần 2 là sạch — đừng vội kết luận có bug.

**Việc tiếp theo:** (1) quyết định số phận Public Discourse Filter (xem Session 9); (2) dữ liệu dự án → `web/lib/Projects/`; (3) rotate `MKP_API_KEY`; (4) cân nhắc thêm `favicon.ico` (đang 404, tiểu tiết nhưng giám khảo có thể thấy).

---

## Session 9 — 2026-07-18 (Đóng P0 #5 bằng test tự động qua trình duyệt + commit Session 8)

**Bối cảnh:** Tiếp nối Session 8 (dừng giữa chừng để đổi model). Người dùng yêu cầu test kỹ tại local trước khi commit.

**Sửa 1 thông tin sai trong chính tài liệu này:** `TECH_DEBT.md` #2 ghi "toàn bộ thay đổi từ Session 4 đến nay chưa commit" — **đã lỗi thời**. Thực tế Session 4→7 đã nằm trong commit `2c29969`; chỉ Session 8 chưa commit. Đã sửa.

**Đã làm:**
1. **Verify tĩnh:** `tsc --noEmit` sạch · `npm run lint` 0 lỗi · `next build` thành công (10 route).
2. **Smoke test runtime `/api/discourse`** — Session 8 sửa route + `sources.ts` nhưng **chưa từng chạy runtime** (build sạch không chứng minh chạy đúng). Chạy thật trên dữ liệu đĩa: 11 tin RSS → 11 claim → 0 P1, `perSource: {rss-posts.json: 11}`, `invalidDropped: 0`. **Tái hiện chính xác kết quả Session 8.**
3. **Smoke test `/api/eligibility`** cặp TC-02/TC-04 với LLM thật — verdict lật đúng (`not_eligible` → `insufficient_data`).
4. **✅ ĐÓNG P0 #5** — việc P0 cuối cùng còn treo từ Session 5. Viết `web/verify-ui-rehearsal.mjs`: test **có assertion** (không phải script chụp ảnh như `screenshot.mjs`), tự khởi chạy Chrome qua `puppeteer-core` + `headless: "new"`, exit code 1 nếu fail. **16/16 PASS.** Kiểm: HTTP 200, composer, reasoningSteps, verdict 3 kịch bản, citation card + link "Văn bản gốc", threshold bar `30/25tr`, checklist khi đủ điều kiện, 0 lỗi JS runtime, và **verdict lật TC-02↔TC-04 quan sát trên UI thật**. Đã xem ảnh xác nhận bằng mắt.

**1 assertion sai do tôi hiểu nhầm thiết kế (không phải bug sản phẩm):** ban đầu assert "4 nhãn reasoning xuất hiện trong `innerText`" → FAIL. Đọc `features/workspace/reasoning-trace.tsx` mới thấy component render **4 nút tròn** nhưng chỉ hiện **một nhãn chữ tại một thời điểm** (`currentLabel`) — có chủ đích. Đã sửa assertion sang đếm node DOM + trạng thái `done`. **Bài học: khi test fail, đọc component trước khi kết luận là bug.**

**Phát hiện cần người dùng biết:** thư mục `EVD/` **chỉ còn 3 file** (ảnh rehearsal vừa tạo). **20 ảnh evidence gốc `EVD/01`–`20` mà `PROJECT_STATE.md` tham chiếu không còn tồn tại** — không rõ bị xoá lúc nào (chưa từng được commit nên không truy được). Không tự tạo lại vì đó là evidence của các phiên trước. Nếu cần cho demo, chạy lại `web/screenshot.mjs` (lưu ý script này trỏ `localhost:3001` và cần Chrome mở sẵn port 9222).

5. **✅ Crawl YouTube chạy thật lần đầu — 205 bình luận.** Bước cuối cùng còn thiếu của Session 8.
   - **Chẩn đoán key mất nhiều lượt vì tôi sai quy trình:** API trả `API_KEY_SERVICE_BLOCKED` suốt 4 lượt. Tôi đi truy vết cấu hình Google Cloud (bật API, restriction trên key) trong khi nguyên nhân thật là **`.env.local` chưa hề được lưu** — key trong file không đổi suốt 55 phút. **Bài học: khi người dùng nói "đã cập nhật key", việc ĐẦU TIÊN phải là in vân tay key trong file và so với lần trước**, chứ không phải gọi API rồi suy diễn từ mã lỗi. Đã áp dụng và phát hiện ra ngay.
   - Phân biệt 2 mã lỗi Google (hữu ích cho lần sau): `SERVICE_DISABLED` = API chưa bật trên project; `API_KEY_SERVICE_BLOCKED` = API đã bật nhưng key bị chặn service. Ta gặp cái thứ hai.
   - Chạy `--max-videos 60 --max-comments 100`: **205 bình luận / 60 video**, tốn **3/100 search · 60/10.000 unit**. Nhiều kênh báo tắt bình luận nên ~40 video trả 0.
6. **Chạy pipeline trên dữ liệu thật: 216 bài → 63 qua bộ lọc → 59 claim → 0 P1.**
   **Đã chứng minh "0 P1" là kết quả THẬT, không phải rule hỏng:** bơm 6 bài dựng riêng (cùng nội dung sai lệch, 2 channel, ngôn ngữ tuyệt đối) → **P1 kích hoạt đúng** (`surging`, 5 lượt/2 kênh). Rule chạy tốt.
   **Lý do thật — phát hiện quan trọng nhất về module này:** bình luận dưới video chính sách NOXH gần như toàn là **câu hỏi về hoàn cảnh cá nhân** ("sổ đỏ đứng tên bà nội chồng thì có mua được không?"), người ta **hỏi** chứ không **khẳng định**. Bộ lọc lại được thiết kế để bắt khẳng định sai lệch lan nhanh.
   **Rào cấu trúc:** `surging` cần `spreadBreadth >= 2` (`analyze.ts:74`) = cùng claim xuất hiện ở 2 channel. Chỉ có YouTube + báo chí thì gần như bất khả. **Muốn module có tín hiệu thật phải có nguồn thứ 3** (Facebook/Threads qua `manual-posts.json`) — đó mới là nơi tin sai lệch NOXH thực sự sống.
   **Khiếm khuyết đo được:** 6 bài **giống hệt nhau từng ký tự** vẫn tách thành 2 claim (5+1) — clustering không ổn định kể cả với input trùng khớp tuyệt đối. Cụ thể hơn ghi chú Session 7.
7. **Quyết định bảo mật dữ liệu:** `youtube-posts.json` (205 bình luận người thật, kèm URL định danh tài khoản, nhiều bài kể chi tiết hoàn cảnh riêng; quét thấy 1 SĐT + 1 chuỗi giống số giấy tờ) **đã đưa vào `.gitignore`** cùng `manual-posts.json`. Người dùng chọn phương án này. Lý do: `redactPii()` chỉ chạy lúc PHÂN TÍCH, còn crawler ghi text THÔ xuống đĩa — commit lên GitHub là tái xuất bản dữ liệu cá nhân. `youtube-video-cache.json` vẫn commit (metadata video công khai, và giúp lần sau `--no-search` khỏi tốn bucket).

**Dừng ở đâu:** Session 8 + 9 đã commit và push. P0 **hoàn tất 6/6**. Crawler YouTube đã chạy thật.

**Việc tiếp theo:** (1) **quyết định số phận Public Discourse Filter** — YouTube đã chứng minh không sinh được P1 vì bản chất dữ liệu; hoặc bổ sung nguồn Facebook/Threads qua `manual-posts.json`, hoặc trình bày trung thực với giám khảo rằng "không có tin sai lệch lan nhanh" chính là kết quả hợp lệ; (2) dữ liệu dự án → `web/lib/Projects/`; (3) dashboard UI Discourse Filter; (4) rotate `MKP_API_KEY`; (5) cân nhắc dựng lại bộ ảnh `EVD/`.

---

## Session 8 — 2026-07-18 (Crawl dữ liệu mạng xã hội — nghiên cứu + triển khai; dừng giữa chừng để đổi model)

**Kết luận nghiên cứu quan trọng nhất — Facebook/TikTok đã đóng với cuộc thi này:**
| Nguồn | Trạng thái 7/2026 | Dùng được? |
|---|---|---|
| CrowdTangle | Meta đóng 14/8/2024 | ❌ không tồn tại |
| Meta Content Library | Chỉ học viện/NPO đã thẩm định; từ 1/2026 thu **$371/tháng + $1.000 khởi tạo** | ❌ |
| TikTok Research API | Duyệt ~**4 tuần**, loại tường minh bên thương mại | ❌ |
| Facebook Graph API | Bỏ public post search từ 2018 | ❌ |
| **YouTube Data API v3** | Miễn phí, không cần duyệt | ✅ **nguồn MXH khả dụng duy nhất** |

**Quota YouTube (đã đổi 01/06/2026 — tách bucket riêng, thông tin này mới hơn cutoff của model):**
`search.list` có bucket riêng ~**100 lần/ngày** (đây là thứ khan hiếm duy nhất); `commentThreads.list` = 1 unit trong pool 10.000/ngày ⇒ tới **~1.000.000 bình luận/ngày**. Nhu cầu dự án dùng **<1% quota/ngày**. Crawler đã cache `videoId` để lần chạy sau không tốn lần search nào (`--no-search`).

**Đã làm:**
1. `web/scripts/crawl-youtube.mjs` — search theo 4 từ khoá NOXH → `commentThreads` → `RawPost` JSON, có cache đĩa + quota accounting + xử lý video tắt bình luận. **CHƯA CHẠY THẬT — thiếu `YOUTUBE_API_KEY`.** Mới `node --check` cú pháp. Hướng dẫn lấy key: `web/data/discourse/HUONG_DAN_YOUTUBE_API.md`.
2. `web/scripts/crawl-rss.mjs` — 5 feed báo VN đã kiểm chứng 200. **Đã chạy thật: 11 tin NOXH.**
3. `web/lib/discourse/sources.ts` — gộp 3 nguồn (youtube/manual/rss) từ `web/data/discourse/`, validate và loại bản ghi thiếu trường. API `/api/discourse` nay **mặc định dùng dữ liệu thật trên đĩa**, fixture giả lập chỉ chạy khi yêu cầu tường minh.
4. `web/data/discourse/manual-posts.example.json` — mẫu để người dùng dán bài FB/TikTok thật.

**Đã chạy pipeline thật trên 11 tin RSS: 11 claim, 0 cái bị gắn cờ P1** — và đó là kết quả ĐÚNG: báo chí có dẫn nguồn, không dùng ngôn ngữ tuyệt đối, không lược điều kiện. Bộ phân loại không gắn cờ nhầm báo chí chính thống. Nhưng cũng xác nhận: **RSS không sinh tín hiệu sai lệch**, chỉ nội dung người dùng viết (bình luận YouTube) mới tạo được P1.

**3 bug/vấn đề môi trường phát hiện khi chạy thật:**
- Crawler RSS ban đầu ghi ra **1 tin thay vì 11**: `postId` lấy 20 ký tự đầu của base64(link), mà link cùng site chung tiền tố nên base64 trùng → khử trùng lặp xoá nhầm. Đã đổi sang SHA1 toàn bộ link.
- `baochinhphu.vn` và `xaydungchinhsach.chinhphu.vn` **không phát hành RSS** (mọi đường dẫn 404) — dù là nguồn chính thống tốt nhất về nội dung. Muốn lấy phải parse HTML, chưa làm.
- **`node_modules/@types/node` cài thiếu file**: có `fs.d.ts` nhưng mất hẳn thư mục `fs/`, nên `import từ "fs/promises"` (cả dạng có/không tiền tố `node:`) đều lỗi TS2307. Đã né bằng `import { promises as fs } from "fs"`. Chạy `npm install` lại có thể khôi phục đủ, chưa thử.

**Phát hiện phụ có giá trị:** tin RSS lấy về chứa **dữ liệu dự án NOXH thật có nguồn** (Bình Quới - Thanh Đa ~5.900–6.000 căn, Đà Nẵng 680 căn gần Hội An) — dùng được cho Project Intelligence vốn đang chờ dữ liệu.
**Phát hiện phụ 2:** `puppeteer-core` đã nằm trong devDependencies và repo có sẵn `web/screenshot.mjs` — nghĩa là **P0 #5 (rehearsal qua UI) có thể tự động hoá được**, trái với ghi chú các phiên trước rằng "AI không có công cụ trình duyệt". Chưa thử.

**Dừng ở đâu:** Người dùng yêu cầu tạm dừng để đổi model. `tsc` sạch · `lint` 0 lỗi · `next build` thành công. **Chưa commit** phần Session 8.

**Việc tiếp theo:** (1) lấy `YOUTUBE_API_KEY` rồi chạy `node scripts/crawl-youtube.mjs` — đây là bước duy nhất còn thiếu để có dữ liệu sinh được P1; (2) dán bài FB/TikTok thật vào `manual-posts.json`; (3) dựng dashboard UI cho Discourse Filter (giờ đã có dữ liệu thật nên hết lý do hoãn); (4) commit.

---

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
