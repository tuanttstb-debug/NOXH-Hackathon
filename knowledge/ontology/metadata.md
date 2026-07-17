# Ontology — Metadata (Provenance & Độ tin cậy)

> Khác với `node_types.md` (hình dạng dữ liệu nghiệp vụ), tài liệu này định nghĩa các trường metadata bắt buộc đi kèm MỌI node/quan hệ, phục vụ Fact Check và Data Lineage (`docs/09_KIEN_TRUC_DU_LIEU.md`).

## Trường metadata bắt buộc cho mọi node
| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| nguon_id | string | Link/tham chiếu tới nguồn dữ liệu gốc |
| ngay_cap_nhat | date | Ngày node được nạp/cập nhật lần cuối trong Knowledge Graph |
| do_tin_cay | enum(đã xác minh, đang xác minh) | "đã xác minh" chỉ khi đối chiếu văn bản gốc/Công báo; "đang xác minh" khi lấy từ nguồn thứ cấp (báo, trang tổng hợp) |
| nguoi_nhap_lieu | string | Ai/agent nào nạp dữ liệu này — phục vụ truy vết khi có sai sót |

## Quy tắc sử dụng `do_tin_cay`
- Toàn bộ dữ liệu trong `phap_ly/` hiện đang ở trạng thái **"đang xác minh"** vì lấy từ báo/trang tổng hợp, chưa đối chiếu Công báo/toàn văn chính thức (xem OPEN QUESTION lặp lại ở nhiều file `phap_ly/`).
- `agents/eligibility.md` và `agents/fact_check.md` **bắt buộc** đọc trường này: nếu `do_tin_cay = đang xác minh`, câu trả lời cuối cùng cho người dùng phải kèm ghi chú rõ ràng (`ghi_chu_do_tin_cay` trong `docs/08_MO_HINH_DU_LIEU.md`), không được trình bày như sự thật tuyệt đối.

## Metadata riêng cho quan hệ `SUA_DOI_BOI_SUNG` / `THAY_THE`
| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| khia_canh | string | Xem `relationship_types.md` |
| phat_hien_choang_lap | boolean | Đánh dấu true nếu quan hệ này được `legal_diff` agent phát hiện là chồng lấp với quan hệ khác — xem `agents/legal_diff.md` |

## Vì sao cần tách riêng file này
Việc tách metadata khỏi node_types giúp: (1) không làm rối schema nghiệp vụ chính, (2) cho phép nâng cấp cơ chế xác minh/độ tin cậy độc lập với việc mở rộng loại thực thể nghiệp vụ.
