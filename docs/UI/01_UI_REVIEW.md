# 01 — UI Review: Phân tích tài liệu tham khảo (TPBank BIZ Design System)

> Đọc trong 8 phút. Nguồn: `1784277504236_UIUX_SYSTEM.md` + `1784277536491_RESPONSIVE_GUIDE.md` do bạn cung cấp — dùng làm nguồn cảm hứng, KHÔNG sao chép. Chưa thiết kế gì ở file này, chỉ phân tích.

## Đây là gì
Một design system cho **dashboard nội bộ ngân hàng doanh nghiệp** (TPBank BIZ) — sidebar cố định, workflow phê duyệt nhiều bước, KPI/báo cáo. Đây là ngôn ngữ thiết kế cho *nhân viên vận hành xử lý nghiệp vụ*, không phải cho *người dùng cuối hỏi AI một câu và nhận câu trả lời*.

## Phân tích theo từng lớp

### Layout
Sidebar 252px cố định (gradient tím) + Topbar 64px + Content max 1280px + lưới KPI 4 cột + Tab nav + Card biểu đồ/bảng. Đây là bố cục "trang tổng quan vận hành" chuẩn — tối ưu cho việc *giám sát nhiều chỉ số cùng lúc*, không tối ưu cho *một tác vụ hội thoại tuyến tính*.
**Đánh giá**: Đúng cho một màn hình Dashboard duy nhất (ví dụ dành cho Cơ quan quản lý xem tổng quan). Sai nếu áp dụng làm khung sườn cho toàn bộ sản phẩm — vì phần lớn NOXH Copilot không phải "giám sát chỉ số", mà là "AI trả lời có căn cứ".

### UX Pattern — Workflow/Wizard-first
Trung tâm trải nghiệm là wizard stepper (điền form nhiều bước) và luồng phê duyệt. Đây là mẫu đúng cho nghiệp vụ "mở tài khoản doanh nghiệp", "duyệt hồ sơ vay" — chuỗi bước cố định, tuần tự, không đổi.
**Đánh giá**: Sai mental model cho Eligibility Checker. Bản chất câu hỏi "tôi có đủ điều kiện mua NOXH không" không phải một form cố định — nó là một cuộc **hội thoại có mục đích**: AI có thể hỏi lại khi thiếu dữ liệu, giải thích ngay khi cần, không bắt người dùng đi hết 5 bước rồi mới biết kết quả. Đúng như brief đã nêu: "Người dùng phải cảm giác đang làm việc cùng AI, không phải điền form."

### Design Language (màu, bo góc, shadow, typography)
Purple-first (`#7B2CBF`), bo góc 20px (card)/12px (input), shadow tối giản duy nhất một mức, không gradient/glow/glassmorphism, typography scale rõ ràng (28/22/18/15/13/11px).
**Đánh giá**: Đây là phần **tốt nhất** của tài liệu tham khảo. Kỷ luật "ít màu, ít hiệu ứng, dữ liệu là ưu tiên" đúng tinh thần "Premium, Trustworthy" mà brief yêu cầu. Nên kế thừa *nguyên tắc* (tối giản, nhất quán, có scale rõ ràng), nhưng đổi *token cụ thể* — màu tím + sidebar gradient đậm tạo cảm giác "ứng dụng ngân hàng nội bộ", không phải "trợ lý AI cao cấp, trung lập, đáng tin cho mọi đối tượng từ người dân tới cơ quan quản lý".

### Navigation
Sidebar liệt kê toàn bộ module chức năng, active state = nền trắng + vạch trái. Đây là **navigation-first**: người dùng phải biết mình cần vào module nào trước khi làm việc.
**Đánh giá**: Vi phạm trực tiếp nguyên tắc thiết kế đã chốt trong brief (AI ↓ Task ↓ Information ↓ Visual — không thiết kế theo menu). Với người dân, việc phải "chọn đúng module trong sidebar" trước khi được giúp đỡ là một bước ma sát không cần thiết — họ chỉ có đúng một việc cần làm.

### Interaction (states)
Button/Input/Sidebar đều định nghĩa đầy đủ Default/Hover/Active/Disabled/Focus, có focus ring rõ ràng, touch target 40–44px.
**Đánh giá**: Phần kỹ thuật tốt, **nên kế thừa nguyên tắc** (accessibility, rõ trạng thái) bất kể đổi màu sắc. Đây là phần "vô hình nhưng quan trọng" của mọi design system tốt.

### Component
KPI card, Data table, Tabs, Toast, Modal — đúng bộ component cho "báo cáo & vận hành".
**Đánh giá**: Thiếu hoàn toàn ngôn ngữ component cho một sản phẩm AI: không có ô nhập hội thoại, không có trạng thái "AI đang suy luận", không có card trích dẫn nguồn (citation card), không có badge độ tin cậy (đã xác minh/đang xác minh), không có timeline lịch sử sửa đổi văn bản. Đây chính là các component **lõi** của NOXH Copilot — phải tự thiết kế mới, không có gì để kế thừa từ tham khảo.

### Responsive Strategy
Desktop-first, base 1440px, sidebar collapse ở 1024px.
**Đánh giá**: Hợp lý cho nhân viên ngân hàng dùng màn hình lớn cố định. **Sai chiến lược cho đối tượng người dân** của NOXH Copilot — nhóm này (theo persona "anh Minh", `docs/04_DOI_TUONG_NGUOI_DUNG.md`) nhiều khả năng tra cứu bằng điện thoại. Cần đảo chiều: Mobile-first cho luồng Người dân, Desktop-first có thể giữ cho luồng Workspace tổ chức (Doanh nghiệp/Ngân hàng/Phòng pháp chế/Cơ quan quản lý).

## Bảng tổng hợp

| Nên kế thừa | Nên thay đổi hoàn toàn |
|---|---|
| Kỷ luật hệ thống: token màu/spacing/typography rõ ràng, nhất quán | Purple-first + sidebar gradient đậm → tông trung tính, màu nhấn dùng tiết kiệm |
| Nguyên tắc tối giản: không gradient, không glow, không shadow nặng | Navigation-first bằng sidebar nhiều module → mô hình AI-first, single-focus |
| Đầy đủ interaction state + focus ring (accessibility) | Wizard stepper cứng nhắc → hội thoại/form thích ứng theo ngữ cảnh |
| Card làm đơn vị nội dung cơ bản | Desktop-first mặc định cho mọi luồng → Mobile-first cho luồng Người dân |
| Touch target chuẩn (40–44px) | Bộ component thiếu ngôn ngữ AI (không có gì để giữ, phải thiết kế mới) |

## Phản biện thẳng
Tài liệu tham khảo là một hệ thống thiết kế **tốt cho đúng bài toán của nó** (backoffice ngân hàng, nhiều nhân viên, nhiều nghiệp vụ song song, cần giám sát/phê duyệt). Nhưng nếu áp dụng nguyên bản cho NOXH Copilot sẽ tạo ra đúng thứ brief yêu cầu tránh: "giống website hành chính/ERP". Vấn đề không phải màu tím hay bo góc — vấn đề là **mental model gốc**: tham khảo tổ chức trải nghiệm quanh *module chức năng*, còn NOXH Copilot phải tổ chức quanh *câu hỏi và câu trả lời có căn cứ*. Đây là lý do Information Architecture (file `02`) sẽ được thiết kế lại từ đầu, không chỉnh sửa từ sitemap của tham khảo.
