# 11 — AI-Native Redesign

> Đọc trong 12 phút. Thiết kế lại theo phản biện ở `10_AI_NATIVE_UX_REVIEW.md`. Đây là bản redesign **thay thế cách điều hướng** của `06_LOW_FIDELITY_WIREFRAME.md`/`09_HIGH_FIDELITY_SCREENS.md` cho luồng Người dân (Focus Mode) — Design System (`07`) và các quyết định Safety-driven vẫn giữ nguyên, không đổi.

## Thay đổi cấu trúc lớn nhất: Screen-based → Thread-based
Bỏ mô hình "7 màn hình điều hướng tuần tự". Thay bằng **một dòng chảy liên tục** (giống Claude.ai/Perplexity/Copilot): người dùng và AI cùng "viết" lên một canvas duy nhất, nội dung tích luỹ từ trên xuống, không có khái niệm "chuyển trang" hay "màn hình kết thúc". Ô nhập luôn neo ở dưới cùng, luôn sẵn sàng nhận câu tiếp theo — hội thoại không bao giờ thực sự "hết", chỉ tạm dừng.

Hệ quả trực tiếp lên tài liệu trước đó:
- `06` Màn hình 2 + 3 (thu thập thông tin + đang xử lý) **gộp thành 1 khối liên tục** trong thread — không còn "Bước 1/4".
- `06` Màn hình 4/5/6 (3 trạng thái kết quả) **không còn là màn hình riêng** — trở thành 1 khối kết quả xuất hiện ngay trong thread, theo sau bởi ô hỏi tiếp (không phải nút "Hỏi câu khác" để reset).
- `06` Màn hình 7 (Evidence Panel) vẫn có thể tồn tại dạng overlay khi cần xem sâu, nhưng phần thông tin cốt lõi (mini timeline, mini graph) nay hiện **ngay trong khối kết quả**, không bắt buộc phải mở panel mới thấy.
- `05_SCREEN_LIST.md` mục #1–7: vẫn đúng về mặt "nội dung nào cần có", nhưng không còn là 7 điểm-đến điều hướng riêng — là 7 **loại khối nội dung** xuất hiện trong cùng một thread. Cần đọc lại `05` với hiểu biết này.

## 3 component thị giác mới (thay thế phần lớn nội dung dạng chữ)

### A. Mini Knowledge Graph Trace
Sơ đồ nút-liên-kết thu nhỏ (3–6 nút), không phải Knowledge Graph Explorer đầy đủ (vẫn P2/Admin, không đổi). Nút trung tâm "Hồ sơ của bạn" → đường nối sáng dần tới nút nhóm điều kiện (nhà ở/thu nhập/cư trú) → tới nút Điều/Khoản cụ thể được chọn. Dùng trong lúc xử lý (thay Reasoning Trace dạng chữ) và giữ lại dạng tĩnh, thu nhỏ hơn nữa trong khối kết quả làm "bằng chứng suy luận" trực quan.
Màu: đường nối dùng `accent-primary`, nút đã xác nhận dùng `status-eligible`, nút đang chờ dùng `text-secondary` nhạt.

### B. Legal Timeline Chip
Dải thời gian ngang thu nhỏ, gắn vào mỗi trích dẫn: các chấm đánh dấu mỗi lần văn bản bị sửa đổi, một vạch "Hôm nay" cố định. Khi dùng cho trạng thái "Thiếu thông tin" (Màn hình 6 cũ), 2 chấm mâu thuẫn được tô màu `status-uncertain` và vùng giữa 2 chấm (nơi vạch "Hôm nay" rơi vào) được tô nền mờ `status-uncertain` — trực quan hoá đúng khái niệm "chưa rõ văn bản nào áp dụng" mà không cần đọc hết đoạn văn.
Đây là component trả lời trực tiếp câu hỏi Timeline/Visual Reasoning ở `10`.

