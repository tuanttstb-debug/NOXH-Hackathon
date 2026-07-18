# PROJECT_STATE — NOXH Copilot

> Trạng thái hiện tại, có thẩm quyền (authoritative), cập nhật tại chỗ mỗi phiên — không lặp lịch sử ở đây (xem `SESSION_HANDOVER.md`). Ngày cập nhật gần nhất: **2026-07-18**.

## Dự án là gì (1 dòng)
NOXH Copilot — nền tảng AI Legal Knowledge Graph giúp người dân kiểm tra điều kiện thụ hưởng Nhà ở xã hội, trả lời kèm trích dẫn pháp lý, cho hackathon 48h, đội 1–2 người. Chi tiết: `../docs/01_TONG_QUAN_DU_AN.md`.

## Trạng thái tổng quan
| Lớp | Trạng thái | Ghi chú |
|---|---|---|
| Tài liệu nghiệp vụ/kiến trúc (`docs/`, 16 file) | ✅ Hoàn chỉnh | Toàn bộ quyết định kiến trúc (`13_QUYET_DINH_KIEN_TRUC.md`) vẫn ở trạng thái "Đề xuất" — chưa có code hiện thực hoá |
| Tri thức chuyên sâu (`knowledge/`, 24 file) | ✅ Hoàn chỉnh về cấu trúc, ⚠️ dữ liệu chưa xác minh | Xem mục "Dữ liệu pháp lý" bên dưới |
| UI/UX design (`docs/UI/`, 11 file) | ✅ Hoàn chỉnh | Model điều hướng cuối cùng: Thread-based (`docs/UI/11_AI_NATIVE_REDESIGN.md`), không dùng model 7-màn-hình tuần tự ở `docs/UI/06`/`09` nữa |
| Frontend code (`web/`) | 🟡 3/10 màn hình | Next.js 14 + Tailwind, mock data, build/dev chạy được |
| AI Agent pipeline thật | ✅ Verify xong với LLM thật (2026-07-18) | `web/lib/eligibility/{legal-kg,reasoner,llm}.ts` — Parse+Compose gọi FPT AI Marketplace (model `SaoLa3.1-medium`), Validate/legal_reasoner/fact_check là code xác định (không LLM). Chạy thật qua `curl` cho 6 kịch bản (TC-01→06, gồm 2 red-team) — tất cả PASS. **Chưa verify qua UI trình duyệt thật** — xem `TODO_NEXT.md` |
| Backend/API | 🟡 1 route | `POST /api/eligibility` (Next.js Route Handler) — xem `web/app/api/eligibility/route.ts` |
| Tài liệu module mở rộng (`docs/features/`, `docs/technical/`) | 🟡 Thiết kế xong, 0% code | Project Intelligence + Public Discourse Filter — xem mục "Module mở rộng đề xuất" bên dưới |
| Git version control | ✅ Đã init | 1 commit ("Initial commit"), tracking `origin/main` — không rõ session nào đã làm (`SESSION_HANDOVER.md` trước đó vẫn ghi "chưa git init", đã lỗi thời) |
| Test tự động | ❌ Không có | Không tìm thấy file test/verify nào |

## Frontend (`web/`) — chi tiết
**Stack:** Next.js 14.2.5 (App Router) · React 18.3 · TypeScript 5.5 · Tailwind CSS 3.4 (+ `tailwindcss-animate`) · shadcn-style component (`components/ui/`: Button, Card, Badge, Separator qua Radix) · `framer-motion` · `recharts` · `lucide-react`.

**Cấu trúc:** `app/` (route) · `app/api/eligibility/` (Route Handler — pipeline thật, thêm 2026-07-18) · `components/ui/` (primitive) · `features/{landing,eligibility,workspace}/` (component đặc thù màn hình) · `layouts/` (MarketingLayout, WorkspaceLayout, FocusLayout) · `hooks/` (`use-eligibility-chat` — nay gọi API thật, `use-typing-effect`) · `lib/eligibility/` (`legal-kg.ts`, `reasoner.ts`, `llm.ts` — thêm 2026-07-18) · `mock/` (chat-thread, eligibility-checklist, legal-documents — `legal-documents.ts` nay được `lib/eligibility/legal-kg.ts` dùng làm nguồn KG thật, không chỉ mock) · `types/` (chat, legal).

