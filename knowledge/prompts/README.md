# Prompts — quy ước

Mỗi file tương ứng 1 agent trong `../agents/`. Prompt là bản nháp đầu tiên để đội build — cần tinh chỉnh khi có LLM/framework cụ thể, không phải bản final.

## Quy ước chung cho mọi prompt
1. Luôn có khối **"Dữ liệu được cấp"** (Knowledge Graph context được truy vấn sẵn, đưa vào prompt) — Agent không được tự bổ sung dữ kiện ngoài khối này.
2. Luôn có khối **"Không được làm"** liệt kê rõ hành vi cấm (bịa điều khoản, đoán khi thiếu dữ liệu...).
3. Luôn yêu cầu output theo định dạng có cấu trúc (JSON) để `fact_check` agent xử lý được bằng chương trình, không phải chỉ đọc bằng mắt.
4. Không có prompt cho `social_listening` — agent này P2, chưa build (`../agents/social_listening.md`).

## Danh sách
- `legal_reasoner.md`
- `eligibility.md`
- `fact_check.md`
- `legal_diff.md`
