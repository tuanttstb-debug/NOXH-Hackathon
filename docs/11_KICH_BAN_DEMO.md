# 11 — Kịch bản demo

> Đọc trong 5 phút. Kịch bản trình bày trước giám khảo — viết dựa trên `14_BACKLOG.md` (Definition of Done), sẽ tinh chỉnh sau khi luồng demo chạy thật.

## Mở đầu (30 giây)
Nêu vấn đề bằng số liệu thật: chính sách NOXH đã sửa đổi 4 lần trong ~20 tháng. Đặt câu hỏi cho giám khảo: "Nếu bạn là người dân, bạn có chắc mình đang đọc đúng quy định còn hiệu lực không?"

> **Cập nhật 2026-07-18:** kịch bản dưới đây đã được viết lại theo hệ thống chạy thật (verify 6/6 test case với LLM production). Câu chữ khớp `knowledge/evaluation/eligibility_test_cases.md`.

## Kịch bản 1: Đủ điều kiện (TC-01)
Nhập: *"Tôi độc thân chưa kết hôn, thu nhập 18 triệu một tháng, chưa có nhà."*
→ **Đủ điều kiện**, trích dẫn NĐ 136/2026 Điều 30 Khoản 1, hiệu lực 07/04/2026, kèm thanh so sánh 18tr / 25tr.

## Kịch bản 2: Không đủ điều kiện (TC-02)
Nhập: *"Tôi độc thân chưa kết hôn, thu nhập 30 triệu một tháng, chưa có nhà."* (cố ý **không** nêu tỉnh)
→ **Không đủ điều kiện** theo trần trung ương 25tr, kèm câu lưu ý rằng nếu cho biết tỉnh thì kết luận có thể khác.

## Kịch bản 3: Thiếu thông tin (điểm nhấn khác biệt — TC-04)
Nhập **đúng hồ sơ của Kịch bản 2, chỉ thêm nơi ở**: *"...đang ở TP. Hồ Chí Minh."*
→ Verdict **lật từ "Không đủ" sang "Thiếu thông tin"**.

Lý do trình bày với giám khảo: NĐ 136/2026 Điều 30 khoản 1 **điểm d** cho phép UBND cấp tỉnh quyết định hệ số điều chỉnh nâng trần thu nhập theo mức sống địa phương. Hệ thống chưa có dữ liệu quyết định của TP.HCM nên **từ chối kết luận "Không đủ"** thay vì đoán.

**Vì sao kịch bản này mạnh:** đây không phải "chúng tôi thiếu dữ liệu" mà là **giới hạn có thật của pháp luật** — không thể khắc phục bằng cách đọc kỹ hơn văn bản. Và việc chỉ thêm một thông tin làm đổi verdict chứng minh hệ thống suy luận theo cấu trúc pháp lý, không khớp mẫu câu.

**Nếu giám khảo hỏi khó về kiến trúc**, trả lời thẳng: pipeline có **đúng 2 lệnh gọi LLM** (trích xuất hồ sơ, diễn giải câu trả lời). Toàn bộ phần kết luận pháp lý là code xác định đọc từ Knowledge Graph — nên không có đường nào để câu hỏi của người dùng tác động tới verdict. Đây cũng là lý do 2 test case đối kháng (nài nỉ trả lời chắc chắn; đòi bỏ qua điều kiện loại trừ) không thể fail về mặt cấu trúc.

## Kết thúc (30 giây)
Chốt lại: hệ thống không chỉ trả lời nhanh, mà biết khi nào KHÔNG nên trả lời chắc chắn — đây là khác biệt giữa Legal Intelligence và chatbot thông thường. Gợi mở hướng mở rộng (`10_LO_TRINH_TRIEN_KHAI.md`).

## OPEN QUESTION
- Thời lượng demo cho phép là bao lâu? Ảnh hưởng việc cắt/giữ phần nào trong 3 kịch bản.
