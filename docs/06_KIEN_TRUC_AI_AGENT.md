# 06 — Kiến trúc AI Agent

> Đọc trong 7 phút. Mô tả cách Agent suy luận — không phải đặc tả API/code.

## Vai trò của Agent
Agent KHÔNG phải một chatbot trả lời tự do. Agent là một pipeline suy luận có kiểm soát, với một nhiệm vụ duy nhất: xác định trạng thái đủ điều kiện NOXH của một hồ sơ, có căn cứ.

## Pipeline suy luận (4 bước)
1. **Hiểu hồ sơ (Parse)**: Chuẩn hoá thông tin người dùng nhập (tình trạng hôn nhân, thu nhập, tình trạng nhà ở, khu vực) thành các biến nghiệp vụ đã định nghĩa ở `08_MO_HINH_DU_LIEU.md`.
2. **Truy vấn căn cứ (Retrieve)**: Với mỗi nhóm điều kiện ở `03_YEU_CAU_NGHIEP_VU.md`, Agent truy vấn Knowledge Graph để lấy điều khoản **đang hiệu lực tại thời điểm hỏi** — không dùng tri thức nội tại của mô hình ngôn ngữ để đoán luật.
3. **Suy luận có căn cứ (Grounded Reasoning)**: So khớp từng biến nghiệp vụ với điều kiện lấy được. Nếu thiếu biến cần thiết để so khớp → dừng lại, không suy đoán.
4. **Fact-Check & Diễn giải (Verify & Explain)**: Đối chiếu lại toàn bộ trích dẫn dự kiến với Knowledge Graph (đúng văn bản, đúng điều/khoản, còn hiệu lực) trước khi Agent được phép trả lời bằng ngôn ngữ tự nhiên.

## Quy tắc quyết định 3 trạng thái đầu ra
| Trạng thái | Điều kiện kích hoạt |
|---|---|
| **Đủ điều kiện** | Tất cả nhóm điều kiện đều so khớp đạt, có trích dẫn xác minh |
| **Không đủ điều kiện** | Có ít nhất một nhóm điều kiện so khớp không đạt, có trích dẫn xác minh |
| **Thiếu thông tin** | Thiếu biến đầu vào cần thiết, HOẶC không xác định được văn bản đang hiệu lực (ví dụ trường hợp chồng lấp — xem `12_QUAN_LY_RUI_RO.md`) |

## Vì sao không dùng LLM "tự do trả lời"
Nếu để mô hình ngôn ngữ tự trả lời câu hỏi pháp lý từ tri thức huấn luyện sẵn có, rủi ro trích dẫn sai/lỗi thời rất cao — đặc biệt khi văn bản NOXH thay đổi thường xuyên hơn tốc độ cập nhật của mô hình. Vì vậy Agent bắt buộc phải Grounding vào Knowledge Graph tự quản lý (xem nguyên tắc ở `05_KIEN_TRUC_GIAI_PHAP.md`).

## Giới hạn được thiết kế có chủ đích (bản demo)
- Agent xử lý một loại câu hỏi duy nhất (đủ điều kiện thụ hưởng), không xử lý hội thoại đa lượt phức tạp.
- Không có bộ nhớ hội thoại dài hạn — mỗi phiên là một hồ sơ độc lập.

## OPEN QUESTION
- Có cần Agent hỏi lại người dùng để bổ sung thông tin còn thiếu (multi-turn), hay chỉ báo "Thiếu thông tin" và dừng? Ảnh hưởng độ phức tạp pipeline — cần quyết định trước khi build.
