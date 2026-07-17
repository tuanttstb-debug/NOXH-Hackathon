# 03 — User Journey

> Đọc trong 8 phút. 3 nhóm theo đúng yêu cầu; "Doanh nghiệp" gộp 3 biến thể (Chủ đầu tư, Ngân hàng, Phòng pháp chế) vì cùng thuộc Workspace Mode nhưng có Job-To-Be-Done khác nhau — nêu rõ để không hiểu nhầm là một persona duy nhất.

## 1. Người dân — Focus Mode (P0, phạm vi demo)
Persona: "anh Minh" (`docs/04_DOI_TUONG_NGUOI_DUNG.md`).

| Bước | Hành động | Trải nghiệm AI-first (khác tham khảo) |
|---|---|---|
| Trigger | Nghe tin có đợt mở bán NOXH, không biết mình đủ điều kiện không | — |
| 1. Vào Workspace | Mở app/web, thấy ngay 1 câu hỏi trung tâm: "Kiểm tra tôi có đủ điều kiện mua NOXH không?" — không menu, không đăng nhập bắt buộc trước | Khác wizard: không có bước "chọn dịch vụ" trước khi được giúp |
| 2. Cung cấp thông tin | Trả lời tuần tự 4 câu hỏi (hôn nhân, thu nhập, nhà ở, nơi cư trú) dưới dạng hội thoại ngắn, không phải form dài | AI có thể hỏi lại ngay nếu câu trả lời mơ hồ, thay vì đợi submit cả form rồi báo lỗi |
| 3. AI xử lý | Thấy trạng thái tiến trình có ý nghĩa: "Đang đối chiếu điều kiện thu nhập với Nghị định 100/2024 (đã sửa đổi)..." | Khác spinner vô nghĩa — trạng thái tự nó đã bắt đầu xây dựng niềm tin |
| 4. Nhận kết quả | 1 trong 3 trạng thái, luôn kèm giải thích + trích dẫn (`docs/06_KIEN_TRUC_AI_AGENT.md`) | Nếu "Thiếu thông tin", trình bày như một câu trả lời trung thực, không phải lỗi hệ thống |
| 5. Đào sâu (tuỳ chọn) | Bấm vào trích dẫn → xem văn bản gốc, ngày hiệu lực, ghi chú độ tin cậy nếu có | Trust & Evidence Layer — chỉ hiện khi cần, không áp đảo màn hình chính |
| Outcome | Biết chắc kết quả + lý do, đủ tự tin quyết định có nộp hồ sơ hay không | Giá trị cốt lõi: "biết chắc và vì sao", không phải "có câu trả lời nhanh" |

## 2. Doanh nghiệp — Workspace Mode (P1/P2, ngoài phạm vi demo)
Ba biến thể dùng chung Workspace Mode nhưng khác trọng tâm — cần lưu ý khi thiết kế chi tiết sau này, không gộp thành 1 luồng duy nhất:

| Biến thể | Job-To-Be-Done chính | Khác biệt so với Người dân |
|---|---|---|
| Chủ đầu tư | Tra cứu điều kiện triển khai dự án NOXH (quỹ đất, tỷ lệ, thủ tục) — hiện NGOÀI phạm vi nghiệp vụ đã xác nhận (`docs/03_YEU_CAU_NGHIEP_VU.md`) | Cần tra cứu nhiều loại điều kiện cùng lúc, không phải 1 câu hỏi đơn |
| Ngân hàng | Thẩm định hồ sơ vay ưu đãi lãi suất NOXH — cần biết mức lãi suất/điều kiện đang hiệu lực tại thời điểm giải ngân | Quan tâm nhất tới `NguongSo` (ngưỡng số liệu) và ngày hiệu lực chính xác, khối lượng tra cứu lớn (nhiều hồ sơ/ngày) |
| Phòng pháp chế | Rà soát tuân thủ nội bộ, cần biết văn bản nào vừa thay đổi để cập nhật quy trình công ty | Quan tâm nhất tới Legal Diff — "có gì mới/thay đổi" hơn là "hồ sơ này có đạt không" |

Journey chung (mức khái niệm): Đăng nhập vào Workspace → chọn/mở một hồ sơ hoặc một câu hỏi tra cứu → AI trả lời có trích dẫn (giống lớp 2–3 của Người dân) nhưng có thêm khả năng lưu, so sánh nhiều trường hợp, xuất báo cáo → theo dõi Legal Diff định kỳ để không bị động khi luật đổi.

**Chưa thiết kế chi tiết ở giai đoạn này** — nghiệp vụ cho Doanh nghiệp hiện là OPEN QUESTION/ngoài phạm vi theo `docs/03_YEU_CAU_NGHIEP_VU.md`, cần chốt yêu cầu nghiệp vụ trước khi thiết kế journey chi tiết hơn.

## 3. Cơ quan quản lý — Workspace Mode (P2, tầm nhìn dài hạn)
Job-To-Be-Done: giám sát tổng quan tình hình thụ hưởng chính sách, phát hiện sớm khi văn bản mới ban hành có nguy cơ chồng lấp/mâu thuẫn với văn bản hiện hành trước khi công bố rộng rãi.

Journey (mức khái niệm): Đăng nhập Workspace → Dashboard tổng quan (số lượt tra cứu, xu hướng câu hỏi phổ biến — ẩn danh, không lộ dữ liệu cá nhân người dân) → nhận cảnh báo từ Legal Diff khi hệ thống phát hiện chồng lấp (`knowledge/agents/legal_diff.md`) → xem chi tiết văn bản liên quan → (dài hạn) xác nhận/chú thích chính thức để nâng `do_tin_cay` từ "đang xác minh" lên "đã xác minh" cho toàn hệ thống.

**Lưu ý quan trọng**: vai trò Cơ quan quản lý có khả năng trở thành **nguồn xác thực chính thức** cho Knowledge Graph (khép vòng Fact Check) — đây là hướng mở rộng có giá trị chiến lược cao nhất trong 3 nhóm, nên ưu tiên thiết kế chi tiết ngay sau khi P0 (Người dân) hoàn thành, trước cả Doanh nghiệp.

## Ghi chú chung
Chỉ Journey #1 (Người dân) thuộc phạm vi demo 48h. Journey #2 và #3 phục vụ Sitemap/Screen List như tầm nhìn nền tảng — đánh dấu rõ P1/P2 ở các file tiếp theo để không gây hiểu nhầm là cần build ngay.
