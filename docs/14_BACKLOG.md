# 14 — Backlog

> Đọc trong 5 phút. Hợp đồng phạm vi cho đội 1–2 người — mọi việc ngoài P0 mặc định KHÔNG làm ở bản demo.

## P0 — Bắt buộc cho demo 48h
1. Nạp Knowledge Graph tối thiểu (Luật Nhà ở 2023 + NĐ 100/2024 + 3 nghị định sửa đổi, xem `07_KNOWLEDGE_GRAPH.md`).
2. Form nhập hồ sơ: tình trạng hôn nhân, thu nhập, tình trạng nhà ở, nơi cư trú.
3. AI Agent chạy đúng pipeline 4 bước (`06_KIEN_TRUC_AI_AGENT.md`).
4. Trả kết quả 3 trạng thái (Đủ/Không đủ/Thiếu thông tin) kèm trích dẫn + ngày hiệu lực.
5. Chạy đúng 3 kịch bản demo (`11_KICH_BAN_DEMO.md`).

## P1 — Nếu còn thời gian
- Hiển thị đường link tới văn bản gốc trong kết quả (không chỉ tên điều/khoản).
- Giao diện demo chỉn chu hơn (vẫn không phải trọng tâm chấm điểm theo `02_MUC_TIEU_SAN_PHAM.md`).

## P2 — Sau Hackathon (không làm ở bản demo)
- Tài khoản người dùng, lưu lịch sử tra cứu.
- Nộp hồ sơ trực tuyến / tích hợp cơ quan quản lý.
- Đối tượng doanh nghiệp, cơ quan quản lý (`04_DOI_TUONG_NGUOI_DUNG.md`).
- Văn bản cấp địa phương (trừ khi OPEN QUESTION ở `07_KNOWLEDGE_GRAPH.md` được trả lời là "có").
- Đa ngôn ngữ, đa lượt hội thoại (`06_KIEN_TRUC_AI_AGENT.md` — OPEN QUESTION).
- Tự động hoá Ingestion, nâng cấp Graph DB thật (`13_QUYET_DINH_KIEN_TRUC.md` — ADR-02, ADR-04).

## Definition of Done (điều kiện để coi demo là "xong")
- [ ] Chạy đúng ≥ 3 kịch bản đầu vào khác nhau, có trích dẫn thật.
- [ ] Có ít nhất 1 trường hợp "Thiếu thông tin" chứng minh Agent không đoán bừa.
- [ ] Kết quả hiển thị đủ: câu trả lời, lý do, nguồn trích dẫn (điều/khoản/văn bản/ngày hiệu lực).

## Nguyên tắc
Không mở rộng sang P1/P2 khi P0 chưa chạy đúng và có trích dẫn thật từ đầu đến cuối.
