# 07 — Design System (High Fidelity)

> Đọc trong 8 phút. Chuyển từ Low-Fidelity (`06_LOW_FIDELITY_WIREFRAME.md`) sang giá trị cụ thể: màu, chữ, khoảng cách, bo góc, độ nổi, icon. Đây là **đề xuất có chủ đích** (Staff Product Designer), không phải chân lý tuyệt đối — có thể điều chỉnh giá trị cụ thể mà không phá vỡ hệ thống bên dưới.

> **Cập nhật khi chuyển sang code (`web/`)**: brief triển khai UI Prototype yêu cầu cụ thể "Primary Indigo/Purple/Slate/White" + "Dark mode mặc định" — khác đề xuất ban đầu ở đây (Ink Teal, nền sáng). Đã quyết định: dùng **Indigo** (không phải tím đậm kiểu ngân hàng) làm accent chính, **dark mode làm theme duy nhất** ở giai đoạn prototype. Lý do: Indigo là tông phổ biến ở sản phẩm AI cao cấp (Linear, Vercel), đủ khác biệt với tím TPBank ở `01_UI_REVIEW.md`; dark mode phù hợp tinh thần "AI Workspace" hiện đại và là yêu cầu tường minh của bước triển khai. Bảng token dưới đây giữ nguyên làm tài liệu lịch sử; token THẬT đang dùng trong code nằm ở `web/app/globals.css` (nguồn thực thi, có thể lệch nhẹ so với bảng dưới — khi có mâu thuẫn, code là nguồn đúng).

## Nguyên tắc chi phối mọi quyết định thị giác
Simple, Premium, Trustworthy, Government Grade, AI First (theo brief gốc). Diễn giải thành luật thiết kế: **ít màu hơn tham khảo, ít hiệu ứng hơn tham khảo, nhưng rõ trạng thái hơn tham khảo** — vì sản phẩm phải "biến mất" để nhường chỗ cho nội dung pháp lý và câu trả lời AI, không phải gây ấn tượng bằng chính giao diện.

## 1. Màu sắc

### Nền & chữ (neutral — chiếm >90% diện tích màn hình)
| Token | Giá trị | Dùng cho |
|---|---|---|
| `bg-base` | `#FAFAF9` (trắng ngà ấm, không phải trắng tinh) | Nền toàn màn hình |
| `bg-surface` | `#FFFFFF` | Card, panel |
| `border-subtle` | `#E7E5E2` | Viền card, chia vùng |
| `text-primary` | `#1B1B18` | Nội dung chính |
| `text-secondary` | `#5F5C55` | Chú thích, meta, ngày hiệu lực |

Lý do chọn trắng ngà thay vì trắng tinh/xám xanh của tham khảo: cảm giác ấm, ít "lâm sàng/hành chính" hơn, gần với tông của Claude.ai — phù hợp "Premium" mà vẫn giữ được "Government Grade" (không cần lạnh).

### Màu nhấn (accent — dùng tiết kiệm, <5% diện tích)
| Token | Giá trị | Dùng cho |
|---|---|---|
| `accent-primary` | **`#0F6E5D` (Ink Teal)** | Hành động chính, trạng thái AI đang hoạt động, link |
| `accent-primary-hover` | `#0C5A4C` | Hover của accent-primary |

**Lý do chọn Ink Teal thay vì tím (tham khảo) hoặc xanh dương (Google/thường thấy)**: (1) khác biệt rõ với "app ngân hàng nội bộ" (tím) và "trợ lý AI Big Tech" (xanh dương kiểu Google/Gemini) — tránh trùng liên tưởng thương hiệu; (2) xanh lục-lam trầm gợi cảm giác "đáng tin, điềm tĩnh, có căn cứ" — phù hợp một sản phẩm pháp lý nơi sự chắc chắn/thận trọng là giá trị cốt lõi; (3) tương phản tốt với các màu trạng thái bên dưới mà không trùng sắc.

### Màu trạng thái kết quả (semantic — quan trọng nhất của sản phẩm)
| Token | Giá trị | Dùng cho | Ghi chú |
|---|---|---|---|
| `status-eligible` | `#1E7F4C` (xanh lá trầm) | "Đủ điều kiện" | Không dùng xanh lá tươi — tránh cảm giác "game/thưởng" |
| `status-not-eligible` | `#B3261E` (đỏ gạch trầm) | "Không đủ điều kiện" | Không dùng đỏ tươi — đây là thông tin, không phải cảnh báo nguy hiểm |
| `status-uncertain` | **`#9A6700` (hổ phách trầm)`** | "Thiếu thông tin" | **Cố ý tách riêng khỏi `status-not-eligible`** — "chưa đủ căn cứ" không phải "lỗi" hay "xấu", không được dùng cùng họ màu với đỏ |
| `confidence-verified` | `#1E7F4C` (dùng lại status-eligible) | Badge "Đã xác minh" | |
| `confidence-pending` | `#9A6700` (dùng lại status-uncertain) | Badge "Đang xác minh" | Cùng họ màu với "Thiếu thông tin" — cả hai đều biểu đạt "chưa chắc chắn", nhất quán về ý nghĩa |

