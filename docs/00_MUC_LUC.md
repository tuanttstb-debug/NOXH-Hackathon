# 00 — Mục lục: NOXH Copilot

Bộ tài liệu dự án, khởi tạo 17/07/2026. Mỗi file là Single Source of Truth cho chủ đề của nó — cập nhật tại chỗ, không tạo file trùng. Toàn bộ viết bằng tiếng Việt, mỗi file đọc dưới 10 phút.

## Nền tảng dự án
| File | Nội dung |
|---|---|
| `01_TONG_QUAN_DU_AN.md` | Vấn đề, giải pháp, giá trị cốt lõi |
| `02_MUC_TIEU_SAN_PHAM.md` | Mục tiêu kinh doanh/sản phẩm, chỉ số thành công cho demo |
| `03_YEU_CAU_NGHIEP_VU.md` | Quy tắc nghiệp vụ xác định điều kiện thụ hưởng NOXH |
| `04_DOI_TUONG_NGUOI_DUNG.md` | Persona người dân, hành trình trước/sau sản phẩm |

## Kiến trúc
| File | Nội dung |
|---|---|
| `05_KIEN_TRUC_GIAI_PHAP.md` | Kiến trúc khái niệm, nguyên tắc thiết kế, các khối chức năng |
| `06_KIEN_TRUC_AI_AGENT.md` | Pipeline suy luận của AI Agent, quy tắc quyết định |
| `07_KNOWLEDGE_GRAPH.md` | Danh mục văn bản pháp luật (có nguồn) + thiết kế đồ thị tri thức |
| `08_MO_HINH_DU_LIEU.md` | Các trường dữ liệu: pháp lý, hồ sơ người dùng, kết quả |
| `09_KIEN_TRUC_DU_LIEU.md` | Luồng dữ liệu, vòng đời, truy vết nguồn gốc |

## Vận hành & quyết định
| File | Nội dung |
|---|---|
| `10_LO_TRINH_TRIEN_KHAI.md` | Mốc 48h + hướng mở rộng sau Hackathon |
| `11_KICH_BAN_DEMO.md` | Kịch bản trình bày trước giám khảo |
| `12_QUAN_LY_RUI_RO.md` | Bảng rủi ro, mức độ, ứng phó |
| `13_QUYET_DINH_KIEN_TRUC.md` | ADR — các quyết định kiến trúc kèm đánh đổi |
| `14_BACKLOG.md` | Phạm vi P0/P1/P2, Definition of Done |
| `15_GLOSSARY.md` | Bảng thuật ngữ |
| `16_DESIGN_REVIEW.md` | Design Review toàn dự án: điểm số 6 tiêu chí + challenge session (Microsoft/Google/Anthropic/McKinsey) — đọc trước khi code |

## Tri thức chuyên sâu (build)
Nằm ở `../knowledge/` (không lặp lại ở đây) — xem `../knowledge/README.md` để biết ontology, đặc tả agent, prompt nháp, hồ sơ từng văn bản luật, test case.

## UI/UX (thiết kế, chưa code)
Nằm ở `UI/` — đọc tuần tự 01→11: UI Review, Information Architecture, User Journey, Sitemap, Screen List, Low-Fidelity Wireframe, Design System, Component Spec, High-Fidelity Screens, **AI-Native UX Review, AI-Native Redesign**. File `11` là bản thiết kế điều hướng mới nhất (thread-based, thay 7-màn-hình tuần tự của `06`/`09`) — dùng `11` làm nguồn chính khi dựng UI thật cho luồng Người dân. Vẫn chưa có code/CSS thật.

## Cần bạn xác nhận sớm nhất (chặn tiến độ)
1. **[07]** Toàn văn hợp nhất mới nhất của NĐ 100/2024/NĐ-CP (đã gộp 3 lần sửa đổi) — chưa có thì Knowledge Graph có thể trích dẫn sai điều khoản đã hết hiệu lực.
2. **[07]** Phạm vi văn bản: chỉ cấp Trung ương, hay cần thêm văn bản địa phương?
3. **[10]** Mốc thời gian 48h chính xác + có rubric chấm điểm không.
4. **[04]** Persona "anh Minh — công nhân khu công nghiệp" có đúng nhóm ưu tiên không?
5. **[06]** Agent có cần hỏi lại người dùng khi thiếu thông tin (multi-turn) hay chỉ báo và dừng?
6. **[11]** Thời lượng demo cho phép trước giám khảo là bao lâu?

## Chưa làm
Chưa sinh code, chưa thiết kế giao diện chi tiết, chưa sinh API — tài liệu kiến trúc (05–09) mô tả ở mức khái niệm, làm căn cứ cho bước code sau khi các câu hỏi trên được trả lời.
