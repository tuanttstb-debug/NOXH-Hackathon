# 10 — AI-Native UX Review

> Đọc trong 12 phút. Vai: Design Director, Microsoft Copilot. Mục tiêu review này KHÔNG phải thẩm mỹ — `07`, `08`, `09` đã đủ đẹp và kỷ luật. Mục tiêu là: nếu giám khảo nhìn UI trong 30 giây, họ có nhận ra ngay đây là AI-Native hay không. Kết luận ngắn: **chưa** — thiết kế hiện tại (`06`, `09`) là một wizard/form/report được "bọc" bằng ngôn ngữ AI (Question Bubble, Reasoning Trace...), nhưng cấu trúc điều hướng gốc vẫn là **screen-by-screen, tuyến tính, có điểm kết thúc** — đúng cấu trúc của một ứng dụng truyền thống, chỉ đổi vỏ ngoài.

## Vấn đề gốc, áp dụng cho toàn bộ luồng
Toàn bộ 7 màn hình P0 vẫn là **7 trang riêng biệt điều hướng tuần tự** (Entry → Hỏi → Chờ → Kết quả → hết). Đây chính là cấu trúc "trang / bước / kết thúc" của phần mềm truyền thống — chỉ khác tham khảo TPBank ở chỗ dùng bong bóng hội thoại thay vì ô input, và progress "Bước 1/4" (`06`, Màn hình 2) **về bản chất là wizard stepper** mà chính `01_UI_REVIEW.md` đã phê phán ở tài liệu tham khảo. Đây là điểm phải sửa đầu tiên, ảnh hưởng tới mọi màn hình bên dưới.

---

## Màn hình 1 — AI Workspace Entry
- **Giống dashboard truyền thống**: một "card" tĩnh với nút "Bắt đầu" — về cấu trúc tương tác giống hệt màn hình landing của một app thông thường (hero + CTA), chỉ đổi câu chữ.
- **Chưa tận dụng AI**: không có gì "sống" — không ví dụ gợi ý, không dấu hiệu hệ thống đang cập nhật theo thời gian thực.
- **Thay bằng AI Interaction nào**: bỏ hẳn khái niệm "card + nút Bắt đầu". Thay bằng một ô nhập đang **sẵn sàng nhận chữ ngay từ pixel đầu tiên** (con trỏ đã nháy sẵn) — gõ chữ đầu tiên chính là "bắt đầu", không cần xác nhận thêm.
- **Giảm click**: từ 1 click ("Bắt đầu") xuống 0 — hành động gõ thay thế hành động bấm.
- **Conversational UI**: có — đây phải là ô chat thật ngay từ đầu, không phải "card mô tả tính năng".
- **Progressive Disclosure**: gợi ý ví dụ câu hỏi chỉ hiện sau 2–3 giây nếu người dùng chưa gõ gì, tránh rối màn hình đầu.
- **AI Suggestion**: 2–3 "prompt chip" ví dụ thật, có thể bấm để điền nhanh (VD: "Tôi mới cưới, lương 2 vợ chồng 35 triệu, có đủ điều kiện không?").
- **Graph Exploration**: chưa cần ở bước này.
- **Timeline**: có — một dòng nhỏ, không nổi bật: "Cập nhật gần nhất: Nghị định 136/2026 · 07/04/2026" — tín hiệu "hệ thống hiểu thời gian" ngay từ giây đầu, đúng giá trị cốt lõi khác biệt của sản phẩm.
- **Visual Reasoning**: chưa cần.

## Màn hình 2 — Thu thập thông tin (Question Bubble tuần tự)
- **Giống dashboard truyền thống**: đây là màn hình có vấn đề nặng nhất. "Bước 1/4" + chuỗi bong bóng hỏi tuần tự cố định = **wizard stepper cải trang**, đúng pattern đã bị phê phán ở tài liệu tham khảo (`01_UI_REVIEW.md`).
- **Chưa tận dụng AI**: không có trích xuất ngôn ngữ tự nhiên — bắt người dùng trả lời đúng thứ tự AI muốn hỏi, thay vì AI hiểu thứ người dùng tự nhiên nói ra.
- **Thay bằng AI Interaction nào**: một ô nhập tự do duy nhất — người dùng mô tả hoàn cảnh bằng câu tự nhiên ("Tôi độc thân, chưa có nhà, lương 18 triệu, ở Bình Dương"), AI trích xuất trực tiếp thành các trường dữ liệu, hiển thị dần từng "chip" được điền như đang gõ trước mắt người dùng. Chỉ hỏi lại (dạng bong bóng ngắn) cho đúng phần còn thiếu/mơ hồ — không hỏi lại toàn bộ 4 câu nếu người dùng đã trả lời gộp.
- **Giảm click**: từ tối thiểu 4 lượt chọn tuần tự xuống 1 lần gõ (+ tối đa 1 câu hỏi bổ sung nếu thiếu).
- **Conversational UI**: có — đây là trung tâm của redesign.
- **Progressive Disclosure**: các "chip" dữ liệu đã hiểu xuất hiện dần khi AI phân tích câu, không hiện tất cả cùng lúc.
- **AI Suggestion**: nếu câu mơ hồ ("tôi mới lập gia đình"), gợi ý chip xác nhận nhanh ("Ý bạn là: Đã kết hôn?") thay vì bắt chọn lại từ đầu.
- **Graph Exploration**: có thể hé lộ sớm — ngay khi 1 trường được hiểu, hiện 1 dòng nhỏ "Đang khớp với 3 nhóm điều kiện: nhà ở, thu nhập, cư trú" — bắt đầu làm mờ ranh giới giữa "nhập liệu" và "suy luận" (gộp với Màn hình 3).
- **Timeline**: chưa cần ở bước này.
- **Visual Reasoning**: chưa cần ở bước này.

