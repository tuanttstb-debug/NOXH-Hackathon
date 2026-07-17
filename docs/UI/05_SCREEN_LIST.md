# 05 — Screen List

> **Cập nhật quan trọng**: sau đánh giá AI-Native (`10_AI_NATIVE_UX_REVIEW.md`, `11_AI_NATIVE_REDESIGN.md`), các mục #1–7 dưới đây vẫn đúng về NỘI DUNG cần có, nhưng KHÔNG còn là 7 điểm-đến điều hướng riêng biệt cho luồng Người dân — chúng là các khối nội dung xuất hiện trong một thread liên tục. Đọc `11` trước khi dùng bảng này để dựng UI.

> Đọc trong 8 phút. Brief gợi ý một danh sách màn hình mẫu (Trang chủ, AI Workspace, Eligibility Checker, Legal Search, Fact Check, Knowledge Graph, Dashboard, Legal Diff, Social Radar, Admin...). Đã đối chiếu và **phản biện 2 điểm** trước khi chốt danh sách cuối — xem mục "Phản biện" bên dưới.

## Danh sách màn hình

| # | Tên màn hình | Đối tượng | Mục đích | Agent/dữ liệu liên quan | Ưu tiên |
|---|---|---|---|---|---|
| 1 | AI Workspace Entry | Người dân | Điểm vào duy nhất, câu hỏi trung tâm | — | **P0** |
| 2 | Eligibility Checker — Thu thập thông tin | Người dân | Hỏi tuần tự 4 trường bắt buộc dạng hội thoại | `agents/eligibility.md` | **P0** |
| 3 | Eligibility Checker — Đang xử lý | Người dân | Hiển thị tiến trình AI có ý nghĩa (không phải spinner rỗng) | `agents/legal_reasoner.md`, `agents/fact_check.md` | **P0** |
| 4 | Eligibility Checker — Kết quả (Đủ điều kiện) | Người dân | Kết luận + giải thích + trích dẫn | `docs/08_MO_HINH_DU_LIEU.md` (output schema) | **P0** |
| 5 | Eligibility Checker — Kết quả (Không đủ điều kiện) | Người dân | Như trên, khác trạng thái | như trên | **P0** |
| 6 | Eligibility Checker — Kết quả (Thiếu thông tin) | Người dân | Trình bày như câu trả lời trung thực, không phải lỗi | như trên | **P0** |
| 7 | Chi tiết trích dẫn (Evidence panel) | Người dân + mọi vai trò | Xem văn bản gốc, ngày hiệu lực, độ tin cậy | `ontology/metadata.md` | **P0** (lồng trong 4/5/6) |
| 8 | Giới thiệu "Vì sao tin được AI này" | Người dân | Giải thích ngắn gọn nguyên tắc Grounding/Citation trước khi dùng lần đầu | `docs/05_KIEN_TRUC_GIAI_PHAP.md` | P1 |
| 9 | Legal Search (tra cứu tự do) | Mọi vai trò | Hỏi câu hỏi pháp lý mở, không chỉ Eligibility | `agents/legal_reasoner.md` | P2 |
| 10 | Workspace Home theo vai trò | Doanh nghiệp/Ngân hàng/Phòng pháp chế | Điểm vào Workspace Mode, tuỳ biến theo JTBD (`03_USER_JOURNEY.md`) | — | P2 |
| 11 | Legal Diff View | Phòng pháp chế/Cơ quan quản lý | Xem văn bản nào vừa thay đổi, khía cạnh nào bị ảnh hưởng | `agents/legal_diff.md` | P1/P2 |
| 12 | Dashboard tổng quan | Cơ quan quản lý | Xu hướng tra cứu ẩn danh, sức khoẻ Knowledge Graph | — | P2 |
| 13 | Knowledge Graph Explorer | Cơ quan quản lý/Admin | Xem trực quan thực thể/quan hệ, phục vụ kiểm chứng | `ontology/node_types.md` | P2 |
| 14 | Xác thực dữ liệu | Cơ quan quản lý | Nâng `do_tin_cay` từ "đang xác minh" lên "đã xác minh" | `ontology/metadata.md` | P2 |
| 15 | Admin — Quản lý Knowledge Graph | Đội vận hành | Nạp/sửa văn bản, theo dõi Ingestion | `docs/09_KIEN_TRUC_DU_LIEU.md` | P2 |
| 16 | Admin — Nhật ký Fact Check | Đội vận hành | Xem tỷ lệ từ chối trả lời và lý do, phục vụ cải tiến | `agents/fact_check.md` | P2 |
| 17 | Social Radar (nguồn tin theo dõi) | Đội vận hành/Cơ quan quản lý | Phát hiện sớm văn bản mới — chỉ khi Giai đoạn 2 bắt đầu | `agents/social_listening.md` | P2 (không build trước khi P0 xong) |

## Phản biện lại danh sách gợi ý trong brief

**1. "Fact Check" KHÔNG nên là một màn hình độc lập cho người dùng cuối.**
Theo `agents/fact_check.md`, Fact Check là một **lớp kiểm soát nội bộ bắt buộc** chạy trước khi bất kỳ câu trả lời nào tới người dùng — không phải một tính năng người dùng chủ động mở ra dùng. Biến nó thành một trang riêng sẽ khiến người dùng hiểu nhầm đây là công cụ tùy chọn ("có thể bật/tắt kiểm tra"), trong khi thực chất nó luôn bật, không có lựa chọn khác. Đề xuất: Fact Check không có UI riêng cho người dùng cuối — chỉ xuất hiện gián tiếp qua badge độ tin cậy ở màn hình #7, và có UI riêng cho Admin (#16) để đội vận hành theo dõi chất lượng.

**2. "Knowledge Graph" là màn hình dành cho Admin/Cơ quan quản lý, KHÔNG phải cho người dân.**
Một biểu đồ đồ thị thực thể/quan hệ hấp dẫn về mặt kỹ thuật nhưng vô nghĩa với "anh Minh" — người chỉ cần biết "tôi có đủ điều kiện không và vì sao", không cần thấy cấu trúc dữ liệu đứng sau. Đưa Knowledge Graph Explorer thành màn hình công khai sẽ đi ngược nguyên tắc "AI ↓ Task ↓ Information ↓ Visual" (brief tự đặt ra) — đây là Visual phục vụ chính đội xây dựng, không phải Task của người dùng cuối. Giữ nó ở P2, chỉ dành cho Cơ quan quản lý/Admin.

## Tổng kết ưu tiên
P0 = 7 màn hình (một luồng duy nhất + evidence panel lồng trong) — khớp đúng phạm vi `docs/14_BACKLOG.md`. Toàn bộ phần còn lại là tầm nhìn, không phải cam kết cho bản demo.
