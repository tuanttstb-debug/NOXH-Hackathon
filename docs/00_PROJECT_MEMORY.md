# 00 — Project Memory: NOXH Copilot

> File neo trí nhớ cho AI (và người) khi vào lại dự án. Đọc file này trước tiên, sau đó mới đọc `00_MUC_LUC.md` để đi vào chi tiết. Không lặp nội dung chi tiết ở đây — chỉ tóm tắt trạng thái và trỏ nguồn.

## Vai trò & nguyên tắc làm việc
Khi làm việc trong dự án này, AI đóng đồng thời vai trò CPO, Enterprise Solution Architect, AI Solution Architect, Tech Lead, LegalTech Consultant, Product Designer, Technical Writer — không chỉ sinh code. Thứ tự ưu tiên tư duy: **Business Value → Product → Architecture → AI → Code**. Luôn phản biện yêu cầu trước khi triển khai nếu thấy chưa hợp lý, thay vì chiều theo. Toàn bộ tài liệu viết bằng tiếng Việt, ngắn gọn, đọc độc lập, Single Source of Truth — cập nhật tại chỗ, không tạo file trùng.

**Quy ước phân loại thông tin** dùng xuyên suốt mọi file: `FACT` (đã xác nhận), `ASSUMPTION` (giả định), `DECISION` (đã chốt), `TODO` (việc cần làm), `RISK` (rủi ro), `OPEN QUESTION` (thiếu thông tin, không tự suy diễn thành FACT).

## Dự án là gì
**NOXH Copilot** — nền tảng AI Legal Knowledge Graph giúp người dân, doanh nghiệp, cơ quan quản lý hiểu đúng quy định Nhà ở xã hội (NOXH). KHÔNG phải chatbot — là nền tảng Legal Intelligence. 6 giá trị cốt lõi: Knowledge Graph, AI Agent, Legal Reasoning, Fact Check, Eligibility Checker, Citation First, Explainable AI. Chi tiết: `01_TONG_QUAN_DU_AN.md`.

## Trạng thái đã chốt (DECISION)
| Hạng mục | Đã chốt |
|---|---|
| Bối cảnh | Hackathon 48h, phải có prototype demo được |
| Đối tượng demo | Người dân (Eligibility Checker) — doanh nghiệp/cơ quan quản lý để sau |
| Đội hình | 1–2 người, tự làm toàn bộ |
| Ràng buộc công nghệ | Không có ràng buộc từ BTC, tự do chọn |
| Use case demo duy nhất | Kiểm tra điều kiện thụ hưởng NOXH, trả 1 trong 3 trạng thái (Đủ/Không đủ/Thiếu thông tin), luôn kèm trích dẫn | 
| Nguyên tắc kiến trúc | Grounding trước, Generation sau; Fact-Check là bước bắt buộc, không tuỳ chọn |

## Bản đồ tài liệu (không lặp nội dung — chỉ trỏ)
- `docs/` (16 file, 00–15): tầng Business/Product/Architecture khái niệm. Mục lục đầy đủ: `00_MUC_LUC.md`.
- `knowledge/` (24 file): tầng tri thức chuyên sâu để build — hồ sơ từng văn bản luật (`phap_ly/`), ontology chi tiết (`ontology/`), đặc tả 5 agent (`agents/`), prompt nháp (`prompts/`), test case (`evaluation/`), dataset rỗng chờ dữ liệu thật (`datasets/`). Mục lục: `../knowledge/README.md`.
- `docs/features/` (2 file, thêm 2026-07-18): module mở rộng đề xuất, chưa build — `PROJECT_INTELLIGENCE.md` và `PUBLIC_DISCOURSE_FILTER.md`. Xem cảnh báo phụ thuộc chéo ở mục "Đề xuất mở rộng" bên dưới.
- `docs/technical/` (10 file, 01–10, thêm 2026-07-18): Technical Discovery cho riêng `PROJECT_INTELLIGENCE.md` — không viết code, chỉ discovery. Đọc `10_TECHNICAL_DECISION.md` nếu cần khuyến nghị nhanh.
- Lịch sử: bộ tài liệu ban đầu là các file phẳng (00,01,02,10-13,_index.md) đã được thay thế hoàn toàn bằng cấu trúc `docs/` + `knowledge/` hiện tại — các file phẳng cũ đã xoá, không còn tồn tại.

## Đề xuất mở rộng (DECISION treo — chưa build, cảnh báo phụ thuộc chéo)
2 module mở rộng đã có tài liệu thiết kế nhưng **0% code**, thêm vào ngày 2026-07-18, sau khi Eligibility Checker P0 (mục tiêu ban đầu, xem bảng trên) vẫn chưa hoàn thành:

