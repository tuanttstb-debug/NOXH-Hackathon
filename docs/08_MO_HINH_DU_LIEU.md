# 08 — Mô hình dữ liệu

> Đọc trong 6 phút. Mô hình khái niệm (logical data model) — mô tả các trường dữ liệu cần có, không phải DDL/code.

## Nhóm 1: Dữ liệu pháp lý (nạp vào Knowledge Graph)
| Thực thể | Trường chính | Ghi chú |
|---|---|---|
| `VanBan` | ma_hieu, ten, loai (Luật/Nghị định), ngay_ban_hanh, ngay_hieu_luc, trang_thai | trang_thai: đang hiệu lực / đã sửa đổi một phần / hết hiệu lực |
| `DieuKhoan` | ma_dieu_khoan, van_ban_id, noi_dung_tom_tat, ngay_hieu_luc, ngay_het_hieu_luc (nếu có), trang_thai_hieu_luc | Bắt buộc điền `trang_thai_hieu_luc` — xem `07_KNOWLEDGE_GRAPH.md` |
| `DieuKienThuHuong` | loai_dieu_kien (nhà ở/thu nhập/cư trú), dieu_khoan_id, mo_ta | |
| `NguongSo` | ten_nguong (VD: tran_thu_nhap_doc_than), gia_tri, don_vi, ap_dung_tu_ngay, dieu_khoan_id | |

## Nhóm 2: Hồ sơ người dùng (input của Eligibility Checker)
| Trường | Kiểu | Bắt buộc |
|---|---|---|
| tinh_trang_hon_nhan | độc thân / độc thân nuôi con / đã kết hôn | Có |
| thu_nhap_thang | số (VNĐ) | Có |
| tinh_trang_nha_o | đã có nhà / chưa có nhà / không rõ | Có |
| noi_cu_tru_lam_viec | text | Có |

## Nhóm 3: Kết quả trả về (output của Eligibility Checker)
| Trường | Kiểu | Ghi chú |
|---|---|---|
| trang_thai | Đủ điều kiện / Không đủ điều kiện / Thiếu thông tin | Xem quy tắc quyết định ở `06_KIEN_TRUC_AI_AGENT.md` |
| ly_do | text | Ngôn ngữ thường, không thuật ngữ luật thuần |
| trich_dan[] | danh sách {van_ban, dieu_khoan, ngay_hieu_luc} | Bắt buộc với trạng thái Đủ/Không đủ |
| ghi_chu_do_tin_cay | text (tuỳ chọn) | Dùng khi dữ liệu "đang xác minh" — xem RISK ở `12_QUAN_LY_RUI_RO.md` |

## Nguyên tắc thiết kế dữ liệu
- Không lưu số liệu pháp lý (ví dụ trần thu nhập) dưới dạng hằng số cứng trong logic Agent — phải lấy từ `NguongSo` trong Knowledge Graph, để khi luật đổi chỉ cần cập nhật dữ liệu, không sửa logic.
- Mọi bản ghi `DieuKhoan`/`NguongSo` phải truy vết được về `VanBan` gốc (đáp ứng yêu cầu Citation First).

## Liên kết
- Kiến trúc lưu trữ & luồng nạp dữ liệu: `09_KIEN_TRUC_DU_LIEU.md`