### C. Threshold Comparison Bar
Thanh ngang so sánh 1 con số của người dùng với 1 ngưỡng luật định (VD: thu nhập vs trần thu nhập). Vạch người dùng dùng `accent-primary`, vùng "trong ngưỡng" tô nhạt `status-eligible`, vùng "vượt ngưỡng" tô nhạt `status-not-eligible`. Thay thế phần lớn nhu cầu đọc prose để hiểu "vì sao" ở kết quả Đủ/Không đủ điều kiện.

## Wireframe mới — toàn bộ luồng trong 1 thread (mô tả liên tục, không tách trang)

```
┌───────────────────────────────────────────────────┐
│  [Cập nhật gần nhất: NĐ 136/2026 · 07/04/2026]     │ ← tín hiệu "hiểu thời gian",
│                                                       góc trên, không nổi bật
│  ┌─ Ô nhập (đã focus sẵn) ─────────────────────┐   │
│  │ Hỏi bất kỳ điều gì về Nhà ở xã hội...        │   │ ← Màn hình 1 cũ, gộp vào
│  │ [chip gợi ý: "Tôi mới cưới, lương 2 vợ..."]  │   │   đầu thread luôn
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘

──────────── người dùng gõ, thread bắt đầu tích luỹ ────────────

  👤 "Tôi độc thân, chưa có nhà, lương 18 triệu,
      ở Bình Dương"

  🤖 Đã hiểu:  [Độc thân ✓] [Chưa có nhà ✓]           ← chip xuất hiện dần khi AI
              [18 triệu/tháng ✓] [Bình Dương ✓]         phân tích — thay Question
                                                          Bubble tuần tự cũ (06 #2)
      ┌─ Mini Knowledge Graph Trace ─────────┐
      │   [Hồ sơ] ──→ [Điều kiện thu nhập]    │        ← thay Reasoning Trace
      │           ──→ [Điều kiện nhà ở]        │           dạng chữ (06 #3)
      │   ...đang khớp Điều 30, NĐ 136/2026    │
      └──────────────────────────────────────────┘

  🤖 ┌─ ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội ✓ ──────────┐  ← Result Status Header
     │                                              │     GIỮ NGUYÊN như 08 #3
     │  ┌─ Threshold Comparison Bar ────────┐      │
     │  │ Thu nhập của bạn        18tr      │      │  ← thay 1 phần prose
     │  │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  Ngưỡng 25tr │      │     bằng hình
     │  └──────────────────────────────────────┘      │
     │                                              │
     │  Căn cứ chính:                               │
     │  📄 Điều 30, NĐ 136/2026                     │
     │  [Legal Timeline Chip: •──•──•──●(hôm nay)] │  ← thay ngày hiệu lực
     │  [Đã xác minh]      [Xem thêm 1 căn cứ ›]   │     dạng chữ đơn thuần
     │                                              │
     │  💡 Gợi ý: "Bạn có muốn biết bước tiếp theo  │  ← AI Suggestion, thay
     │      cần chuẩn bị hồ sơ gì không?"            │     nút "Hỏi câu khác"
     └──────────────────────────────────────────────┘

  ┌─ Ô nhập (vẫn neo dưới cùng, sẵn sàng câu tiếp) ─┐
  │ Hỏi tiếp...                                       │  ← KHÔNG reset, tiếp tục
  └───────────────────────────────────────────────────┘     cùng 1 thread
```

