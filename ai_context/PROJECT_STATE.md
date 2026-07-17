# PROJECT_STATE — NOXH Copilot

> Trạng thái hiện tại, có thẩm quyền (authoritative), cập nhật tại chỗ mỗi phiên — không lặp lịch sử ở đây (xem `SESSION_HANDOVER.md`). Ngày cập nhật gần nhất: **2026-07-17**.

## Dự án là gì (1 dòng)
NOXH Copilot — nền tảng AI Legal Knowledge Graph giúp người dân kiểm tra điều kiện thụ hưởng Nhà ở xã hội, trả lời kèm trích dẫn pháp lý, cho hackathon 48h, đội 1–2 người. Chi tiết: `../docs/01_TONG_QUAN_DU_AN.md`.

## Trạng thái tổng quan
| Lớp | Trạng thái | Ghi chú |
|---|---|---|
| Tài liệu nghiệp vụ/kiến trúc (`docs/`, 16 file) | ✅ Hoàn chỉnh | Toàn bộ quyết định kiến trúc (`13_QUYET_DINH_KIEN_TRUC.md`) vẫn ở trạng thái "Đề xuất" — chưa có code hiện thực hoá |
| Tri thức chuyên sâu (`knowledge/`, 24 file) | ✅ Hoàn chỉnh về cấu trúc, ⚠️ dữ liệu chưa xác minh | Xem mục "Dữ liệu pháp lý" bên dưới |
| UI/UX design (`docs/UI/`, 11 file) | ✅ Hoàn chỉnh | Model điều hướng cuối cùng: Thread-based (`docs/UI/11_AI_NATIVE_REDESIGN.md`), không dùng model 7-màn-hình tuần tự ở `docs/UI/06`/`09` nữa |
| Frontend code (`web/`) | 🟡 3/10 màn hình | Next.js 14 + Tailwind, mock data, build/dev chạy được |
| AI Agent pipeline thật | ❌ 0% | Chưa có lệnh gọi LLM nào — xem `TECH_DEBT.md` |
| Backend/API | ❌ Không tồn tại | Toàn bộ logic hiện tại chạy client-side trên mock data |
| Git version control | ❌ Chưa init | Thư mục gốc dự án không phải git repo |
| Test tự động | ❌ Không có | Không tìm thấy file test/verify nào |

## Frontend (`web/`) — chi tiết
**Stack:** Next.js 14.2.5 (App Router) · React 18.3 · TypeScript 5.5 · Tailwind CSS 3.4 (+ `tailwindcss-animate`) · shadcn-style component (`components/ui/`: Button, Card, Badge, Separator qua Radix) · `framer-motion` · `recharts` · `lucide-react`.

**Cấu trúc:** `app/` (route) · `components/ui/` (primitive) · `features/{landing,eligibility,workspace}/` (component đặc thù màn hình) · `layouts/` (MarketingLayout, WorkspaceLayout, FocusLayout) · `hooks/` (`use-eligibility-chat`, `use-typing-effect`) · `mock/` (chat-thread, eligibility-checklist, legal-documents) · `types/` (chat, legal).

| Màn hình | Route | Trạng thái | Evidence |
|---|---|---|---|
| 1. Landing Page | `/` | ✅ Đã dựng | `EVD/01`–`04` (hero, quick actions, feature grid, architecture section) |
| 2. AI Workspace | `/workspace` | ✅ Đã dựng | `EVD/14`–`20` (overview, insufficient-data, reasoning tab, citations tab, sidebar collapsed, new message reasoning/result) |
| 3. Eligibility Checker | `/eligibility` | ✅ Đã dựng | `EVD/05`–`13` (empty state, reasoning active, 3 verdict: eligible/not-eligible/insufficient-data, checklist, evidence panel) |
| 4–10 (Legal Search, v.v.) | — | ❌ Chưa làm | Xem `web/README.md`, `docs/UI/05_SCREEN_LIST.md` |

**Đặc điểm quan trọng:** Màn hình 3 (Eligibility, Focus Mode — không sidebar) tái dùng gần như toàn bộ hạ tầng hội thoại của Màn hình 2 qua hook chung `use-eligibility-chat.ts` — không có luồng chat song song, tránh trùng lặp logic. 2 phần mới thật sự của Màn hình 3: `checklist-card.tsx` (chỉ hiện khi verdict = eligible) và `download-summary-button.tsx` (xuất `.txt` client-side qua `Blob`, không gọi backend).

**Đã build/chạy thử:** `next build` và `next dev` thành công cho cả 3 route (theo `web/README.md`). `web/.next/` tồn tại, xác nhận từng build ít nhất 1 lần.
**Chưa chạy:** `npm run lint` (ESLint đã cấu hình nhưng chưa từng chạy trong phiên phát triển ghi nhận).

## Dữ liệu pháp lý (`knowledge/phap_ly/`)
| Văn bản | File | `do_tin_cay` |
|---|---|---|
| Luật Nhà ở 2023 | `luat/luat_nha_o_2023.md` | Đang xác minh |
| Nghị định 100/2024/NĐ-CP | `nghi_dinh/nghi_dinh_100_2024.md` | Đang xác minh |
| Nghị định 261/2025 | `nghi_dinh/nghi_dinh_261_2025.md` | Đang xác minh |
| Nghị định 54/2026 | `nghi_dinh/nghi_dinh_54_2026.md` | Đang xác minh |
| Nghị định 136/2026 | `nghi_dinh/nghi_dinh_136_2026.md` | Đang xác minh |

**RISK trọng yếu nhất (chưa xử lý):** NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 NĐ 100/2024/NĐ-CP nhưng khác khía cạnh nội dung — chưa có toàn văn hợp nhất, chưa đối chiếu Công báo. Đây là điểm chặn để coi Knowledge Graph đáng tin cậy (chi tiết: `../docs/12_QUAN_LY_RUI_RO.md`).

## AI Agent — đặc tả vs thực tế
`knowledge/agents/` mô tả **5 agent**: `legal_reasoner`, `eligibility`, `fact_check`, `legal_diff` (P0), `social_listening` (P2, không làm ở demo). ADR-03 (`../docs/13_QUYET_DINH_KIEN_TRUC.md`) đã quyết định dùng **1 agent, pipeline tuyến tính 4 bước** thay vì 4 agent tách biệt — nhưng quyết định này ở trạng thái "Đề xuất", **chưa có code nào hiện thực** pipeline này, dù 1 hay 4 agent. Toàn bộ phần "AI" hiện tại trong `web/` là mock data tĩnh + hiệu ứng typing giả lập (`use-typing-effect.ts`), không có lệnh gọi LLM thật.

## Design Review (điểm chấm tự dựng, `../docs/16_DESIGN_REVIEW.md`)
Thực hiện **trước** khi có code (`web/` được dựng sau review này). Điểm tại thời điểm review: 15/60 — không phản ánh trạng thái hiện tại (đã có 3 màn hình chạy được). Chưa có review lại sau khi build — nên coi điểm 15/60 là **lịch sử**, không phải điểm hiện hành.

## OPEN QUESTION toàn dự án (chưa trả lời — không tự suy diễn)
Xem đầy đủ ở `../docs/00_PROJECT_MEMORY.md` mục "OPEN QUESTION toàn dự án" (8 câu). Quan trọng nhất cho việc build tiếp:
1. Toàn văn hợp nhất mới nhất NĐ 100/2024/NĐ-CP.
2. Mốc thời gian 48h chính xác + rubric chấm điểm (nếu có).
3. Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng.
