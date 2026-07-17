# Agent: Eligibility

> Ưu tiên: **P0** (demo — đây là tính năng chính của bản demo, xem `docs/12_prd...` cũ nay là `docs/14_BACKLOG.md`). Là lớp ứng dụng gọi `legal_reasoner`, không tự suy luận pháp lý.

## Vai trò
Là điểm vào (entry point) cho use case Eligibility Checker (`docs/04_DOI_TUONG_NGUOI_DUNG.md`, `docs/14_BACKLOG.md`). Nhận hồ sơ người dùng thô, điều phối `legal_reasoner` + `fact_check`, quyết định 1 trong 3 trạng thái đầu ra, soạn câu trả lời cuối bằng ngôn ngữ tự nhiên.

## Đầu vào
Hồ sơ người dùng thô theo schema `docs/08_MO_HINH_DU_LIEU.md` (tinh_trang_hon_nhan, thu_nhap_thang, tinh_trang_nha_o, noi_cu_tru_lam_viec).

## Xử lý
1. **Validate**: kiểm tra đủ trường bắt buộc chưa. Thiếu → trả "Thiếu thông tin" ngay, không gọi `legal_reasoner`.
2. **Điều phối**: với từng nhóm điều kiện (nhà ở, thu nhập, cư trú — `docs/03_YEU_CAU_NGHIEP_VU.md`), gọi `legal_reasoner` lấy kết luận nháp.
3. **Fact-Check**: chuyển toàn bộ kết luận nháp cho `fact_check.md` xác minh trước khi dùng.
4. **Quyết định trạng thái cuối** theo bảng quy tắc ở `docs/06_KIEN_TRUC_AI_AGENT.md` (Đủ / Không đủ / Thiếu thông tin).
5. **Soạn câu trả lời**: chuyển kết luận có cấu trúc thành ngôn ngữ tự nhiên dễ hiểu (không dùng thuật ngữ luật thuần) + đính kèm trích dẫn đã fact-check.

## Đầu ra
Đối tượng kết quả theo schema `docs/08_MO_HINH_DU_LIEU.md` — `{trang_thai, ly_do, trich_dan[], ghi_chu_do_tin_cay?}`.

## Ràng buộc bắt buộc
- Không trả lời "Đủ điều kiện" hoặc "Không đủ điều kiện" nếu bất kỳ trích dẫn nào có `do_tin_cay = đang xác minh` mà không kèm `ghi_chu_do_tin_cay` — xem `ontology/metadata.md`.
- Không xử lý câu hỏi ngoài phạm vi Eligibility Checker (VD: hỏi về thủ tục nộp hồ sơ) — trả lời rằng câu hỏi ngoài phạm vi demo, tránh trả lời bừa.

## Liên kết
Kịch bản kiểm thử cụ thể: `evaluation/eligibility_test_cases.md`. Prompt tương ứng: `prompts/eligibility.md`.
