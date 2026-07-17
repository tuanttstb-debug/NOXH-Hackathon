# 08 — Component Spec: Ngôn ngữ component AI-native

> Đọc trong 8 phút. Đây là các component **không có gì để kế thừa từ tài liệu tham khảo** (đã ghi nhận ở `01_UI_REVIEW.md`) — thiết kế mới hoàn toàn, áp dụng token từ `07_DESIGN_SYSTEM.md`. Vẫn là mô tả, không code.

## 1. Question Bubble (câu hỏi hội thoại)
**Thay thế cho**: form field truyền thống/wizard step của tham khảo.
**Cấu tạo**: 1 dòng câu hỏi (`type-body`, `text-primary`) + tối đa 4 lựa chọn dạng nút bo tròn (`radius-control`) hoặc ô nhập ngắn. Không có label nổi phía trên kiểu form ngân hàng — câu hỏi tự nó là label.
**Trạng thái**: Mặc định → Đã trả lời (thu gọn thành 1 dòng tóm tắt, mờ nhẹ `text-secondary`, có thể bấm sửa lại) → Đang chờ trả lời tiếp theo (hiện bubble mới, có hiệu ứng xuất hiện nhẹ).
**Vì sao cần thiết kế riêng**: đây là cách duy nhất hiện thực hoá yêu cầu "cảm giác làm việc cùng AI, không phải điền form" ở cấp độ component, không chỉ ở cấp độ layout.

## 2. AI Reasoning Trace (dấu vết suy luận)
**Thay thế cho**: spinner/progress bar chung chung.
**Cấu tạo**: danh sách dòng trạng thái xuất hiện tuần tự, mỗi dòng có icon trạng thái (đang chạy = chấm nhấp nháy dùng `accent-primary`; đã xong = dấu ✓ dùng `status-eligible`) + mô tả bước bằng ngôn ngữ nghiệp vụ (không lộ tên kỹ thuật như "calling legal_reasoner agent").
**Ánh xạ dữ liệu**: mỗi dòng tương ứng 1 bước trong pipeline `docs/06_KIEN_TRUC_AI_AGENT.md` (Parse → Retrieve → Reasoning → Fact-Check), nhưng diễn giải sang ngôn ngữ người dùng hiểu (VD: "Đang tra Điều 30..." thay vì "Retrieving DieuKhoan nodes").
**Quy tắc bắt buộc**: không được bỏ qua bước Fact-Check trong trace hiển thị — kể cả khi xử lý nhanh, phải có ít nhất một khoảnh khắc thể hiện bước kiểm chứng đã chạy, để người dùng biết đây không phải câu trả lời "buột miệng".

## 3. Result Status Header (tiêu đề trạng thái kết quả)
**Cấu tạo**: icon trạng thái + nhãn chữ hoa ngắn, dùng đúng 1 trong 3 màu `status-*` (`07_DESIGN_SYSTEM.md`).
**Quy tắc bắt buộc quan trọng nhất**: cả 3 trạng thái (Đủ/Không đủ/Thiếu thông tin) dùng **cùng kích thước, cùng vị trí, cùng cấp độ nổi bật** — không được làm trạng thái "Thiếu thông tin" nhỏ hơn hoặc mờ hơn 2 trạng thái kia. Đây là quy tắc kiểm tra được (designer khác review có thể đo bằng mắt), trực tiếp hiện thực hoá phát hiện ở `07_DESIGN_SYSTEM.md` mục màu sắc.

## 4. Citation Card (thẻ trích dẫn)
**Cấu tạo**: icon tài liệu + tên văn bản/điều khoản (`type-body`, in đậm) + ngày hiệu lực (`type-caption`, `text-secondary`) + link "Xem chi tiết ›". Viền `border-subtle`, bo `radius-card` nhỏ hơn card cha (dùng biến thể 12px), nền `bg-surface`.
**Trạng thái đặc biệt**: nếu trích dẫn có `do_tin_cay = đang xác minh` (`ontology/metadata.md`), thêm 1 Confidence Badge (xem mục 5) ở góc phải card — không tách thành 2 dòng riêng, giữ card gọn.
**Tái sử dụng**: xuất hiện giống hệt nhau ở Màn hình 4, 5, 6 và bên trong Evidence Panel (Màn hình 7) — tính nhất quán component là bằng chứng thị giác cho "Citation First" (mọi nơi có kết luận đều có card này đi kèm, không có ngoại lệ).

## 5. Confidence Badge (nhãn độ tin cậy)
**Cấu tạo**: pill nhỏ (`radius-pill`), 2 trạng thái:
- "Đã xác minh" — nền nhạt của `confidence-verified`, chữ đậm màu tương ứng.
- "Đang xác minh" — nền nhạt của `confidence-pending`, chữ đậm màu tương ứng, kèm icon thông tin (i) mở tooltip giải thích ngắn khi bấm/hover: "Số liệu đang được đối chiếu với văn bản gốc."
**Quy tắc bắt buộc**: badge này không bao giờ được ẩn đi để "demo cho đẹp" — xem cảnh báo đã ghi ở `docs/16_DESIGN_REVIEW.md` (Anthropic challenge, mục Safety). Nếu một bản demo cụ thể chỉ muốn dùng dữ liệu đã chắc chắn, cách đúng là chọn ví dụ có `đã xác minh` thật, không phải ẩn badge của ví dụ `đang xác minh`.

## 6. Evidence Panel (đã mô tả bố cục ở `06`, đây là phần token hoá)
**Cấu tạo**: overlay/slide-in từ phải, nền `bg-surface`, đóng bằng nút × góc trên trái của panel (không phải nút hệ thống góc phải, để phân biệt với đóng cửa sổ trình duyệt). Nội dung dùng lại `type-h2` cho tên văn bản, `type-body` cho tóm tắt, Confidence Badge ngay dưới tiêu đề.
**Hành vi**: mở panel không rời khỏi màn hình kết quả (giữ nguyên ngữ cảnh phía sau, làm mờ nhẹ `bg-base` phía sau panel) — đúng nguyên tắc "progressive disclosure" của mô hình 3 lớp (`02_INFORMATION_ARCHITECTURE.md`).

## 7. Uncertainty Callout (khối giải thích khi Thiếu thông tin)
**Component riêng, không dùng chung khối "Vì sao" của 2 trạng thái kia** — vì nội dung mang tính giải thích giới hạn tri thức (epistemic), không phải giải thích kết luận.
**Cấu tạo**: nền `bg-surface` viền trái dày 3px màu `status-uncertain` (không phải viền toàn khối — tránh cảm giác "hộp cảnh báo lỗi" kiểu box đỏ toàn phần), nội dung giải thích bằng giọng trung thực, thẳng thắn ("Chúng tôi không đoán để tránh cho bạn một câu trả lời có thể sai" — giữ nguyên câu chữ từ `06_LOW_FIDELITY_WIREFRAME.md`, đây là câu đã được cân nhắc kỹ về tông giọng).

## Bảng tổng hợp — component nào dùng ở đâu
| Component | Màn hình sử dụng (`06`) |
|---|---|
| Question Bubble | 2 |
| AI Reasoning Trace | 3 |
| Result Status Header | 4, 5, 6 |
| Citation Card | 4, 5, 6, 7 |
| Confidence Badge | 4 (khi cần), 5 (khi cần), 6, 7 |
| Evidence Panel | 7 |
| Uncertainty Callout | 6 |