1. **Project Intelligence** (`features/PROJECT_INTELLIGENCE.md`) — báo cáo tổng hợp đa nguồn cho 1 dự án NOXH cụ thể. Đã qua Technical Discovery đầy đủ (`technical/01`–`10`) — quyết định kiến trúc chính: **không dùng Postgres/DB mới, dùng file JSON/TS tĩnh** (đi ngược đề xuất mặc định của BRD, lý do: repo hiện có 0% backend). Phụ thuộc cứng vào Legal KG của Eligibility Checker cho khối "Pháp lý".
2. **Public Discourse Filter** (`features/PUBLIC_DISCOURSE_FILTER.md`) — phát hiện & gắn cờ claim sai lệch/lan nhanh về chính sách NOXH trên mạng xã hội, KHÔNG tự động xác minh/publish (chỉ định tuyến cho người xem). Tài liệu tự rút gọn scope cho "36h còn lại" (OPEN QUESTION: có cùng mốc giờ hackathon không — xem `00_MUC_LUC.md`). **Dùng chung node `Project`/`HousingProject` với Project Intelligence** (không tạo node trùng) và cần Legal KG để validate `CLAIM_CITES_DOCUMENT`.

**Cảnh báo quan trọng nhất**: cả 3 sáng kiến (Eligibility Checker, Project Intelligence, Public Discourse Filter) giờ đang cùng tồn tại ở trạng thái tài liệu/thiết kế, và 2 module sau **phụ thuộc dữ liệu lẫn nhau lẫn vào module đầu** (Legal KG) — chưa module nào có tầng dữ liệu thật. Nguyên tắc xuyên suốt dự án ("không mở rộng P1/P2 khi P0 chưa chạy đúng", `docs/14_BACKLOG.md`) áp dụng nguyên vẹn ở đây: **Eligibility Checker P0 vẫn là ưu tiên build đầu tiên** — 2 module mở rộng là tài liệu tham khảo cho giai đoạn sau, không phải việc song song.

## Rủi ro trọng yếu nhất (xem đầy đủ ở `12_QUAN_LY_RUI_RO.md`)
Khung pháp lý NOXH bị sửa đổi chồng lấp (NĐ 54/2026 và NĐ 136/2026 cùng sửa Điều 30 NĐ 100/2024/NĐ-CP nhưng khác khía cạnh nội dung). Toàn bộ dữ liệu pháp lý hiện tại trong `knowledge/phap_ly/` ở trạng thái **"đang xác minh"** (chưa đối chiếu văn bản gốc/Công báo) — đây là điểm chặn lớn nhất trước khi coi Knowledge Graph đáng tin cậy.

## OPEN QUESTION toàn dự án (chưa trả lời, gộp từ mọi file)
1. Toàn văn hợp nhất mới nhất của NĐ 100/2024/NĐ-CP.
2. Phạm vi văn bản: chỉ Trung ương hay cần thêm địa phương.
3. Mốc thời gian 48h chính xác + có rubric chấm điểm không.
4. Persona "anh Minh — công nhân khu công nghiệp" có đúng nhóm ưu tiên không.
5. Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng.
6. Thời lượng demo trước giám khảo.
7. Mức trần thu nhập nhóm "độc thân nuôi con" và "đã kết hôn" có bị NĐ 136/2026 sửa hay giữ theo NĐ 261/2025 không (`knowledge/phap_ly/nghi_dinh/nghi_dinh_136_2026.md`).
8. Có Thông tư hướng dẫn nào cần đưa vào Knowledge Graph không (`knowledge/phap_ly/thong_tu/README.md`).

## Đã bắt đầu Code (`web/`, Next.js + Tailwind + shadcn-style)
Đã dựng UI Prototype thật (không backend/API, dữ liệu mock) cho 3/10 màn hình: **Landing Page**, **AI Workspace** (màn hình quan trọng nhất — chat thread, Mini Knowledge Graph Trace, Legal Timeline Chip, Threshold Comparison Bar, Result Card 3 trạng thái, Citation Card + Confidence Badge, Evidence Panel, Side Panel Citation/Reasoning/Graph) và **Eligibility Checker** (`/eligibility` — Focus Mode: không sidebar, cột đơn, tái dùng hạ tầng hội thoại của AI Workspace qua hook `use-eligibility-chat`, thêm Checklist chuẩn bị hồ sơ + tải tóm tắt kết quả dạng file). Build (`next build`) và chạy thử (`next dev`) đều thành công cho cả 3 route. Chi tiết trạng thái từng màn hình: `web/README.md`. Tiếp theo: Màn hình 4 — Legal Search.

