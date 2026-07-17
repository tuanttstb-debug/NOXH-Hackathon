# 09 — High-Fidelity Screens (P0)

> Đọc trong 10 phút. Áp `07_DESIGN_SYSTEM.md` (token) + `08_COMPONENT_SPEC.md` (component) vào 7 màn hình P0 đã dựng khung ở `06_LOW_FIDELITY_WIREFRAME.md`. Vẫn là mô tả bằng chữ + sơ đồ khối có chú thích token — KHÔNG phải mockup pixel, KHÔNG code.

## Màn hình 1 — AI Workspace Entry
```
bg-base (#FAFAF9), căn giữa theo chiều dọc và ngang, max-width ~560px

  [Tên sản phẩm]                                type-caption, text-secondary
                                                  space-12 (48px) phía dưới

  "Bạn muốn biết điều gì về                      type-display (30px/600)
   Nhà ở xã hội hôm nay?"                        text-primary, căn giữa
                                                  space-8 (32px) phía dưới

  ┌───────────────────────────────────┐          bg-surface, radius-card (16px)
  │ Kiểm tra tôi có đủ điều kiện      │          border-subtle, shadow-1
  │ mua NOXH không?                    │          type-body
  │                          [Bắt đầu] │          nút accent-primary, radius-control
  └───────────────────────────────────┘

  (icon lịch sử — góc dưới trái, 24px,           icon nét mảnh, text-secondary
   chỉ hiện nếu đã từng dùng)                     không phải accent-primary — tránh
                                                   kéo chú ý khỏi hành động chính
```
Không có logo lớn, không có hero image, không có banner khuyến mãi — mọi diện tích thị giác phục vụ đúng 1 câu hỏi.

## Màn hình 2 — Thu thập thông tin (Question Bubble)
```
bg-base, max-width ~560px, căn trên (không căn giữa dọc — chuẩn bị chỗ cho
bubble tiếp theo xuất hiện phía dưới)

  ← [icon quay lại, text-secondary]     "Bước 1/4"  type-micro, text-secondary

  ┌─ Question Bubble (component 08 #1) ─────┐
  │ "Bạn hiện đang độc thân, đã kết hôn,     │  type-body, text-primary
  │  hay độc thân đang nuôi con?"            │
  │                                            │
  │  ( Độc thân chưa kết hôn )                │  nút outline, radius-control,
  │  ( Độc thân nuôi con )                    │  border accent-primary khi hover
  │  ( Đã kết hôn )                            │
  └────────────────────────────────────────────┘

  [Bubble đã trả lời trước đó, nếu có, thu gọn  type-caption, text-secondary,
   phía trên — mờ nhẹ, có icon bút để sửa]      opacity thấp hơn bubble hiện tại
```
Nhịp xuất hiện: mỗi bubble mới trượt nhẹ từ dưới lên khi câu trước được trả lời — chuyển động duy nhất được cho phép ngoài AI Reasoning Trace (`07` mục 5).

## Màn hình 3 — Đang xử lý (AI Reasoning Trace)
```
bg-base, max-width ~560px, căn giữa dọc

  ┌─ AI Reasoning Trace (component 08 #2) ───┐
  │ ✓ Đã xác định nhóm đối tượng               │  ✓ = status-eligible, type-body
  │ ✓ Đang tra Điều 30 — Nghị định 100/2024    │  dòng đã xong: text-primary
  │   (đã sửa đổi 3 lần, dùng bản mới nhất)    │
  │ ● Đang kiểm tra chồng lấp dữ liệu...        │  ● nhấp nháy = accent-primary,
  │                                              │  dòng đang chạy: text-primary,
  │                                              │  dòng chưa tới: text-secondary
  └──────────────────────────────────────────────┘
```
Không có phần trăm tiến trình (progress % dễ gây cảm giác "máy móc"), chỉ có mô tả bước bằng ngôn ngữ nghiệp vụ — đúng nguyên tắc component 08 #2.