**Quyết định thiết kế quan trọng nhất trong bảng này**: `status-uncertain` KHÔNG được phép trông giống lỗi (không đỏ, không icon cảnh báo tam giác kiểu hệ thống hỏng). Đây là lựa chọn màu trực tiếp phục vụ nguyên tắc Safety đã nêu ở `docs/16_DESIGN_REVIEW.md` — nếu màu sắc khiến "Thiếu thông tin" trông như một sự cố, người dùng sẽ mất niềm tin đúng lúc hệ thống đang trung thực nhất.

## 2. Typography
Một họ chữ duy nhất, sans-serif nhân văn (VD: Inter hoặc tương đương hệ thống) — không dùng chữ trang trí, không dùng serif (giữ cảm giác hiện đại/AI, không "văn bản hành chính").

| Token | Kích thước / độ đậm | Dùng cho |
|---|---|---|
| `type-display` | 30px / 600 | Câu hỏi trung tâm ở Workspace Entry |
| `type-h1` | 22px / 600 | Tiêu đề kết quả ("ĐỦ ĐIỀU KIỆN...") |
| `type-h2` | 17px / 600 | Tiêu đề mục (VD: "Căn cứ") |
| `type-body` | 15px / 400 | Nội dung giải thích |
| `type-caption` | 13px / 500 | Meta: ngày hiệu lực, trạng thái |
| `type-micro` | 11px / 500 | Nhãn phụ, timestamp |

Khác biệt so với tham khảo: giảm 1 bậc kích thước tổng thể (tham khảo dùng H1 28px cho tiêu đề trang dashboard nhiều thông tin cùng lúc; sản phẩm của ta mỗi màn hình chỉ tập trung 1 thông điệp, nên tiêu đề không cần lớn áp đảo).

## 3. Khoảng cách (8pt grid)
`space-1: 4px · space-2: 8px · space-3: 12px · space-4: 16px · space-6: 24px · space-8: 32px · space-12: 48px`. Card dùng padding `space-6` (24px) — giữ nguyên tinh thần "spacious, not dense" từ tham khảo vì đây là nguyên tắc đúng, không liên quan tới màu thương hiệu.

## 4. Bo góc & độ nổi
| Token | Giá trị | Dùng cho |
|---|---|---|
| `radius-card` | 16px | Card, panel (thấp hơn 20px của tham khảo — cảm giác chắc chắn/chính xác hơn là "mềm/thân thiện") |
| `radius-control` | 10px | Input, button |
| `radius-pill` | 9999px | Badge độ tin cậy, trạng thái |
| `shadow-1` | `0 2px 8px rgba(15,23,42,0.06)` | Duy nhất một mức, dùng cho card nổi trên nền — giữ nguyên nguyên tắc "một mức shadow duy nhất" từ tham khảo |

## 5. Iconography & chuyển động
- Icon nét mảnh (line icon, stroke ~1.5px), không dùng emoji trong luồng chính (Workspace, kết quả) — giữ tông "Government Grade". Icon 📄/✓/✕/? trong wireframe `06` là placeholder mô tả, sẽ thay bằng icon nét mảnh tương ứng ở bản dựng thật.
- Chuyển động chỉ phục vụ 1 mục đích: thể hiện AI đang xử lý (Màn hình 3, `06_LOW_FIDELITY_WIREFRAME.md`) — hiệu ứng xuất hiện tuần tự từng dòng trạng thái, không dùng hiệu ứng trang trí (không parallax, không confetti, không transition cầu kỳ giữa màn hình).

## 6. Nguyên tắc áp dụng 2 chế độ điều hướng (`02_INFORMATION_ARCHITECTURE.md`)
- **Focus Mode** (Người dân): mật độ thấp, khoảng trắng rộng (`space-8`/`space-12` giữa các khối), tối đa 1 hành động chính nổi bật trên mỗi màn hình.
- **Workspace Mode** (Doanh nghiệp/Cơ quan quản lý — P1/P2): cùng bộ token, mật độ cao hơn (`space-4` giữa các khối thay vì `space-8`), cho phép nhiều hành động song song hơn — vẫn dùng chung màu/type/radius để giữ tính nhất quán thương hiệu giữa 2 chế độ.

## Việc chưa làm
Chưa có file token kỹ thuật (CSS variables/JSON) — đây vẫn là tài liệu thiết kế mô tả, chuyển sang định dạng kỹ thuật thuộc giai đoạn code (ngoài phạm vi yêu cầu hiện tại).
