# Datasets — chưa có dữ liệu thật

> Chưa tạo dataset giả định trong thư mục này — vi phạm nguyên tắc "không tự giả định" của dự án nếu dùng số liệu chưa xác minh làm dữ liệu chính thức.

## Schema dự kiến khi có dữ liệu thật
Theo `docs/08_MO_HINH_DU_LIEU.md` và `ontology/node_types.md`:
- `van_ban.csv` / `.json` — danh sách văn bản (VanBan).
- `dieu_khoan.csv` / `.json` — danh sách điều khoản (DieuKhoan), có `trang_thai_hieu_luc`.
- `nguong_so.csv` / `.json` — các ngưỡng số liệu (NguongSo), có `do_tin_cay`.
- `test_profiles.csv` — hồ sơ người dùng mẫu, tương ứng các test case ở `../evaluation/eligibility_test_cases.md`.

## Điều kiện để tạo dataset chính thức
Chỉ tạo file dữ liệu thật trong thư mục này sau khi:
1. Có văn bản gốc/toàn văn hợp nhất (OPEN QUESTION đang mở ở `../phap_ly/nghi_dinh/nghi_dinh_136_2026.md` và các file `phap_ly/` khác).
2. Đã đối chiếu và gắn `do_tin_cay = đã xác minh` cho từng bản ghi.

## TODO
- [ ] Khi có văn bản gốc, chuyển nội dung từ `../phap_ly/` (hiện ở dạng markdown mô tả) thành dữ liệu có cấu trúc (CSV/JSON) tại đây.