| Màn hình | Route | Trạng thái | Evidence |
|---|---|---|---|
| 1. Landing Page | `/` | ✅ Đã dựng | `EVD/01`–`04` (hero, quick actions, feature grid, architecture section) |
| 2. AI Workspace | `/workspace` | ✅ Đã dựng | `EVD/14`–`20` (overview, insufficient-data, reasoning tab, citations tab, sidebar collapsed, new message reasoning/result) |
| 3. Eligibility Checker | `/eligibility` | ✅ Đã dựng | `EVD/05`–`13` (empty state, reasoning active, 3 verdict: eligible/not-eligible/insufficient-data, checklist, evidence panel) |
| 4. Legal Search | `/legal` | ✅ Đã dựng (2026-07-18) | Tra cứu Legal KG + lịch sử sửa đổi. Không gọi LLM có chủ đích |
| 5. Project Intelligence | `/projects` | 🟡 Code xong, **chờ dữ liệu** | Registry rỗng có chủ đích — xem `web/lib/Projects/DU_LIEU_CAN_CUNG_CAP.md` |
| 6. Public Discourse Filter | `POST /api/discourse` | 🟡 Pipeline xong, **chưa có UI** | Chưa dựng dashboard vì chỉ có dữ liệu giả lập, tài liệu module cấm demo trên dữ liệu giả |
| 7–10 | — | ❌ Chưa làm | Xem `docs/UI/05_SCREEN_LIST.md` |

**Đặc điểm quan trọng:** Màn hình 3 (Eligibility, Focus Mode — không sidebar) tái dùng gần như toàn bộ hạ tầng hội thoại của Màn hình 2 qua hook chung `use-eligibility-chat.ts` — không có luồng chat song song, tránh trùng lặp logic. 2 phần mới thật sự của Màn hình 3: `checklist-card.tsx` (chỉ hiện khi verdict = eligible) và `download-summary-button.tsx` (xuất `.txt` client-side qua `Blob`, không gọi backend).

**Đã build/chạy thử (cập nhật 2026-07-18 sau khi sửa dữ liệu pháp lý):** `tsc --noEmit`, `npm run lint` (0 warning/error), `next build` đều sạch. **Đã chạy thật cả 6 test case (TC-01→06) qua `/api/eligibility` với LLM thật — 6/6 PASS.**
**Cấu hình cần có:** `web/.env.local` với `MKP_API_KEY`/`MKP_API_BASE`/`MKP_API_MODEL` (tên biến đúng là `MKP_*`, không phải `FPT_AI_*` như bản nháp Session 4).
**Chưa test:** Trải nghiệm qua UI trình duyệt thật — xem `TODO_NEXT.md` P0 #5.

## Dữ liệu pháp lý — ✅ ĐÃ CÓ TOÀN VĂN GỐC (cập nhật 2026-07-18)
Người dùng đã cung cấp **14 văn bản gốc** (PDF/DOCX) tại `web/lib/Legal/`. Đây là nguồn có thẩm quyền, thay cho nguồn thứ cấp trước đây.

| Văn bản | Đưa vào KG? | `confidence` trong KG |
|---|---|---|
| Nghị định 136/2026 (Điều 30 k1 — mức trần, và điểm d — hệ số cấp tỉnh) | ✅ | `verified` |
| Nghị định 54/2026 (Điều 29 k1 — nhà ở; Điều 30 k2 — thẩm quyền) | ✅ | `verified` |
| Nghị định 261/2025 (Điều 30 k1–2 — đã hết hiệu lực, giữ để tra lịch sử) | ✅ | `verified` |
| Nghị định 100/2024 (Điều 29 k1 — bản gốc, đã bị sửa) | ✅ | `pending` (chưa đối chiếu toàn văn) |
| 10 văn bản còn lại (Luật 27/2023, Luật 29/2023, NĐ 95/96/192/302, TT 05/09/32/08) | ❌ | Quyết định có chủ đích — không phục vụ P0 |

**Mức trần thu nhập hiện hành** (NĐ 136/2026, Điều 30 khoản 1, hiệu lực 2026-04-07 — thay thế toàn bộ khoản 1):
độc thân **25tr** (điểm a) · độc thân nuôi con **35tr** (điểm a) · đã kết hôn, tổng hai vợ chồng **50tr** (điểm b).
Mức 20/30/40tr của NĐ 261/2025 đã hết hiệu lực.

**~~RISK trọng yếu nhất~~ — ĐÃ BÁC BỎ 2026-07-18:** giả thuyết "NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 nên chưa rõ mức nào áp dụng" **không đúng**. Đối chiếu toàn văn: NĐ 54/2026 sửa **khoản 2** (thẩm quyền xác nhận), NĐ 136/2026 sửa **khoản 1** (mức trần) — hai khoản khác nhau, không chồng lấp. Rủi ro này là sản phẩm của việc đọc nguồn thứ cấp, chưa bao giờ tồn tại trong văn bản thật. `docs/12_QUAN_LY_RUI_RO.md` chưa được sửa theo — xem `TODO_NEXT.md`.

