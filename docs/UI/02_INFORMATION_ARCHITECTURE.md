# 02 — Information Architecture

> Đọc trong 10 phút. Bước 1: đối chiếu PRD hiện có với tài liệu tham khảo. Bước 2: đề xuất IA mới, không bị giới hạn bởi tham khảo.

## Phần A — Đối chiếu với Product Requirement

Nguồn đối chiếu: `docs/03_YEU_CAU_NGHIEP_VU.md`, `docs/14_BACKLOG.md`, `knowledge/agents/*.md`.

### Requirement đã được UI tham khảo cover (về mặt pattern, không phải nội dung)
| Requirement | Pattern có thể tái dùng |
|---|---|
| Dashboard tổng quan cho vai trò quản lý | KPI grid + tab + data table |
| Xác thực người dùng theo vai trò | Login pattern, avatar/role chip |
| Thông báo hệ thống | Toast pattern |
| Responsive cơ bản | Breakpoint table, touch target chuẩn |

### Requirement CHƯA được cover — đây là phần lõi sản phẩm
| Requirement | Vì sao chưa cover |
|---|---|
| Eligibility Checker (`docs/14_BACKLOG.md` P0) — hội thoại/form thích ứng, 3 trạng thái kết quả | Tham khảo chỉ có wizard tĩnh, không có khái niệm trạng thái "Thiếu thông tin" như một kết quả hợp lệ (không phải lỗi) |
| Citation First — mọi kết luận kèm trích dẫn Điều/Khoản/văn bản/ngày hiệu lực (`docs/03`) | Không có component hiển thị nguồn/trích dẫn |
| Fact Check — badge độ tin cậy `đã xác minh`/`đang xác minh` (`ontology/metadata.md`) | Không có khái niệm độ tin cậy dữ liệu trong toàn bộ tham khảo |
| Legal Diff — hiển thị chồng lấp/thay đổi giữa các văn bản (`knowledge/agents/legal_diff.md`) | Không có pattern "so sánh phiên bản theo thời gian" |
| Trạng thái "AI đang suy luận" (Grounding → Retrieve → Reason → Fact-check, `docs/06_KIEN_TRUC_AI_AGENT.md`) | Tham khảo không có bất kỳ trạng thái AI-processing nào, chỉ có loading spinner chung chung của form |
| Đa vai trò (Người dân/Chủ đầu tư/Ngân hàng/Phòng pháp chế/Cơ quan quản lý) với nhu cầu khác nhau | Tham khảo chỉ có 1 kiểu dashboard admin dùng chung |
| Social Radar (giám sát văn bản mới — `knowledge/agents/social_listening.md`, P2) | Không có pattern feed/theo dõi thay đổi theo thời gian thực |

**Kết luận đối chiếu**: tham khảo cover được lớp "vỏ vận hành" (auth, thông báo, dashboard số liệu) nhưng không cover bất kỳ phần nào tạo nên giá trị cốt lõi của NOXH Copilot (Citation First, Fact Check, Explainable AI). Phần cốt lõi phải thiết kế mới hoàn toàn — đúng như Bước B dưới đây.

## Phần B — Đề xuất Information Architecture mới

### Nguyên tắc tổ chức: AI ↓ Task ↓ Information ↓ Visual
Không tổ chức quanh "module chức năng" (Eligibility / Legal Search / Dashboard... như các mục sidebar ngang hàng). Tổ chức quanh **năng lực AI** trả lời được câu hỏi gì, rồi mới tới **tác vụ** cụ thể người dùng cần, rồi mới tới **thông tin** cần hiển thị, cuối cùng mới là **giao diện**.

