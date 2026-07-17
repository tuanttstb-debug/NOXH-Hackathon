# 04 — Sitemap

> Đọc trong 5 phút. [P0] = trong phạm vi demo 48h. [P1] = làm sau nếu còn thời gian/hậu Hackathon gần. [P2] = tầm nhìn dài hạn, chưa thiết kế chi tiết. Đối chiếu `docs/14_BACKLOG.md`.

```
NOXH Copilot
│
├── PUBLIC (không cần đăng nhập)
│   ├── [P0] Trang chủ / AI Workspace Entry (Focus Mode)
│   │        → câu hỏi trung tâm "Kiểm tra điều kiện mua NOXH"
│   ├── [P0] Eligibility Checker (luồng chính, xem 05/06)
│   ├── [P1] Giới thiệu nguyên tắc Citation First / Vì sao tin được AI này
│   └── [P2] Legal Search công khai (tra cứu tự do, không gắn hồ sơ cá nhân)
│
├── WORKSPACE — Doanh nghiệp (đăng nhập theo vai trò) [P1/P2]
│   ├── [P2] Workspace Home (theo biến thể: Chủ đầu tư / Ngân hàng / Phòng pháp chế)
│   ├── [P2] Tra cứu hồ sơ theo lô (nhiều trường hợp cùng lúc)
│   ├── [P2] Legal Diff — theo dõi thay đổi văn bản ảnh hưởng nghiệp vụ
│   └── [P2] Lịch sử tra cứu / Xuất báo cáo
│
├── WORKSPACE — Cơ quan quản lý (đăng nhập) [P2]
│   ├── [P2] Dashboard tổng quan (xu hướng tra cứu, ẩn danh)
│   ├── [P2] Legal Diff — cảnh báo chồng lấp/xung đột văn bản
│   ├── [P2] Xác thực dữ liệu (nâng do_tin_cay: đang xác minh → đã xác minh)
│   └── [P2] Knowledge Graph Explorer (xem trực quan thực thể/quan hệ)
│
├── TRUST & EVIDENCE LAYER (xuất hiện lồng trong mọi luồng, không phải trang độc lập)
│   ├── [P0] Chi tiết trích dẫn (văn bản, điều/khoản, ngày hiệu lực)
│   └── [P1] Lịch sử sửa đổi liên quan tới trích dẫn đang xem
│
└── ADMIN (nội bộ đội vận hành) [P2]
    ├── [P2] Quản lý Knowledge Graph (nạp/sửa văn bản, ontology)
    ├── [P2] Nhật ký Fact Check (tỷ lệ từ chối trả lời, lý do)
    └── [P2] Social Radar — nguồn tin theo dõi văn bản mới (`knowledge/agents/social_listening.md`, chính thức P2)
```

## Nguyên tắc đọc sitemap này
- Không có "Fact Check" như một trang độc lập trong PUBLIC/Workspace — đây là quyết định có chủ đích, xem lý do ở `05_SCREEN_LIST.md`.
- "Trust & Evidence Layer" không phải một điểm đến (destination) mà là lớp xuất hiện lồng trong Eligibility Checker và mọi tra cứu khác — đúng mô hình 3 lớp ở `02_INFORMATION_ARCHITECTURE.md`.
- Toàn bộ nhánh Workspace Doanh nghiệp/Cơ quan quản lý/Admin là **P1/P2** — không build trong 48h. Chỉ tồn tại ở đây để đội không thiết kế P0 theo cách tự chặn đường mở rộng sau này.