**Giới hạn tri thức CÓ THẬT (thay thế rủi ro trên):** NĐ 136/2026 Điều 30 khoản 1 **điểm d** cho phép UBND cấp tỉnh quyết định hệ số điều chỉnh nâng mức trần theo thu nhập bình quân đầu người địa phương. Mức 25/35/50tr là trần **trung ương**; mức áp dụng thật tại từng tỉnh có thể cao hơn. Registry `provincialCoefficients` trong `web/lib/eligibility/legal-kg.ts` **rỗng có chủ đích** — chưa thu thập được quyết định của UBND tỉnh nào, và cấm điền số ước lượng.

## AI Agent — đặc tả vs thực tế
`knowledge/agents/` mô tả **5 agent**: `legal_reasoner`, `eligibility`, `fact_check`, `legal_diff` (P0), `social_listening` (P2, không làm ở demo). ADR-03 (`../docs/13_QUYET_DINH_KIEN_TRUC.md`) quyết định dùng **1 agent, pipeline tuyến tính 4 bước** thay vì 4 agent tách biệt — quyết định này **đã được hiện thực hoá** (2026-07-18), không còn ở trạng thái "Đề xuất".

**Đúng 2 lệnh gọi LLM thật** trong pipeline: Parse (trích xuất hồ sơ) và Compose (soạn câu trả lời). Toàn bộ phần kết luận pháp lý — Validate, legal_reasoner, fact_check — là **code xác định, không LLM**. Đây là điều khiến TC-05/TC-06 (red-team) không thể fail về mặt cấu trúc: input người dùng không có đường nào ảnh hưởng tới verdict.

⚠️ Lưu ý cho phiên sau: bước Compose **bắt buộc** phải nhận `noi_dung` (nội dung điều khoản) trong payload. Bản đầu chỉ gửi mã văn bản + số điều khoản, buộc LLM phải bịa nội dung luật khi diễn giải — đã sửa 2026-07-18, đừng gỡ trường này.

## Module mở rộng đề xuất (thêm 2026-07-18, chưa build)
| Module | Tài liệu | Trạng thái | Phụ thuộc |
|---|---|---|---|
| Project Intelligence | `../docs/features/PROJECT_INTELLIGENCE.md` | BRD Draft v1.0. Technical Discovery đã xong đầy đủ (`../docs/technical/01`–`10`) — quyết định lưu trữ: JSON/TS tĩnh, không Postgres. 0% code | Legal KG (Eligibility Checker) cho khối Pháp lý |
| Public Discourse Filter | `../docs/features/PUBLIC_DISCOURSE_FILTER.md` | MVP Scope v1.0 (tài liệu tự rút gọn cho "36h còn lại"). Đã đọc/nghiên cứu, chưa có Technical Discovery riêng (tài liệu gốc đã đủ chi tiết để build thẳng — batch pipeline, không realtime, không auto-verify/publish). 0% code | Node `Project`/`HousingProject` (dùng chung với Project Intelligence) + Legal KG (validate `CLAIM_CITES_DOCUMENT`) |

**Cảnh báo**: cả 2 module trên đứng sau Eligibility Checker P0 trong thứ tự ưu tiên (chưa đổi — xem `TODO_NEXT.md`). Không bắt đầu code cho 1 trong 2 module này nếu Eligibility Checker P0 chưa chạy đúng end-to-end, vì cả hai đều phụ thuộc dữ liệu Legal KG mà P0 chịu trách nhiệm hiện thực hoá.

## Design Review (điểm chấm tự dựng, `../docs/16_DESIGN_REVIEW.md`)
Thực hiện **trước** khi có code (`web/` được dựng sau review này). Điểm tại thời điểm review: 15/60 — không phản ánh trạng thái hiện tại (đã có 3 màn hình chạy được). Chưa có review lại sau khi build — nên coi điểm 15/60 là **lịch sử**, không phải điểm hiện hành.

## OPEN QUESTION toàn dự án (chưa trả lời — không tự suy diễn)
Xem đầy đủ ở `../docs/00_PROJECT_MEMORY.md` mục "OPEN QUESTION toàn dự án" (8 câu).

**Đã trả lời 2026-07-18 bằng toàn văn văn bản gốc:**
- ~~Toàn văn hợp nhất mới nhất NĐ 100/2024/NĐ-CP~~ → đã có đủ chuỗi sửa đổi 100/2024 → 261/2025 → 54/2026 → 136/2026 tại `web/lib/Legal/`.
- ~~Mức trần nhóm "độc thân nuôi con"/"đã kết hôn" có bị NĐ 136/2026 sửa không~~ → **CÓ**, sửa cả 3 nhóm: 25/35/50tr.

**Còn treo:**
1. Mốc thời gian 48h chính xác + rubric chấm điểm (nếu có).
2. Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng.
3. Thời lượng demo trước giám khảo.