### Mô hình 3 lớp (áp dụng cho mọi vai trò người dùng)
```
Lớp 1 — ENTRY / WORKSPACE
  Một điểm bắt đầu duy nhất, tối giản, theo ngữ cảnh vai trò.
  Người dân thấy: "Kiểm tra tôi có đủ điều kiện mua NOXH không?"
  Doanh nghiệp/Ngân hàng thấy: "Tra cứu quy định áp dụng cho hồ sơ/dự án"
  Cơ quan quản lý thấy: "Theo dõi thay đổi chính sách, đối chiếu hồ sơ"

Lớp 2 — TASK EXECUTION
  Nơi AI Agent thực sự chạy (docs/06_KIEN_TRUC_AI_AGENT.md).
  Thu thập thông tin dần theo ngữ cảnh (không phải wizard tĩnh nhiều bước cố định).
  Hiển thị trạng thái xử lý ("Đang đối chiếu Khoản 1 Điều 30...") thay vì spinner vô nghĩa.
  Trả kết quả có cấu trúc: Kết luận → Giải thích → Trích dẫn.

Lớp 3 — TRUST & EVIDENCE LAYER
  Luôn truy cập được nhưng không chiếm diện tích mặc định (progressive disclosure).
  Mở ra khi người dùng bấm vào trích dẫn: xem văn bản gốc, ngày hiệu lực,
  trạng thái xác minh, lịch sử sửa đổi liên quan (Legal Diff).
  Đây là lớp KHÁC BIỆT HOÁ lớn nhất — không sản phẩm tham khảo nào có.
```

### Mô hình điều hướng: 2 chế độ, không dùng 1 sidebar chung cho tất cả
| Chế độ | Dành cho | Điều hướng |
|---|---|---|
| **Focus Mode** | Người dân | Không sidebar. Một màn hình, một tác vụ, một câu trả lời. Lịch sử truy vấn cũ (nếu có) thu gọn sau 1 icon nhỏ, không chiếm không gian mặc định. |
| **Workspace Mode** | Doanh nghiệp/Ngân hàng/Phòng pháp chế/Cơ quan quản lý | Rail điều hướng gọn (icon-only, mở rộng khi hover/chọn) — kế thừa kỷ luật state/token từ tham khảo (`01_UI_REVIEW.md`), nhưng mật độ thấp hơn, tông trung tính hơn. |

**Vì sao tách 2 chế độ thay vì 1 hệ thống chung**: nhu cầu của người dân (1 câu hỏi, 1 câu trả lời, xong) và nhu cầu của tổ chức (nhiều hồ sơ, cần Dashboard, cần Legal Diff, cần theo dõi liên tục) khác nhau về bản chất, không phải khác nhau về quy mô. Dùng chung một khung Workspace nặng cho cả người dân sẽ tái lặp đúng lỗi của tham khảo (bắt người dùng "vào đúng module" trước khi được giúp).

### Bảng màu — đề xuất, chưa chốt (DECISION cần xác nhận)
Đề xuất tông **trung tính** (nền trắng/xám rất nhạt, chữ đen/xám đậm) thay vì purple-first, với **một màu nhấn duy nhất** dùng tiết kiệm — chỉ xuất hiện ở hành động chính và trạng thái AI đang hoạt động (không phủ toàn bộ sidebar như tham khảo). Lý do: sản phẩm phục vụ từ người dân tới cơ quan quản lý — màu thương hiệu quá mạnh (như tím đậm) dễ gợi liên tưởng "app ngân hàng/doanh nghiệp cụ thể", đi ngược mục tiêu "Government Grade, Trustworthy" trung lập. Màu nhấn cụ thể (xanh dương trầm/xanh ngọc đậm/khác) để đội tự chốt — không tự quyết thay.

### Phạm vi áp dụng ngay (quan trọng — tránh lặp lỗi đã nêu ở `docs/16_DESIGN_REVIEW.md`)
IA trên là **tầm nhìn nền tảng đầy đủ** (hậu Hackathon). Phạm vi demo 48h theo `docs/14_BACKLOG.md` P0 chỉ có đúng 1 nhánh: **Người dân → Focus Mode → Eligibility Checker**. Toàn bộ Workspace Mode (Doanh nghiệp/Ngân hàng/Phòng pháp chế/Cơ quan quản lý) thuộc phạm vi thiết kế ý tưởng, KHÔNG build trong demo — xem đánh dấu P0/P1/P2 chi tiết ở `04_SITEMAP.md` và `05_SCREEN_LIST.md`.
