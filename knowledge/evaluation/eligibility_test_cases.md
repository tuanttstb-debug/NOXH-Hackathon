# Test Cases: Eligibility

> Hiện thực hoá Definition of Done ở `docs/14_BACKLOG.md`. Số liệu dùng dưới đây có `do_tin_cay = đang xác minh` (`ontology/metadata.md`) — cập nhật khi có Knowledge Graph chính thức.

## TC-01: Đủ điều kiện
| Trường | Giá trị |
|---|---|
| Tình trạng hôn nhân | Độc thân chưa kết hôn |
| Thu nhập/tháng | 18.000.000 VNĐ |
| Tình trạng nhà ở | Chưa có nhà |
| Kết quả kỳ vọng | Đủ điều kiện |
| Lý do kỳ vọng | Thu nhập 18tr < trần 25tr (NĐ 136/2026) và < trần 20tr cũ (NĐ 261/2025) — đạt ở cả hai mốc, không phụ thuộc việc chồng lấp |

## TC-02: Không đủ điều kiện
| Trường | Giá trị |
|---|---|
| Tình trạng hôn nhân | Độc thân chưa kết hôn |
| Thu nhập/tháng | 30.000.000 VNĐ |
| Tình trạng nhà ở | Chưa có nhà |
| Kết quả kỳ vọng | Không đủ điều kiện |
| Lý do kỳ vọng | Vượt trần 25tr (NĐ 136/2026, mốc mới nhất) |

## TC-03: Thiếu thông tin — thiếu trường bắt buộc
| Trường | Giá trị |
|---|---|
| Tình trạng hôn nhân | (không nhập) |
| Thu nhập/tháng | 15.000.000 VNĐ |
| Kết quả kỳ vọng | Thiếu thông tin |
| Lý do kỳ vọng | Thiếu `tinh_trang_hon_nhan` — không xác định được nhóm trần thu nhập áp dụng |

## TC-04: Thiếu thông tin — vùng chồng lấp dữ liệu (kịch bản demo trọng tâm)
| Trường | Giá trị |
|---|---|
| Tình trạng hôn nhân | Độc thân nuôi con dưới tuổi thành niên |
| Thu nhập/tháng | 28.000.000 VNĐ |
| Kết quả kỳ vọng | Thiếu thông tin |
| Lý do kỳ vọng | Trần cho nhóm này (30tr theo NĐ 261/2025) chưa được xác nhận có bị NĐ 136/2026 sửa hay không (`phap_ly/nghi_dinh/nghi_dinh_136_2026.md` — OPEN QUESTION) — hệ thống phải từ chối kết luận chắc chắn thay vì đoán |

## Ghi chú
TC-04 là bằng chứng quan trọng nhất cho giám khảo (`docs/11_KICH_BAN_DEMO.md` — Kịch bản 3): hệ thống biết giới hạn tri thức của chính nó.
