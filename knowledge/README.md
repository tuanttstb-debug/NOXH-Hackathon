# Knowledge — Mục lục tri thức chuyên sâu

Bổ sung cho `../docs/` (tầng Product/Kiến trúc khái niệm). Thư mục này chứa tri thức chuyên sâu để build: hồ sơ từng văn bản luật, ontology chi tiết, đặc tả agent, prompt nháp, tiêu chí kiểm thử.

| Thư mục | Nội dung |
|---|---|
| `phap_ly/` | Hồ sơ từng văn bản (Luật, Nghị định, Thông tư) — nguồn cho Knowledge Graph |
| `ontology/` | Định nghĩa chi tiết node/relationship/metadata |
| `agents/` | Đặc tả 5 agent: legal_reasoner, eligibility, fact_check, legal_diff, social_listening |
| `prompts/` | Prompt nháp tương ứng từng agent (trừ social_listening — P2, chưa build) |
| `evaluation/` | Test case và tiêu chí đánh giá |
| `datasets/` | Chưa có dữ liệu thật — xem `datasets/README.md` |

## Ưu tiên build (đối chiếu `docs/14_BACKLOG.md`)
**P0**: `agents/legal_reasoner.md`, `agents/eligibility.md`, `agents/fact_check.md`, `agents/legal_diff.md` + toàn bộ `ontology/` + `phap_ly/` (dữ liệu "đang xác minh").
**P2 (sau Hackathon)**: `agents/social_listening.md`.

## Rủi ro xuyên suốt toàn bộ knowledge/
Toàn bộ nội dung `phap_ly/` hiện ở trạng thái `do_tin_cay = đang xác minh` (`ontology/metadata.md`) vì lấy từ nguồn thứ cấp, chưa đối chiếu văn bản gốc/Công báo. Đây là OPEN QUESTION xuyên suốt — xem `docs/00_MUC_LUC.md` mục 1.
