# 03 — Yêu cầu nghiệp vụ

> Đọc trong 6 phút. Yêu cầu nghiệp vụ cho luồng Eligibility Checker — nguồn quy tắc nghiệp vụ chi tiết nằm ở `07_KNOWLEDGE_GRAPH.md`, tài liệu này chỉ nêu yêu cầu ở mức nghiệp vụ.

## Nghiệp vụ cốt lõi: Xác định điều kiện thụ hưởng NOXH
Hệ thống phải xác định một cá nhân có đủ điều kiện mua/thuê mua NOXH hay không, dựa trên tối thiểu các nhóm điều kiện theo Luật Nhà ở 2023 và Nghị định 100/2024/NĐ-CP (cùng các sửa đổi):

| Nhóm điều kiện | Mô tả nghiệp vụ | Ghi chú |
|---|---|---|
| Điều kiện về nhà ở | Chưa có nhà ở thuộc sở hữu hoặc chưa được hưởng chính sách hỗ trợ nhà ở khác | Điều 29 NĐ 100/2024 (đã sửa bởi NĐ 54/2026) |
| Điều kiện về thu nhập | Thu nhập bình quân hàng tháng không vượt trần quy định, phân theo tình trạng hôn nhân | Điều 30 NĐ 100/2024 (đã sửa bởi NĐ 261/2025, NĐ 136/2026 — **có chồng lấp, xem RISK ở `12_QUAN_LY_RUI_RO.md`**) |
| Điều kiện về cư trú/nơi làm việc | Không còn yêu cầu hộ khẩu giấy khắt khe như luật cũ | Luật Nhà ở 2023 |

## Yêu cầu nghiệp vụ bắt buộc
1. **Không được kết luận khi thiếu dữ liệu đầu vào cần thiết** — phải trả về trạng thái "Thiếu thông tin", không suy đoán.
2. **Mọi kết luận phải trích dẫn đúng văn bản đang hiệu lực tại thời điểm truy vấn** — không dùng điều khoản đã bị thay thế.
3. **Phải hiển thị ngày hiệu lực của văn bản được trích dẫn** — để người dùng tự đối chiếu nếu nghi ngờ.
4. **Không tự suy diễn quy tắc nghiệp vụ chưa có văn bản xác nhận** — nếu văn bản hợp nhất chưa có, hệ thống phải gắn nhãn "đang xác minh" thay vì khẳng định chắc chắn.

## Ngoài phạm vi nghiệp vụ (bản demo)
- Không xử lý nghiệp vụ nộp hồ sơ, phê duyệt, hậu kiểm.
- Không xử lý nghiệp vụ cho doanh nghiệp/chủ đầu tư (điều kiện dự án, quỹ đất...).
- Không xử lý văn bản cấp địa phương trừ khi được xác nhận cần thiết.

## OPEN QUESTION
- Ngưỡng thu nhập chính xác áp dụng tại thời điểm demo (do 2 nghị định 2026 chồng lấp) — xem `07_KNOWLEDGE_GRAPH.md` và `12_QUAN_LY_RUI_RO.md`.