## Màn hình 3 — Đang xử lý (AI Reasoning Trace dạng danh sách chữ)
- **Giống dashboard truyền thống**: danh sách checklist ✓/●/... về cấu trúc giống hệt "progress list" của một luồng upload/import file trong phần mềm doanh nghiệp — chỉ đổi nội dung chữ, không đổi hình thức.
- **Chưa tận dụng AI**: không hiển thị **nơi** AI đang tìm kiếm — chỉ mô tả bằng câu chữ, không có gì để nhìn.
- **Thay bằng AI Interaction nào**: **Graph Exploration** — một sơ đồ nút-liên-kết thu nhỏ, hiển thị "Hồ sơ của bạn" ở giữa, các đường nối sáng dần tới từng nhóm điều kiện, rồi tới đúng Điều/Khoản được chọn. Đây là hình ảnh mạnh nhất để nói "đây là Knowledge Graph thật, không phải chatbot" chỉ bằng một cái nhìn.
- **Giảm click**: không cần thao tác gì (đang chờ), nhưng có thể cho phép chạm vào từng nút đồ thị để xem trước khi AI xử lý xong — tương tác nhẹ trong lúc chờ.
- **Conversational UI**: giữ giọng tường thuật ở ngôi thứ nhất ("Đang tra Điều 30...") — đã đúng tinh thần, giữ nguyên.
- **Progressive Disclosure**: đã ổn (hiện dần từng bước) — giữ nguyên.
- **AI Suggestion**: không áp dụng lúc này.
- **Graph Exploration**: đề xuất chính, xem trên.
- **Timeline**: kết hợp — thêm một thanh thời gian thu nhỏ, chạy đến đúng mốc hôm nay để chọn văn bản còn hiệu lực ("Đang xác định phiên bản áp dụng tại 17/07/2026...").
- **Visual Reasoning**: gộp Graph + Timeline thành một khối "Visual Reasoning" duy nhất, thay hoàn toàn danh sách chữ.

