# Evaluation — quy ước

Thư mục này chứa test case và tiêu chí đánh giá cho các agent P0. Mục tiêu: biến Definition of Done (`docs/14_BACKLOG.md`) thành các trường hợp kiểm thử cụ thể, chạy được.

## Danh sách
- `eligibility_test_cases.md` — 3 kịch bản bắt buộc (Đủ/Không đủ/Thiếu thông tin) + biến thể.
- `fact_check_criteria.md` — tiêu chí đánh giá độ chính xác của lớp fact-check.

## Nguyên tắc
- Mỗi test case phải có: input cụ thể, kết quả kỳ vọng, và **lý do kỳ vọng** (trỏ về điều khoản cụ thể) — không chỉ input/output, để việc kiểm thử tự nó cũng minh hoạ Citation First.
- Chưa có `datasets/` thật (xem `../datasets/README.md`) nên test case dưới đây dùng số liệu "đang xác minh" — phải cập nhật lại khi có Knowledge Graph chính thức.
