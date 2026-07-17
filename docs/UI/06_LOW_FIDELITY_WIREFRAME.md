# 06 — Low-Fidelity Wireframe

> **Cập nhật quan trọng**: mô hình 7 màn hình tuần tự dưới đây đã được đánh giá lại qua lăng kính AI-Native và **thay thế bằng mô hình thread liên tục** ở `11_AI_NATIVE_REDESIGN.md`. Giữ file này làm tài liệu lịch sử (nội dung/thông tin từng khối vẫn đúng) — khi dựng UI thật, dùng `11` làm nguồn chính cho cấu trúc điều hướng.

> Mô tả mức thấp (Low Fidelity) — bố cục và nội dung từng vùng, KHÔNG phải thiết kế trực quan, KHÔNG code. Chỉ dựng cho 6 màn hình P0 (`05_SCREEN_LIST.md` #1–7, evidence panel lồng trong) + 1 màn hình P1 minh hoạ mô hình Workspace Mode. Dừng ở đây — chờ phê duyệt trước khi sang High Fidelity (bước 8, chưa thực hiện).

## Quy ước đọc wireframe
Khung `[ ]` = một vùng bố cục. Không có màu, không có font, không có icon cụ thể — chỉ có vị trí, nội dung, hành vi.

---

## Màn hình 1 — AI Workspace Entry (Focus Mode)
```
┌─────────────────────────────────────────┐
│  [Tên sản phẩm — nhỏ, góc trên]          │
│                                           │
│         Bạn muốn biết điều gì về         │
│           Nhà ở xã hội hôm nay?          │
│                                           │
│   ┌─────────────────────────────────┐   │
│   │  Kiểm tra tôi có đủ điều kiện   │   │
│   │  mua NOXH không?          [Bắt  │   │
│   │                            đầu] │   │
│   └─────────────────────────────────┘   │
│                                           │
│   (không menu, không sidebar, không      │
│    yêu cầu đăng nhập trước)              │
│                                           │
│   [icon lịch sử tra cứu — góc dưới,      │
│    ẩn nếu chưa từng dùng]                │
└─────────────────────────────────────────┘
```
Hành vi: bấm "Bắt đầu" → chuyển thẳng sang Màn hình 2. Không có bước trung gian "chọn dịch vụ".

---

## Màn hình 2 — Eligibility Checker: Thu thập thông tin
```
┌─────────────────────────────────────────┐
│  ← Quay lại            (Bước 1/4)        │
│                                           │
│  AI: "Bạn hiện đang độc thân, đã kết     │
│  hôn, hay độc thân đang nuôi con?"       │
│                                           │
│   ( ) Độc thân chưa kết hôn               │
│   ( ) Độc thân nuôi con dưới tuổi         │
│       thành niên                          │
│   ( ) Đã kết hôn                          │
│                                           │
│                              [Tiếp tục]  │
└─────────────────────────────────────────┘
```
Hành vi: mỗi câu hỏi hiện riêng lẻ (không phải form dài cuộn), giống nhịp hội thoại. Nếu người dùng chọn mơ hồ hoặc bỏ trống, AI hỏi lại ngay tại chỗ thay vì để tới cuối mới báo lỗi (khác wizard truyền thống trong tài liệu tham khảo). Sau câu hỏi cuối (4/4), tự động chuyển sang Màn hình 3.

---

## Màn hình 3 — Đang xử lý (AI thinking state)
```
┌─────────────────────────────────────────┐
│                                           │
│     Đang đối chiếu hồ sơ của bạn với     │
│     quy định hiện hành...                │
│                                           │
│     ✓ Đã xác định nhóm đối tượng          │
│     ✓ Đang tra Điều 30 (điều kiện        │
│       thu nhập) — Nghị định 100/2024      │
│       (đã sửa đổi 3 lần, đang dùng bản    │
│       mới nhất)                           │
│     … Đang kiểm tra chồng lấp dữ liệu     │
│                                           │
└─────────────────────────────────────────┘
```
Hành vi: đây là vùng khác biệt hoá quan trọng — thay spinner vô nghĩa bằng các bước có thật, ánh xạ đúng pipeline `docs/06_KIEN_TRUC_AI_AGENT.md` (Parse → Retrieve → Reasoning → Fact-Check). Nếu xử lý nhanh (<1–2 giây), có thể rút gọn hiển thị nhưng KHÔNG được bỏ hẳn — chính bước này xây dựng niềm tin trước khi thấy kết quả.

---

## Màn hình 4 — Kết quả: Đủ điều kiện
```
┌─────────────────────────────────────────┐
│  ✓ ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội          │
│                                           │
│  Vì sao: Thu nhập của bạn (18 triệu/     │
│  tháng) thấp hơn mức trần cho phép với   │
│  người độc thân, và bạn chưa có nhà ở    │
│  thuộc sở hữu.                            │
│                                           │
│  Căn cứ:                                  │
│  ┌─────────────────────────────────┐    │
│  │ 📄 Điều 30, Nghị định 136/2026   │    │
│  │    Hiệu lực từ 07/04/2026        │    │
│  │    [Xem chi tiết ›]              │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 📄 Điều 29, Nghị định 54/2026    │    │
│  │    Hiệu lực từ 09/02/2026        │    │
│  │    [Xem chi tiết ›]              │    │
│  └─────────────────────────────────┘    │
│                                           │
│         [Hỏi câu khác]  [Lưu kết quả]    │
└─────────────────────────────────────────┘
```
Hành vi: bấm "Xem chi tiết" trên bất kỳ card trích dẫn nào → mở Evidence Panel (Màn hình 7). Card trích dẫn là component tái sử dụng ở cả 3 trạng thái kết quả.

---

## Màn hình 5 — Kết quả: Không đủ điều kiện
```
┌─────────────────────────────────────────┐
│  ✕ CHƯA ĐỦ ĐIỀU KIỆN                     │
│                                           │
│  Vì sao: Thu nhập của bạn (30 triệu/     │
│  tháng) vượt mức trần cho phép với       │
│  người độc thân (25 triệu/tháng).        │
│                                           │
│  Căn cứ:                                  │
│  ┌─────────────────────────────────┐    │
│  │ 📄 Điều 30, Nghị định 136/2026   │    │
│  │    [Xem chi tiết ›]              │    │
│  └─────────────────────────────────┘    │
│                                           │
│  Gợi ý: mức trần khác nhau theo tình     │
│  trạng hôn nhân — [Kiểm tra lại với      │
│  thông tin khác]                          │
│                                           │
│         [Hỏi câu khác]  [Lưu kết quả]    │
└─────────────────────────────────────────┘
```
Hành vi: khác Màn hình 4 chủ yếu ở trạng thái/màu (chưa định ở Low-Fi) và có thêm gợi ý hành động tiếp theo — tránh cảm giác "cửa đóng", giữ đúng tinh thần trợ lý hữu ích.

---

## Màn hình 6 — Kết quả: Thiếu thông tin (màn hình quan trọng nhất về Safety)
```
┌─────────────────────────────────────────┐
│  ? CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN  │
│                                           │
│  Vì sao: Mức trần thu nhập áp dụng cho   │
│  nhóm "độc thân nuôi con" hiện có 2       │
│  văn bản khác thời điểm — hệ thống chưa  │
│  xác nhận được văn bản nào đang áp dụng. │
│  Chúng tôi không đoán để tránh cho bạn   │
│  một câu trả lời có thể sai.              │
│                                           │
│  Đang có: 2 văn bản liên quan            │
│  ┌─────────────────────────────────┐    │
│  │ 📄 Nghị định 261/2025 — 30tr/th  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 📄 Nghị định 136/2026 — chưa rõ  │    │
│  │    có sửa mức này không          │    │
│  └─────────────────────────────────┘    │
│                                           │
│    [Thử lại sau]  [Liên hệ hỗ trợ]       │
└─────────────────────────────────────────┘
```
Hành vi: đây KHÔNG phải trang lỗi — cùng cấp bậc thị giác với Màn hình 4/5, không làm nhỏ hơn/xám hơn khiến người dùng nghĩ "hệ thống hỏng". Đây là bằng chứng Explainable AI mạnh nhất của sản phẩm (đúng tinh thần TC-04, `knowledge/evaluation/eligibility_test_cases.md`), phải được thiết kế cẩn thận ngang các trạng thái khác, không phải xử lý qua loa.

---

## Màn hình 7 — Evidence Panel (Trust & Evidence Layer, lồng trong 4/5/6)
```
┌─────────────────────────────────────────┐
│  ×  Chi tiết căn cứ pháp lý               │
│                                           │
│  Điều 30, Nghị định 136/2026/NĐ-CP        │
│  Ban hành: 07/04/2026                    │
│  Hiệu lực: đang áp dụng                  │
│  Độ tin cậy: ⚠ Đang xác minh — số liệu   │
│  này lấy từ nguồn thứ cấp, chưa đối      │
│  chiếu văn bản gốc Công báo.              │
│                                           │
│  Tóm tắt: Nâng mức trần thu nhập cho     │
│  người độc thân chưa kết hôn lên 25      │
│  triệu đồng/tháng...                      │
│                                           │
│  [Xem văn bản gốc ↗]                     │
│  [Xem lịch sử sửa đổi liên quan ›]       │
└─────────────────────────────────────────┘
```
Hành vi: mở dạng panel trượt/overlay, không điều hướng rời khỏi màn hình kết quả (giữ ngữ cảnh). "Độ tin cậy" luôn hiển thị trung thực kể cả khi đang demo trước giám khảo — đây là quyết định đã ghi trong `docs/16_DESIGN_REVIEW.md` (không được "làm đẹp" bằng cách giấu trạng thái chưa chắc chắn.

---

## Minh hoạ P1 — Workspace Mode (Phòng pháp chế) — chỉ để kiểm chứng mô hình, KHÔNG thuộc phạm vi demo
```
┌───┬───────────────────────────────────────┐
│ ▤ │  Legal Diff — Thay đổi gần đây          │
│ ▤ │                                          │
│ ▤ │  ┌────────────────────────────────┐    │
│ ▤ │  │ Điều 30, NĐ 100/2024            │    │
│   │  │ 2 nhánh sửa đổi đang hoạt động: │    │
│   │  │ • NĐ 261/2025 (mức trần)        │    │
│   │  │ • NĐ 54/2026 (thẩm quyền xác    │    │
│   │  │   nhận)                          │    │
│   │  │ [Xem chi tiết từng nhánh ›]     │    │
│   │  └────────────────────────────────┘    │
└───┴───────────────────────────────────────┘
```
Rail bên trái (▤) chỉ icon, không chữ mặc định — mở rộng khi hover/chọn. Mật độ thông tin cao hơn Focus Mode vì đối tượng là người dùng chuyên môn, chấp nhận đánh đổi giữa "đơn giản" và "đủ dữ liệu để ra quyết định nghiệp vụ".

---

## Việc chưa làm (đúng yêu cầu — dừng ở Low-Fidelity)
Chưa chọn màu, chưa chọn font, chưa chọn icon set, chưa có spacing/grid cụ thể, chưa có component code. Toàn bộ chờ phê duyệt trước khi sang High Fidelity.
