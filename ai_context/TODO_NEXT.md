# TODO_NEXT — NOXH Copilot

> Ưu tiên cho phiên làm việc tiếp theo. Tổng hợp từ `../docs/16_DESIGN_REVIEW.md` (5 khuyến nghị hành động), `../docs/14_BACKLOG.md` (Definition of Done P0), và các OPEN QUESTION đang chặn tiến độ. Cập nhật gần nhất: **2026-07-17**.

## P0 — Chặn demo, làm trước tiên
1. **Build pipeline AI Agent thật (dù thô)** — hiện tại 0% có lệnh gọi LLM nào. Đây là khoảng cách lớn nhất giữa tài liệu và sản phẩm ("Potemkin AI" risk, `../docs/16_DESIGN_REVIEW.md` mục AI-Native). Bắt đầu với 1 luồng end-to-end đơn giản nhất: nhận input hồ sơ → truy vấn dữ liệu pháp lý (`knowledge/phap_ly/`, dù còn "đang xác minh") → gọi LLM với grounding → trả 1 trong 3 verdict kèm trích dẫn. Nếu kiến trúc 4-agent (ADR-03 đề xuất 1-agent) không khả thi trong thời gian còn lại, giảm xuống 1–2 bước gộp và ghi lại lý do (cập nhật `../docs/13_QUYET_DINH_KIEN_TRUC.md`).
2. **Quyết định provider LLM + cách gọi API** — chưa có ràng buộc từ BTC (`../docs/13_QUYET_DINH_KIEN_TRUC.md` mục cuối), chưa chọn cụ thể. Cần: chọn model, thiết lập API key (biến môi trường, KHÔNG hard-code), viết prompt thật dựa trên `knowledge/prompts/*.md` (hiện là bản nháp).
3. **Nối frontend đã dựng với backend/API thật** — 3 màn hình hiện dùng 100% mock data (`web/mock/`). Cần route API (Next.js Route Handler hoặc backend riêng) để `use-eligibility-chat.ts` gọi pipeline thật thay vì trả dữ liệu tĩnh.
4. **Viết ≥2 test case đối kháng (red-team)** bổ sung cho `knowledge/evaluation/eligibility_test_cases.md` (hiện chỉ có kịch bản thuận) — ví dụ: người dùng năn nỉ AI trả lời chắc chắn khi thiếu dữ liệu. Bằng chứng Safety mạnh nhất nếu giám khảo hỏi khó.
5. **Rehearsal demo ≥1 lần với dữ liệu thật** theo `../docs/11_KICH_BAN_DEMO.md` (3 kịch bản: Đủ điều kiện / Không đủ / Thiếu thông tin), có kế hoạch dự phòng khi lỗi. Hiện tại: 0 lần.
6. **Chạy `npm run lint`** trong `web/` ít nhất 1 lần trước khi coi bất kỳ màn hình nào là hoàn thiện (tự ghi nhận nợ trong `web/README.md`).

## P1 — Nếu còn thời gian sau P0
- Hiển thị link tới văn bản gốc trong kết quả (không chỉ tên điều/khoản) — `../docs/14_BACKLOG.md`.
- Màn hình 4 (Legal Search) — bước tiếp theo được ghi nhận ở `../docs/00_PROJECT_MEMORY.md`.
- Giao diện chỉn chu hơn cho 3 màn hình đã dựng (không phải trọng tâm chấm điểm).
- `git init` cho toàn bộ dự án nếu người dùng muốn có version control/rollback an toàn — hiện KHÔNG phải git repo (xem `TECH_DEBT.md`). Chưa tự ý làm — cần hỏi người dùng trước.

## OPEN QUESTION cần người dùng trả lời (chặn quyết định, không tự suy diễn)
Đầy đủ ở `../docs/00_MUC_LUC.md` mục "Cần bạn xác nhận sớm nhất". Ưu tiên hỏi lại nếu bắt đầu phiên mới:
1. Toàn văn hợp nhất mới nhất NĐ 100/2024/NĐ-CP — chưa có thì rủi ro trích dẫn sai điều khoản hết hiệu lực (chặn P0 #1).
2. Mốc thời gian 48h chính xác + rubric chấm điểm — ảnh hưởng mức độ ưu tiên P0 vs P1.
3. Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng — ảnh hưởng thiết kế pipeline P0 #1.
4. Thời lượng demo trước giám khảo — ảnh hưởng kịch bản `11_KICH_BAN_DEMO.md`.
5. Mức trần thu nhập nhóm "độc thân nuôi con"/"đã kết hôn" có bị NĐ 136/2026 sửa hay giữ theo NĐ 261/2025 — ảnh hưởng độ đúng của Eligibility Checker.

## Nguyên tắc khi làm P0
Không mở rộng sang P1/P2 khi P0 chưa chạy đúng và có trích dẫn thật từ đầu đến cuối (`../docs/14_BACKLOG.md`). Không viết thêm tài liệu mới trong `docs/`/`knowledge/` trừ khi cần thiết để build P0 — giá trị biên của tài liệu đã giảm dần theo kết luận `../docs/16_DESIGN_REVIEW.md`.
