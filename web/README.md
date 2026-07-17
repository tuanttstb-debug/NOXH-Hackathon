# NOXH Copilot — UI Prototype

Prototype giao diện cho AI Legal Intelligence Platform. Không có backend/API thật — toàn bộ dữ liệu là mock (`mock/`), đủ để demo UX đầu-cuối.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu trúc thư mục
```
app/          Route Next.js App Router (từng màn hình)
components/   UI primitive tái sử dụng (shadcn-style: Button, Card, Badge...)
features/     Component đặc thù theo màn hình (vd. features/landing/*)
layouts/      Khung trang (MarketingLayout, WorkspaceLayout, FocusLayout...)
hooks/        React hook dùng chung (vd. useTypingEffect, useEligibilityChat)
lib/          Hàm tiện ích (cn, ...)
types/        Kiểu dữ liệu TypeScript dùng chung
mock/         Mock data — nội dung luật thật, đã tra cứu (xem knowledge/phap_ly/)
```

## Trạng thái triển khai
Đối chiếu `docs/UI/05_SCREEN_LIST.md`:

| Màn hình | Trạng thái |
|---|---|
| 1. Landing Page | ✅ Đã dựng |
| 2. AI Workspace | ✅ Đã dựng |
| 3. Eligibility Checker | ✅ Đã dựng |
| 4–10 | Chưa |

### Ghi chú Màn hình 3 — Eligibility Checker (`/eligibility`)
Dùng **Focus Mode** (`layouts/focus-layout.tsx`) — khác `WorkspaceLayout` của Màn hình 2: không sidebar, không side panel, cột đơn, mobile-first, chỉ một tác vụ duy nhất. Tái dùng gần như toàn bộ hạ tầng hội thoại của Màn hình 2 qua hook dùng chung `hooks/use-eligibility-chat.ts` (Component Reuse) — không tạo luồng chat song song.

Khác biệt với brief gốc (Wizard/AI Interview theo từng bước): đã cố tình giữ mô hình Thread-based đã chốt ở `docs/UI/11_AI_NATIVE_REDESIGN.md` thay vì quay lại wizard tuần tự — "AI Interview" được thoả bằng free-text + trích xuất trường thông tin (đã có từ Màn hình 2), không phải màn hỏi-đáp từng bước.

Hai phần **mới thật sự** so với Màn hình 2: `features/eligibility/checklist-card.tsx` (checklist chuẩn bị hồ sơ, chỉ hiện khi verdict = "eligible") và `features/eligibility/download-summary-button.tsx` (tải tóm tắt kết quả dạng `.txt`, sinh hoàn toàn phía client qua `Blob`, không gọi backend). Khi chưa có câu hỏi nào, hiển thị `features/eligibility/empty-state.tsx` với 3 ví dụ bấm-là-chạy.

## Design System đã áp dụng
Xem `docs/UI/07_DESIGN_SYSTEM.md` (bản cập nhật: Indigo/Slate, dark mode mặc định — quyết định điều chỉnh theo yêu cầu triển khai code, đã ghi lại lý do trong tài liệu đó).

## Ghi chú kỹ thuật
- Font Inter dùng qua font-stack hệ thống (không qua `next/font/google`) để không phụ thuộc mạng lúc build — xem chú thích trong `app/layout.tsx`.
- ESLint đã cấu hình (`eslint-config-next`) nhưng chưa chạy `next lint` trong phiên phát triển này — chạy `npm run lint` trước khi coi một màn hình là hoàn thiện.