### Khối "Thiếu thông tin" trong cùng mô hình thread (thay Màn hình 6 cũ)
```
  🤖 ┌─ ? CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN ────┐  ← CÙNG kích thước/vị trí
     │                                                 như khối "Đủ điều kiện",
     │ ┃ Vì sao: 2 văn bản quy định mức trần khác     bắt buộc — không đổi so
     │ ┃ nhau cho nhóm của bạn, chưa rõ bản nào       với quy tắc đã chốt ở 08
     │ ┃ đang áp dụng. Chúng tôi không đoán.          │
     │                                                 │
     │  ┌─ Legal Timeline Chip (phóng to hơn) ───┐    │
     │  │  NĐ 261/2025          NĐ 136/2026        │    │  ← 2 chấm status-uncertain,
     │  │     •═══════════════════•                │    │     vùng giữa tô mờ
     │  │              ▲ Hôm nay (17/07/2026)       │    │     status-uncertain —
     │  │         (đang trong vùng chưa rõ)         │    │     giải thích BẰNG HÌNH
     │  └──────────────────────────────────────────┘    │
     │                                                 │
     │  💡 Gợi ý: "Đăng ký nhận thông báo khi có xác   │  ← AI Suggestion biến
     │      nhận chính thức?"                           │     điểm dừng thành
     │                                                 │     hành động
     └────────────────────────────────────────────────┘
```

## Điều KHÔNG đổi (Safety-driven, vẫn bắt buộc)
- 3 trạng thái kết quả vẫn dùng chung Result Status Header, cùng kích thước/độ nổi bật — quy tắc từ `08_COMPONENT_SPEC.md` #3 không đổi dù chuyển sang thread.
- "Thiếu thông tin" không bao giờ dùng màu đỏ/họ màu lỗi — Legal Timeline Chip cho khối này dùng `status-uncertain`, không dùng `status-not-eligible`.
- Confidence Badge ("Đang xác minh") không bao giờ bị ẩn để trông "gọn" hơn trong thread.
- AI Reasoning/Graph Trace vẫn phải luôn thể hiện đủ 4 bước Parse → Retrieve → Reasoning → Fact-Check dù rút gọn thành hình ảnh — không được bỏ bước Fact-Check khỏi hình vẽ.

## Phép thử 30 giây (test trước khi coi redesign đạt yêu cầu)
Che phần chữ, chỉ nhìn bố cục và hình: có nhìn thấy (1) một sơ đồ nút-liên-kết nhỏ, (2) một dải thời gian có chấm mốc, (3) một thanh so sánh số liệu, (4) một ô chat luôn mở ở dưới cùng — nếu cả 4 điều này nhìn thấy trong 30 giây mà không cần đọc chữ, bài kiểm tra "đây có phải AI-Native không" coi như đạt. Nếu giám khảo chỉ thấy card + text như bản `09`, chưa đạt.

## Việc cần làm tiếp (ngoài phạm vi tài liệu này)
- `05_SCREEN_LIST.md` cần một ghi chú ngắn (đã thêm) trỏ sang tài liệu này để tránh hiểu nhầm mô hình 7-trang vẫn là kiến trúc cuối cùng.
- 3 component mới (Mini Knowledge Graph Trace, Legal Timeline Chip, Threshold Comparison Bar) cần được đội kỹ thuật đánh giá độ khả thi trong 48h — đây là mức độ phức tạp dựng hình cao hơn hẳn card/text thông thường, có RISK tiến độ đi kèm (xem ghi chú bên dưới).

## RISK (bắt buộc nêu, đúng nguyên tắc dự án — không giấu rủi ro của chính đề xuất mình)
Thread-based UI + 3 visual component mới **khó dựng hơn đáng kể** so với bản card/screen tĩnh ở `09` trong quỹ thời gian 1–2 người/48h (`docs/12_QUAN_LY_RUI_RO.md` đã cảnh báo rủi ro nguồn lực là lớn nhất). Khuyến nghị: nếu thời gian dựng UI thật sự eo hẹp, ưu tiên dựng đúng **Threshold Comparison Bar** và **Legal Timeline Chip** trước (giá trị trực quan/công sức cao nhất, độ phức tạp dựng vừa phải) — Mini Knowledge Graph Trace có thể lược bớt về một phiên bản tĩnh (ảnh minh hoạ cố định) nếu không kịp làm animation, vẫn giữ được tín hiệu "đây là Knowledge Graph" mà không cần dựng engine đồ thị thật.
