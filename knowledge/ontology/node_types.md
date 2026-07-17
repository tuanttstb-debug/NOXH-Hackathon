# Ontology — Node Types

> Mở rộng chi tiết từ `docs/07_KNOWLEDGE_GRAPH.md`. Đây là Single Source of Truth cho định nghĩa node — mọi agent/prompt phải dùng đúng tên trường ở đây.

## VanBan (Văn bản)
| Thuộc tính | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| ma_hieu | string | Có | VD: "100/2024/NĐ-CP" |
| ten | string | Có | |
| loai | enum(Luật, Nghị định, Thông tư) | Có | |
| ngay_ban_hanh | date | Có | |
| ngay_hieu_luc | date | Có | Có thể bị văn bản khác thay đổi — xem `phap_ly/luat/luat_nha_o_2023.md` làm ví dụ |
| trang_thai | enum(đang hiệu lực, đã sửa đổi một phần, hết hiệu lực) | Có | |
| nguon | url | Có | Bắt buộc cho Citation First |

## DieuKhoan (Điều/Khoản)
| Thuộc tính | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| ma_dieu_khoan | string | Có | VD: "Điều 30 khoản 1" |
| van_ban_id | ref(VanBan) | Có | |
| noi_dung_tom_tat | text | Có | Tóm tắt, không phải toàn văn (trừ khi có sẵn) |
| khia_canh | string | Không | Dùng khi một Điều bị sửa theo nhiều nhánh nội dung khác nhau — xem `relationship_types.md` |
| ngay_hieu_luc | date | Có | |
| ngay_het_hieu_luc | date | Không | Chỉ điền khi đã bị thay thế |
| trang_thai_hieu_luc | enum(đang hiệu lực, đã bị thay thế) | Có | Trường bắt buộc quan trọng nhất của toàn Knowledge Graph |

## DieuKienThuHuong (Điều kiện thụ hưởng)
| Thuộc tính | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| loai_dieu_kien | enum(nhà ở, thu nhập, cư trú) | Có | |
| dieu_khoan_id | ref(DieuKhoan) | Có | |
| mo_ta | text | Có | |

## NguongSo (Ngưỡng số liệu)
| Thuộc tính | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| ten_nguong | string | Có | VD: "tran_thu_nhap_doc_than" |
| gia_tri | number | Có | |
| don_vi | string | Có | VD: "VNĐ/tháng" |
| ap_dung_tu_ngay | date | Có | |
| dieu_khoan_id | ref(DieuKhoan) | Có | |
| do_tin_cay | enum(đã xác minh, đang xác minh) | Có | Bắt buộc "đang xác minh" nếu chưa đối chiếu văn bản gốc — xem RISK ở `docs/12_QUAN_LY_RUI_RO.md` |

## DoiTuongThuHuong (Nhóm đối tượng)
| Thuộc tính | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| ten_nhom | string | Có | VD: "độc thân chưa kết hôn" |
| mo_ta | text | Không | |

## Nguyên tắc chung
Mọi node đều phải truy vết được về `VanBan` gốc (trực tiếp hoặc qua `DieuKhoan`) — không có node "mồ côi" không rõ nguồn.
