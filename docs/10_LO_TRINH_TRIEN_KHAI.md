# 10 — Lộ trình triển khai

> Đọc trong 5 phút.

## Giai đoạn 1: 48h Hackathon (đội 1–2 người)
| Mốc | Nội dung | Đầu ra |
|---|---|---|
| Giờ 0–8 | Xác nhận nguồn văn bản gốc, nạp Knowledge Graph tối thiểu | Dữ liệu pháp lý có nguồn, có ngày hiệu lực |
| Giờ 8–24 | Xây pipeline AI Agent (Parse → Retrieve → Reasoning → Fact-Check) | Agent trả lời đúng luồng nghiệp vụ ở `03_YEU_CAU_NGHIEP_VU.md` |
| Giờ 24–36 | Giao diện demo tối giản hiển thị kết quả + trích dẫn | Demo chạy được đầu-cuối |
| Giờ 36–44 | Kiểm thử theo Definition of Done (`14_BACKLOG.md`) | 3 kịch bản chạy đúng |
| Giờ 44–48 | Chuẩn bị kịch bản pitch | `11_KICH_BAN_DEMO.md` sẵn sàng |

*Mốc giờ tính theo % thời gian 48h, cần đối chiếu với mốc bắt đầu/kết thúc thật (xem OPEN QUESTION ở `00_MUC_LUC.md`).*

## Giai đoạn 2: Sau Hackathon (mở rộng thành sản phẩm thật)
| Hướng mở rộng | Mô tả |
|---|---|
| Mở rộng đối tượng | Thêm luồng cho doanh nghiệp/chủ đầu tư và cơ quan quản lý (đã loại khỏi scope demo — xem `04_DOI_TUONG_NGUOI_DUNG.md`) |
| Mở rộng nguồn dữ liệu | Thêm văn bản cấp địa phương, Thông tư hướng dẫn |
| Nâng cấp hạ tầng | Từ lưu trữ đơn giản (demo) sang Graph DB/hạ tầng production-grade (xem ADR ở `13_QUYET_DINH_KIEN_TRUC.md`) |
| Tự động hoá Ingestion | Crawl/alert văn bản mới thay vì cập nhật thủ công (xem `09_KIEN_TRUC_DU_LIEU.md`) |
| Đa lượt hội thoại | Cho phép Agent hỏi lại người dùng khi thiếu thông tin (xem OPEN QUESTION `06_KIEN_TRUC_AI_AGENT.md`) |

## Nguyên tắc xuyên suốt
Không mở rộng Giai đoạn 2 trước khi Giai đoạn 1 chứng minh được nguyên tắc cốt lõi (Grounding + Citation + Fact-Check) chạy đúng.
