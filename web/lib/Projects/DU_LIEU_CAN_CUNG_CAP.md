# Dữ liệu cần cung cấp — Project Intelligence

> Gửi tới chủ dự án. Đặt file vào chính thư mục này (`web/lib/Projects/`), định dạng nào cũng được
> (Word, PDF, Excel, hoặc gõ thẳng vào file `du_lieu.md` cạnh file này) — tôi sẽ chuẩn hoá sang TypeScript.
> Cách này đã chạy tốt với 14 văn bản pháp lý ở `web/lib/Legal/`.

## Nguyên tắc (quan trọng hơn số lượng)

1. **Chỉ dữ liệu có thật, có nguồn tra được.** Mỗi con số phải kèm link. Không có nguồn thì **để trống** — hệ thống hiển thị "chưa có dữ liệu" là chấp nhận được, hiển thị số bịa thì không.
2. **2–3 dự án là đủ.** BRD gốc đề xuất 20; `docs/technical/10_TECHNICAL_DECISION.md` đã hạ xuống 2–3 cho kịch bản dưới 24h. Một dự án đầy đủ và đúng ăn điểm hơn mười dự án lỗ chỗ.
3. **Không tự tạo rủi ro giả.** Nếu 2–3 dự án bạn chọn không có tin tức tiêu cực thật, khối "Rủi ro" để trống — tài liệu của bạn ghi rõ điều này (§2 mục 3).

## Cần gì cho mỗi dự án

### Bắt buộc
| Trường | Ví dụ | Ghi chú |
|---|---|---|
| Tên chính thức | "Khu nhà ở xã hội Lê Thành Tân Kiên" | |
| Tên gọi khác | "Lê Thành Tân Kiên", "NOXH Tân Kiên" | Người dùng gõ tên nào cũng tra được |
| Địa chỉ | | |
| Tỉnh/thành phố | | Dùng để nối với hệ số điều chỉnh thu nhập cấp tỉnh |
| Quận/huyện | | |
| Chủ đầu tư (tên pháp nhân đầy đủ) | | |
| **Nguồn** cho các thông tin trên | link + ngày bạn tra | **Không được thiếu** |

### Nên có (thiếu thì để trống, không đoán)
| Trường | Ghi chú |
|---|---|
| Trạng thái pháp lý | vd "đã có giấy phép xây dựng" |
| Trạng thái xây dựng | vd "đang thi công phần thân" |
| Quy mô (số căn) | |
| Thời điểm mở bán/nhận hồ sơ | |
| Mã số thuế CĐT | |
| 1–2 câu ghi chú về CĐT | Chấp nhận viết tay, không cần tra lịch sử đầy đủ |

### Tin tức — 2 đến 3 tin mỗi dự án
Chỉ cần: **tiêu đề · link · ngày đăng · tên báo**. Tôi tự gắn nhãn tầng nguồn và sentiment.
Ưu tiên nguồn chính thống (cổng thông tin Sở Xây dựng, báo Chính phủ) hơn báo mạng.

## Nguồn gợi ý
- Cổng thông tin Sở Xây dựng tỉnh/thành nơi có dự án
- `xaydungchinhsach.chinhphu.vn`, `baochinhphu.vn`
- Cổng thông tin của chủ đầu tư

## Phần tôi làm sẵn, không cần chờ dữ liệu
Schema, pipeline suy luận, ràng buộc citation, liên kết `GOVERNED_BY` sang Legal KG, giao diện report,
và disclaimer AI Safety — tất cả đã dựng và chạy được với dữ liệu rỗng. Thả dữ liệu vào là có report.