## Màn hình 4 — Kết quả: Đủ điều kiện
```
bg-base, max-width ~560px

  ┌─ Result Status Header (08 #3) ──────────────┐
  │ ✓  ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội              │  icon+text màu status-eligible
  └────────────────────────────────────────────────┘  type-h1, space-6 dưới

  "Vì sao: Thu nhập của bạn (18 triệu/tháng)        type-body, text-primary
  thấp hơn mức trần cho phép..."                     space-6 dưới

  "Căn cứ:"                                          type-h2, space-3 dưới
  ┌─ Citation Card (08 #4) ──────────────────┐
  │ 📄 Điều 30, Nghị định 136/2026             │  type-body semibold
  │    Hiệu lực từ 07/04/2026                  │  type-caption, text-secondary
  │    [Đã xác minh]         [Xem chi tiết ›] │  Confidence Badge (nếu áp dụng)
  └──────────────────────────────────────────────┘  space-3 giữa các card
  ┌─ Citation Card ──────────────────────────┐
  │ 📄 Điều 29, Nghị định 54/2026               │
  │    [Đang xác minh ⓘ]     [Xem chi tiết ›] │
  └──────────────────────────────────────────────┘

  [Hỏi câu khác]  [Lưu kết quả]                     nút outline + nút ghost,
                                                      space-8 phía trên
```

## Màn hình 5 — Kết quả: Không đủ điều kiện
Cấu trúc giống hệt Màn hình 4, khác 2 điểm: Result Status Header dùng `status-not-eligible` (đỏ gạch trầm), và thêm khối gợi ý hành động tiếp theo ngay dưới phần "Vì sao" — nền `bg-surface`, không viền nổi bật, `type-caption` — tránh cảm giác "cửa đóng".

## Màn hình 6 — Kết quả: Thiếu thông tin
```
bg-base, max-width ~560px

  ┌─ Result Status Header (08 #3) ──────────────┐
  │ ?  CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN       │  màu status-uncertain,
  └────────────────────────────────────────────────┘  CÙNG kích thước/vị trí
                                                        như Màn hình 4/5 — bắt buộc

  ┌─ Uncertainty Callout (08 #7) ────────────────┐
  │┃ Vì sao: Mức trần thu nhập áp dụng cho nhóm   │  viền trái 3px status-uncertain
  │┃ "độc thân nuôi con" hiện có 2 văn bản khác    │  nền bg-surface, không viền
  │┃ thời điểm — hệ thống chưa xác nhận được...    │  toàn khối
  │┃ Chúng tôi không đoán để tránh cho bạn một     │
  │┃ câu trả lời có thể sai.                        │
  └──────────────────────────────────────────────────┘

  "Đang có: 2 văn bản liên quan"                     type-h2
  [Citation Card] [Citation Card]                     như Màn hình 4, cả 2 đều
                                                        mang Confidence Badge
                                                        "Đang xác minh"

  [Thử lại sau]  [Liên hệ hỗ trợ]
```
**Kiểm tra bắt buộc trước khi coi màn hình này "đạt"**: đặt cạnh Màn hình 4 — kích thước chữ, khoảng cách, độ nổi của Result Status Header phải giống hệt nhau, chỉ khác màu và icon. Đây là tiêu chí duyệt thiết kế, không phải gợi ý.

## Màn hình 7 — Evidence Panel
```
Overlay trượt từ phải, rộng ~400px, bg-surface, phía sau bg-base mờ 40%

  ×  Chi tiết căn cứ pháp lý                        icon đóng góc trên trái

  Điều 30, Nghị định 136/2026/NĐ-CP                  type-h2
  Ban hành: 07/04/2026 · Hiệu lực: đang áp dụng      type-caption, text-secondary

  [Đang xác minh ⓘ]                                  Confidence Badge, đứng riêng
                                                        1 dòng, không nhét vào góc

  "Tóm tắt: Nâng mức trần thu nhập..."               type-body

  [Xem văn bản gốc ↗]                                 nút outline, icon mở tab mới
  [Xem lịch sử sửa đổi liên quan ›]                   nút ghost, dẫn tới Legal Diff
                                                        rút gọn (P1, chưa thiết kế
                                                        chi tiết ở giai đoạn này)
```

## Ghi chú thực thi
Các giá trị token trong sơ đồ trên tham chiếu trực tiếp `07_DESIGN_SYSTEM.md` — khi bước sang giai đoạn code, mỗi tên token (`bg-base`, `accent-primary`, `radius-card`...) nên trở thành biến CSS/theme thật, giữ nguyên tên để truy vết được từ code ngược lại tài liệu thiết kế (đúng nguyên tắc Data Lineage đã áp dụng cho Knowledge Graph ở `docs/09_KIEN_TRUC_DU_LIEU.md` — áp dụng lại tinh thần đó cho chính hệ thống thiết kế).