Ghi chú môi trường: sandbox dùng để kiểm thử có lỗi ghi file qua cầu nối Windows↔Linux (một số file bị cắt cụt khi ghi) — đã phát hiện và khắc phục toàn bộ, không ảnh hưởng khi chạy trên máy thật.

## UI/UX (`docs/UI/`, 01–09)
Đã phân tích 1 tài liệu UI tham khảo do người dùng cung cấp (TPBank BIZ — dashboard ngân hàng nội bộ, purple-first, sidebar/wizard-first) và **quyết định không kế thừa mental model điều hướng của nó** (navigation-first) vì ngược nguyên tắc AI-first của dự án — chỉ giữ lại kỷ luật hệ thống (token/state nhất quán). Đã đề xuất Information Architecture mới (mô hình 3 lớp: Entry/Workspace → Task Execution → Trust & Evidence Layer; 2 chế độ điều hướng: Focus Mode cho người dân, Workspace Mode cho tổ chức), User Journey cho 3 nhóm, Sitemap, Screen List (7 màn hình P0), Low-Fidelity Wireframe, và — sau khi người dùng phê duyệt phương án phản biện — **High-Fidelity**: Design System (màu Ink Teal `#0F6E5D` làm accent, nền trắng ngà, màu trạng thái "Thiếu thông tin" cố ý tách khỏi họ màu đỏ/lỗi), Component Spec (7 component AI-native: Question Bubble, AI Reasoning Trace, Result Status Header, Citation Card, Confidence Badge, Evidence Panel, Uncertainty Callout), và High-Fidelity Screens cho 7 màn hình P0. Toàn bộ vẫn là tài liệu mô tả — **chưa có code/CSS thật**, đó là bước tiếp theo (ngoài phạm vi yêu cầu tới nay).

Sau đó, đóng vai Design Director Microsoft Copilot, đã phản biện chính bản High-Fidelity này (`10_AI_NATIVE_UX_REVIEW.md`): kết luận mô hình 7-màn-hình tuần tự vẫn là "wizard/report được bọc ngôn ngữ AI", chưa thực sự AI-Native. Đã redesign (`11_AI_NATIVE_REDESIGN.md`): chuyển từ **Screen-based sang Thread-based** (giống Claude.ai/Perplexity — một dòng chảy liên tục, không "chuyển trang"), thêm 3 component tín hiệu AI-Native mạnh: Mini Knowledge Graph Trace (sơ đồ nút-liên-kết thu nhỏ khi suy luận), Legal Timeline Chip (dải thời gian cho mỗi trích dẫn, đặc biệt hiệu quả để trực quan hoá xung đột văn bản ở trạng thái "Thiếu thông tin"), Threshold Comparison Bar (thanh so sánh số liệu người dùng vs ngưỡng luật). Các quyết định Safety-driven trước đó (3 trạng thái cùng độ nổi bật, không dùng đỏ cho "Thiếu thông tin", Confidence Badge không bao giờ ẩn) được giữ nguyên, tái khẳng định rõ trong `11`. File `11` tự nêu RISK: thread-based + 3 component mới khó dựng hơn hẳn trong 48h — có khuyến nghị thứ tự ưu tiên nếu thiếu thời gian (Threshold Bar + Timeline Chip trước, Graph Trace có thể tạm dùng ảnh tĩnh).

## Design Review đã thực hiện (`16_DESIGN_REVIEW.md`)
Điểm hiện tại 15/60 (chủ yếu vì chưa có code/demo chạy thật), điểm tối đa khả thi 41/60 nếu build đúng hướng ngay từ bây giờ. Kết luận quan trọng nhất: **dừng viết thêm tài liệu, bắt đầu build** — giá trị biên của tài liệu đã giảm dần, rủi ro lớn nhất hiện tại là hết giờ 48h mà chưa có gì chạy được. 5 việc ưu tiên tiếp theo: (1) chấp nhận dữ liệu "đang xác minh" để build thử thay vì chờ hoàn hảo, (2) build 1 luồng end-to-end thô để kiểm chứng kiến trúc 4-agent có khả thi không, (3) wireframe tối thiểu cho cách hiển thị trích dẫn pháp lý, (4) thêm test case đối kháng (red-team), (5) rehearsal demo ít nhất 1 lần.

## Khi bắt đầu phiên làm việc mới
Đọc file này → đọc `00_MUC_LUC.md` (docs) và `../knowledge/README.md` nếu cần chi tiết build → hỏi người dùng nếu có OPEN QUESTION nào vừa được trả lời để cập nhật, tránh giả định.
