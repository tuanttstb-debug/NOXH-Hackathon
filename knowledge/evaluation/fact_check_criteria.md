# Tiêu chí đánh giá: Fact Check

> Dùng để đánh giá lớp `agents/fact_check.md` có đạt yêu cầu hay không, tương ứng chỉ số ở `docs/02_MUC_TIEU_SAN_PHAM.md` ("Tỷ lệ trích dẫn đúng nguồn thật = 100%").

## Tiêu chí bắt buộc (P0)
| # | Tiêu chí | Cách đo |
|---|---|---|
| 1 | Không có trích dẫn "bịa" (điều khoản không tồn tại trong Knowledge Graph) | Chạy toàn bộ test case ở `eligibility_test_cases.md`, đối chiếu thủ công từng trích dẫn |
| 2 | Không có trích dẫn dùng điều khoản đã hết hiệu lực | Kiểm tra `trang_thai_hieu_luc` của mọi `DieuKhoan` xuất hiện trong output |
| 3 | Trường hợp chồng lấp/thiếu dữ liệu luôn trả "Thiếu thông tin", không tự chọn một phương án | Chạy riêng TC-04 nhiều lần, xác nhận không có kết quả "Đủ/Không đủ" xuất hiện |

## Tiêu chí mong muốn (P1, không bắt buộc cho demo)
- Thời gian xử lý fact-check dưới vài giây để không làm chậm demo trực tiếp.
- Ghi log lý do cụ thể khi fact-check từ chối một kết luận (phục vụ debug, không phải yêu cầu người dùng thấy).

## Ngưỡng chấp nhận để coi P0 (`docs/14_BACKLOG.md`) là hoàn thành
100% test case ở `eligibility_test_cases.md` đạt tiêu chí 1–3. Không có ngoại lệ — đây là tiêu chí duy nhất trong toàn bộ dự án không cho phép "tạm chấp nhận".