## Màn hình 4 & 5 — Kết quả (Đủ / Không đủ điều kiện)
- **Giống dashboard truyền thống**: ngăn xếp Citation Card tĩnh đọc giống một "trang báo cáo" xuất ra (report page) — chỉ để đọc, không tương tác thêm.
- **Chưa tận dụng AI**: không thể hỏi tiếp ngay tại chỗ ("Nếu thu nhập tôi thấp hơn thì sao?") — nút duy nhất là "Hỏi câu khác", vốn **reset lại từ đầu** thay vì tiếp tục hội thoại, đây là dấu hiệu rõ nhất của tư duy "màn hình kết thúc" kiểu truyền thống.
- **Thay bằng AI Interaction nào**: giữ nguyên Result Status Header (không đổi — đây là quyết định Safety, xem `08_COMPONENT_SPEC.md` #3), nhưng bỏ khái niệm "màn hình kết thúc". Thêm ô nhập tiếp tục hội thoại ngay dưới kết quả — người dùng hỏi tiếp trong cùng một dòng chảy, không "Hỏi câu khác" để quay về đầu.
- **Giảm click**: thay vì bấm "Xem chi tiết" để hiểu con số, hiển thị ngay 1 **Threshold Comparison Bar** (thanh so sánh trực quan: "Thu nhập của bạn" vs "Ngưỡng cho phép", có vạch đánh dấu) ngay trong kết quả — hiểu "vì sao" mà không cần bấm gì.
- **Conversational UI**: có — ô hỏi tiếp là trọng tâm thay đổi.
- **Progressive Disclosure**: mặc định chỉ hiện 1 căn cứ chính + "Xem thêm 1 căn cứ khác ›", không xổ hết toàn bộ Citation Card ngay từ đầu.
- **AI Suggestion**: gợi ý câu hỏi tiếp theo có ngữ cảnh (VD sau "Đủ điều kiện": "Bạn có muốn biết bước tiếp theo cần chuẩn bị gì không?").
- **Graph Exploration**: hiện một sơ đồ thu nhỏ tĩnh (ảnh chụp lại từ Màn hình 3) "hồ sơ ↔ điều khoản áp dụng" — neo lại bằng chứng suy luận, không chỉ liệt kê văn bản.
- **Timeline**: mỗi Citation Card có thêm một dải chấm thời gian thu nhỏ, đặt văn bản này vào đúng vị trí trong chuỗi sửa đổi — nhìn một giây là hiểu "luật này đã đổi qua nhiều lần".
- **Visual Reasoning**: Threshold Comparison Bar là trọng tâm — thay một phần lời giải thích bằng hình.

## Màn hình 6 — Kết quả: Thiếu thông tin
- **Giống dashboard truyền thống**: cùng khuôn report-card như Màn hình 4/5 (đúng chủ đích Safety, không đổi phần này) nhưng phần minh chứng "vì sao mâu thuẫn" vẫn chỉ là chữ + 2 card rời rạc — chưa cho thấy TRỰC QUAN hai văn bản đang chồng lấp ra sao.
- **Chưa tận dụng AI**: đây là màn hình có tiềm năng "AI-native" lớn nhất trong toàn bộ sản phẩm (vì nó chứng minh hệ thống hiểu giới hạn của chính nó) nhưng hiện tại trình bày y hệt một thông báo lỗi dài dòng.
- **Thay bằng AI Interaction nào**: **Timeline là lựa chọn đúng nhất ở đây** — vẽ một thanh thời gian ngang, đặt 2 văn bản mâu thuẫn đúng vị trí ngày ban hành, có vạch "Hôm nay" rơi vào đúng vùng chưa rõ ràng giữa 2 mốc — người xem hiểu "vì sao chưa chắc" trong 1 giây nhìn, không cần đọc hết đoạn văn giải thích.
- **Giảm click**: không cần bấm "Xem chi tiết" từng card để hiểu xung đột — timeline trực quan thay thế.
- **Conversational UI**: cho phép hỏi tiếp "Khi nào biết chắc?" — AI trả lời trung thực là chưa xác định được, không bịa thời điểm.
- **Progressive Disclosure**: giữ nguyên yêu cầu bắt buộc — phần giải thích "vì sao chưa chắc" luôn hiển thị mặc định, không được thu gọn (đã ghi ở `08`).
- **AI Suggestion**: đề xuất "Đăng ký nhận thông báo khi có xác nhận chính thức" — biến điểm dừng thành hành động có giá trị (liên kết khái niệm với `agents/social_listening.md`, dù bản thân tính năng đó vẫn là P2).
- **Graph Exploration**: hiện 2 nút văn bản cùng nối vào 1 nút Điều 30 gốc, trực quan hoá đúng khái niệm "chồng lấp" mà `agents/legal_diff.md` mô tả bằng chữ.
- **Timeline**: đề xuất chính, xem trên.
- **Visual Reasoning**: kết hợp Timeline + Graph — đây nên là màn hình có visual mạnh nhất trong cả sản phẩm, vì nó là bằng chứng khác biệt hoá rõ nhất.

## Màn hình 7 — Evidence Panel
- **Giống dashboard truyền thống**: một drawer/panel thông tin tĩnh — đúng pattern "chi tiết sản phẩm/hồ sơ" phổ biến ở mọi loại app, không riêng gì AI.
- **Chưa tận dụng AI**: chỉ đọc được, không hỏi thêm được ngay tại chỗ về chính điều khoản đang xem.
- **Thay bằng AI Interaction nào**: thêm 1 ô nhỏ "Hỏi AI về điều khoản này" (VD: "giải thích đơn giản hơn giúp tôi") — trả lời dựa trên đúng dữ liệu điều khoản đã có sẵn, không cần truy vấn lại toàn bộ Knowledge Graph (rẻ, an toàn).
- **Giảm click**: nút "Xem lịch sử sửa đổi liên quan" (hiện dẫn sang đâu đó chưa thiết kế) → thay bằng hiện **ngay trong panel** một mini-timeline lịch sử sửa đổi của chính điều khoản này — không điều hướng đi đâu cả.
- **Conversational UI**: có, ô hỏi nhỏ nói trên.
- **Progressive Disclosure**: đã ổn (chỉ mở khi cần) — giữ nguyên.
- **AI Suggestion**: không trọng yếu ở đây.
- **Graph Exploration**: hiện 3 nút thu nhỏ (điều khoản này — bị sửa bởi gì — sửa đổi cái gì) ngay trong panel, thay vì chỉ link chữ.
- **Timeline**: đề xuất chính, xem trên — thay thế hoàn toàn nút link rời rạc.
- **Visual Reasoning**: mini timeline + mini graph trong cùng một panel nhỏ gọn.

## Kết luận review
Vấn đề không nằm ở từng màn hình riêng lẻ — nằm ở **kiến trúc điều hướng gốc**: 7 trang tuần tự có điểm bắt đầu/kết thúc rõ ràng, đúng tư duy ứng dụng truyền thống. AI-Native thật sự đòi hỏi bỏ khái niệm "màn hình" và "bước", thay bằng một **dòng chảy liên tục** (thread/canvas) nơi nội dung xuất hiện và tích luỹ, không "chuyển trang". Thiết kế lại cụ thể ở `11_AI_NATIVE_REDESIGN.md`.
