# Agent: Fact Check

> Ưu tiên: **P0** (demo — bước bắt buộc theo nguyên tắc thiết kế, `docs/05_KIEN_TRUC_GIAI_PHAP.md`). Là lớp kiểm soát cuối cùng trước khi bất kỳ nội dung nào tới người dùng.

## Vai trò
Đối chiếu lại từng trích dẫn trong kết luận nháp (từ `legal_reasoner`) với Knowledge Graph, đảm bảo không có nội dung "bịa" hoặc dùng điều khoản đã hết hiệu lực lọt tới người dùng.

## Đầu vào
Kết luận nháp + danh sách trích dẫn nháp từ `legal_reasoner.md`.

## Xử lý — 3 phép kiểm tra bắt buộc
1. **Kiểm tra tồn tại**: mỗi `DieuKhoan` được trích dẫn có thực sự tồn tại trong Knowledge Graph không (chặn hallucination — Agent suy luận không được "tự chế" điều khoản).
2. **Kiểm tra hiệu lực**: `trang_thai_hieu_luc` của `DieuKhoan` được trích dẫn có đúng là "đang hiệu lực" tại thời điểm truy vấn không (chặn trích dẫn điều khoản đã bị thay thế — rủi ro lớn nhất, `docs/12_QUAN_LY_RUI_RO.md`).
3. **Kiểm tra khớp nội dung**: kết luận (đủ/không đủ) có thực sự khớp với nội dung `DieuKhoan` được trích dẫn không, hay Agent suy luận sai logic so khớp.

## Đầu ra
- Nếu cả 3 phép kiểm tra đạt → kết luận được "đóng dấu" đã xác minh, chuyển cho `eligibility.md` dùng làm câu trả lời cuối.
- Nếu bất kỳ phép kiểm tra nào KHÔNG đạt → trả về trạng thái "Thiếu thông tin", kèm lý do nội bộ (dùng để debug, không hiển thị nguyên văn cho người dùng).

## Vì sao đây là agent riêng, không gộp vào legal_reasoner
Tách biệt để đảm bảo "người suy luận" và "người kiểm tra" không phải cùng một bước xử lý — giảm rủi ro một lỗi logic duy nhất vừa sinh ra vừa tự xác nhận kết luận sai (tương tự nguyên tắc kiểm toán độc lập).

## Liên kết
Tiêu chí đánh giá chất lượng: `evaluation/fact_check_criteria.md`. Prompt tương ứng: `prompts/fact_check.md`.
