# TECH_DEBT — NOXH Copilot

> Nợ kỹ thuật đã biết, ghi nhận có chủ đích để không lặp lại phát hiện ở mỗi phiên. Không phải TODO (xem `TODO_NEXT.md` cho thứ tự ưu tiên xử lý) — file này chỉ liệt kê VẤN ĐỀ và bối cảnh. Cập nhật gần nhất: **2026-07-18**.

## Nghiêm trọng — ảnh hưởng trực tiếp uy tín demo

### 1. ~~Không có lệnh gọi LLM/AI thật nào~~ — ĐÃ CÓ CODE (2026-07-18), chưa test với key thật
Trước 2026-07-18: toàn bộ nhãn "AI Agent" trong `web/` là mock data tĩnh + hiệu ứng typing giả lập — rủi ro **"Potemkin AI"** (`../docs/16_DESIGN_REVIEW.md`).
**Hiện tại:** `web/lib/eligibility/{legal-kg,reasoner,llm}.ts` + `web/app/api/eligibility/route.ts` hiện thực hoá đúng pipeline `knowledge/agents/eligibility.md`: Parse (1 lệnh gọi LLM thật — FPT AI Marketplace) → Validate/legal_reasoner/fact_check (code xác định, không LLM — xem lý do trong comment `reasoner.ts`, đây là cải tiến so với spec gốc vốn dùng LLM cho phép kiểm #3 của fact_check, xem mục 5 bên dưới) → soạn câu trả lời (1 lệnh gọi LLM thật). Nếu giám khảo hỏi "cho xem AI chạy ở đâu", câu trả lời trung thực bây giờ là: đúng 2 lệnh gọi LLM thật trong pipeline, phần suy luận pháp lý (verdict) là code xác định có căn cứ từ Knowledge Graph — không phải 4 agent tách biệt như đặc tả `knowledge/agents/` mô tả (đã cố ý đơn giản hoá theo ADR-03).
**~~Còn thiếu để hết nợ hoàn toàn~~ — ĐÃ XONG (Session 5 + 6):** endpoint đã xác minh thật (`POST {MKP_API_BASE}/v1/chat/completions`), và cả 6 test case đã chạy thật với LLM production — 6/6 PASS. Nợ này coi như đã trả xong ở tầng API. Chỉ còn thiếu xác nhận qua UI trình duyệt (`TODO_NEXT.md` P0 #5).

### 2. ~~Không có git repository~~ — THÔNG TIN ĐÃ LỖI THỜI (sửa 2026-07-18)
Git đã được init từ trước (1 commit "Initial commit", tracking `origin/main`) — xem `PROJECT_STATE.md`. Mục này giữ lại để không ai điều tra lại.
**~~Nợ còn thật~~ — ĐÃ TRẢ (2026-07-18, Session 9).** Ghi chú cũ "toàn bộ thay đổi từ Session 4 đến nay chưa commit" **đã lỗi thời và từng gây hiểu nhầm**: thực tế Session 4→7 nằm trong commit `2c29969`, chỉ Session 8 còn treo. Session 8+9 đã commit và push. Không còn thay đổi nào chưa có điểm rollback.

### 3. Knowledge Graph không phải cấu trúc dữ liệu truy vấn được
`knowledge/phap_ly/*.md` là văn bản Markdown mô tả, không phải schema/DB có thể query bằng code. ADR-02 (`../docs/13_QUYET_DINH_KIEN_TRUC.md`) chấp nhận điều này có chủ đích cho quy mô demo 48h ("không cần Graph DB đầy đủ") — nhưng tính đến thời điểm này, kể cả "cấu trúc đơn giản dạng bảng" mà ADR-02 mô tả cũng **chưa được hiện thực hoá**, chỉ có Markdown thuần.
**Đánh đổi đã chấp nhận:** Không thể hiện được graph traversal thật ở demo — cần nói rõ với giám khảo đây là lựa chọn có chủ đích, không phải thiếu sót (theo đúng tinh thần ADR-02).

## Trung bình — ảnh hưởng chất lượng, chưa chặn demo

### 4. ~~Dữ liệu pháp lý chưa xác minh nguồn gốc~~ — ĐÃ XỬ LÝ cho phần P0 (2026-07-18)
Người dùng cung cấp 14 văn bản gốc tại `web/lib/Legal/`. Đã đối chiếu toàn văn 4 văn bản lõi và cập nhật KG (`confidence: "verified"`).

**Nợ này đã gây thiệt hại thật trước khi được xử lý** — ghi lại để rút kinh nghiệm:
- Code trả kết quả **sai luật** cho 2/3 nhóm đối tượng (dùng trần 30tr/40tr của NĐ 261/2025 đã hết hiệu lực thay vì 35tr/50tr của NĐ 136/2026).
- Dự án dành công sức thiết kế cả một kịch bản demo trọng tâm (TC-04) quanh một rủi ro **không tồn tại** — "chồng lấp NĐ 54/136" là sản phẩm của nguồn thứ cấp, hai văn bản sửa hai khoản khác nhau.
- Bài học: dữ liệu "đang xác minh" không chỉ làm giảm độ tin cậy, nó còn có thể **định hướng sai kiến trúc và kịch bản demo**. Nếu tiếp tục dùng nguồn thứ cấp cho 10 văn bản còn lại, khả năng lặp lại là cao.

**Còn lại:** `art-dieu-29-k1-nd100` vẫn `confidence: "pending"` (chưa đối chiếu toàn văn NĐ 100/2024 — file đã trích text sẵn, chỉ chưa đọc). Điều này không dùng làm căn cứ kết luận nên không chặn.

### 5. ~~Fact-check dùng AI kiểm tra AI cho 1/3 phép kiểm~~ — ĐÃ SỬA trong code thật (2026-07-18)
`knowledge/agents/fact_check.md` (spec gốc) thiết kế phép kiểm #3 (khớp logic) dùng LLM — không phải kiểm chứng độc lập thật sự. Khi hiện thực hoá (`web/lib/eligibility/reasoner.ts`), đã **không copy nguyên spec này**: verdict được tính trực tiếp bằng code xác định từ cùng 1 bản ghi ngưỡng đang trích dẫn (`reasonEligibility()`), không qua bước LLM suy luận riêng có thể lệch khỏi nguồn — nên phép kiểm #3 đúng bằng cấu trúc, không cần chạy runtime. `factCheck()` chỉ còn thực thi phép kiểm #1 (tồn tại) và #2 (hiệu lực), cả hai đều là code thuần. Xem comment trong `reasoner.ts` để biết chi tiết.

### 6. ~~Chưa từng chạy ESLint~~ — ĐÃ XỬ LÝ (2026-07-18)
`npm run lint` đã chạy nhiều lần, 0 warning/error. `web/README.md` vẫn còn ghi chú lỗi thời rằng chưa từng chạy — chưa sửa (ngoài phạm vi được yêu cầu).

### 7. Test tự động — đã có 1 file đầu tiên (2026-07-18, Session 9), phủ sóng vẫn hẹp
**Mới:** `web/verify-ui-rehearsal.mjs` — test đầu-cuối **có assertion** qua trình duyệt thật (Chrome headless qua `puppeteer-core`), exit code 1 nếu fail, 16 phép kiểm trên `/eligibility`. Khác hẳn `screenshot.mjs`/`screenshot-landing.mjs`/`debug-opacity.mjs` vốn chỉ chụp ảnh không assert.

**Nợ còn lại:** chỉ phủ `/eligibility`. **Chưa có test tự động cho** `/legal`, `/projects`, `/api/discourse`, và pipeline discourse. Không có unit test cho `reasoner.ts` (phần code xác định quyết định verdict — đáng test nhất vì logic thuần, không cần LLM, chạy nhanh). Cũng chưa nối vào CI (chưa có CI).

⚠️ Lưu ý khi viết thêm test UI: `ReasoningTrace` render **4 nút tròn** nhưng chỉ hiện **một nhãn chữ tại một thời điểm** (`currentLabel`) — assert theo `innerText` sẽ fail nhầm. Phải đếm node DOM. Đã mắc lỗi này 1 lần ở Session 9.

## Trung bình (thêm 2026-07-18) — rủi ro lập kế hoạch, chưa ảnh hưởng demo hiện tại

### 10. 3 sáng kiến cùng tồn tại ở trạng thái thiết kế, chưa sáng kiến nào có tầng dữ liệu thật
Eligibility Checker (P0 gốc), Project Intelligence, và Public Discourse Filter đều có tài liệu thiết kế đầy đủ nhưng **0% dữ liệu/code chung**. 2 module sau phụ thuộc lẫn nhau (node `Project`/`HousingProject` dùng chung) và phụ thuộc vào Legal KG của module đầu — nếu một phiên làm việc sau này bắt đầu code cho Project Intelligence hoặc Public Discourse Filter trước khi Legal KG của Eligibility Checker tồn tại thật, sẽ phải xây tạm 1 phiên bản Legal KG khác rồi hợp nhất lại sau — lãng phí công sức đã được cảnh báo trước ở `../docs/technical/07_IMPLEMENTATION_PLAN.md`.
**Vì sao chưa xử lý:** Đây là hệ quả của việc lập kế hoạch song song cho nhiều module (được yêu cầu tường minh, không phải tự phát sinh) — không phải lỗi, nhưng cần người điều phối (chủ dự án) xác nhận thứ tự trước khi bất kỳ phiên nào bắt đầu code cho module thứ 2/3.

## Thấp — ghi nhận, không cần xử lý gấp

### 8. Không có quản lý secret/API key
Chưa có `.env.example` hay tài liệu nào mô tả cách truyền API key LLM khi P0 #1/#2 (`TODO_NEXT.md`) được triển khai. Cần thiết lập trước khi nối API thật, tránh hard-code key vào code (rủi ro bảo mật nếu sau này đẩy lên git công khai).

### 9. Font qua system stack thay vì `next/font/google`
Quyết định có chủ đích (build không phụ thuộc mạng) — không phải nợ cần xử lý, ghi lại để không ai "fix" nhầm thành lỗi trong phiên sau. Xem chú thích trong `web/app/layout.tsx`.
