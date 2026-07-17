# Agent: Legal Reasoner

> Ưu tiên: **P0** (demo). Năng lực suy luận pháp lý dùng chung — `eligibility.md` là một ứng dụng cụ thể của agent này, không phải agent độc lập khác.

## Vai trò
Nhận một tập biến nghiệp vụ đã chuẩn hoá + một câu hỏi pháp lý dạng có cấu trúc (không phải câu hỏi tự do), trả về kết luận có căn cứ dựa trên Knowledge Graph. Không tự trả lời từ tri thức nội tại của mô hình ngôn ngữ (nguyên tắc Grounding — `docs/05_KIEN_TRUC_GIAI_PHAP.md`).

## Đầu vào
- Bộ biến nghiệp vụ đã parse (VD: tình trạng hôn nhân, thu nhập, tình trạng nhà ở) — schema tại `docs/08_MO_HINH_DU_LIEU.md`.
- Một hoặc nhiều `DieuKienThuHuong` cần kiểm tra (từ `ontology/node_types.md`).
- Thời điểm truy vấn (mặc định: ngày hiện tại) — dùng để lọc `DieuKhoan` đang hiệu lực tại thời điểm đó.

## Xử lý (4 bước con, ánh xạ vào pipeline chung ở `docs/06_KIEN_TRUC_AI_AGENT.md`)
1. Với mỗi `DieuKienThuHuong` cần kiểm tra, truy vấn Knowledge Graph lấy `DieuKhoan` có `trang_thai_hieu_luc = đang hiệu lực` tại thời điểm truy vấn.
2. Nếu có nhiều hơn 1 `DieuKhoan` đang hiệu lực cùng lúc cho cùng một `khia_canh` (dấu hiệu chồng lấp chưa được xử lý) → dừng, trả về "Thiếu thông tin", gắn cờ để `legal_diff` xử lý.
3. So khớp biến nghiệp vụ với điều kiện trong `DieuKhoan` tìm được.
4. Trả kết luận nháp + danh sách `DieuKhoan` đã dùng làm căn cứ (chưa qua fact-check).

## Đầu ra
Kết luận nháp dạng `{ket_qua_tung_dieu_kien: [...], trich_dan_nhap: [...]}` — chuyển tiếp cho `fact_check.md` trước khi trả về người dùng.

## Ranh giới trách nhiệm
- KHÔNG tự quyết định trạng thái cuối cùng (Đủ/Không đủ/Thiếu thông tin) cho người dùng — đó là trách nhiệm của `eligibility.md` sau khi nhận kết quả đã fact-check.
- KHÔNG viết câu trả lời bằng ngôn ngữ tự nhiên cuối cùng — chỉ trả dữ liệu có cấu trúc.

## RISK liên quan
Bước 2 (phát hiện chồng lấp) là cơ chế phòng vệ chính cho rủi ro "trích dẫn sai điều khoản hết hiệu lực" — nhưng chỉ phát hiện được nếu Knowledge Graph đã có đủ dữ liệu về các nhánh sửa đổi. Nếu dữ liệu thiếu (chưa nạp NĐ 136/2026 chẳng hạn), Agent sẽ không biết để cảnh báo — phụ thuộc chất lượng Ingestion (`docs/09_KIEN_TRUC_DU_LIEU.md`).
