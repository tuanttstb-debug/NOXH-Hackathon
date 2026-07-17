# 16 — Design Review: NOXH Copilot

> Đọc trong 15 phút — dài hơn quy ước thông thường vì bản chất là phản biện toàn diện trước khi viết dòng code đầu tiên, theo yêu cầu trực tiếp. Phạm vi đánh giá: toàn bộ `docs/` (00–15) và `knowledge/`. Trạng thái tại thời điểm review: **0 dòng code, 0 lần demo thử, toàn bộ là tài liệu thiết kế**. Đây là sự thật quan trọng nhất chi phối mọi điểm số dưới đây.

## Tóm tắt điều hành

| Tiêu chí | Điểm hiện tại /10 | Điểm tối đa khả thi /10 (đội 1–2 người, 48h) |
|---|---|---|
| 1. Chất lượng triển khai kỹ thuật | 1 | 6 |
| 2. AI-Native | 2 | 8 |
| 3. Business | 4 | 6 |
| 4. UX | 1 | 6 |
| 5. Safety | 5 | 8 |
| 6. Demo | 2 | 7 |
| **Tổng** | **15/60 (25%)** | **41/60 (68%)** |

**Nhận định thẳng**: nền móng tư duy (ontology, nguyên tắc Grounding, phân loại rủi ro) thuộc loại tốt so với mặt bằng chung hackathon — nhưng đây là điểm cho *kế hoạch*, không phải *sản phẩm*. Ban giám khảo không chấm PDF, họ chấm cái chạy được trên màn hình. Khoảng cách 15→41 điểm chỉ đạt được nếu toàn bộ thời gian còn lại dồn vào build, không phải viết thêm tài liệu. **Đây chính là rủi ro lớn nhất của dự án, lớn hơn mọi rủi ro pháp lý đã ghi trong `12_QUAN_LY_RUI_RO.md`.**

Ghi chú phương pháp: chưa có rubric chính thức từ BTC (OPEN QUESTION #3 trong `00_PROJECT_MEMORY.md`), nên thang điểm trên là rubric tự dựng để phản biện có cấu trúc — không phải điểm số thật sẽ nhận.

---

## Đánh giá chi tiết theo tiêu chí

### 1. Chất lượng triển khai kỹ thuật
- **Điểm hiện tại: 1/10.**
- **Điểm tối đa có thể đạt: 6/10** (không thể hơn — 1–2 người/48h không đủ để có kiến trúc production-grade, kể cả khi thực thi hoàn hảo).
- **Lý do**: Không có gì để chấm ngoài tài liệu. `13_QUYET_DINH_KIEN_TRUC.md` liệt kê 4 ADR nhưng cả 4 đều ở trạng thái "Đề xuất" — chưa có bằng chứng nào được hiện thực hoá.
- **Điểm còn thiếu**: Toàn bộ pipeline `06_KIEN_TRUC_AI_AGENT.md` (Parse → Retrieve → Reasoning → Fact-Check) chưa có một dòng chạy được. Chưa có xử lý lỗi (LLM trả JSON sai định dạng thì sao?), chưa có đo latency, chưa có cách lưu trữ Knowledge Graph thật (`ADR-02` chọn "cấu trúc đơn giản" nhưng chưa định nghĩa cụ thể là gì).
- **Rủi ro**: Đội đã dùng một phần đáng kể quỹ thời gian 48h để viết ~40 file tài liệu. Nếu tiếp tục ở chế độ "viết thêm doc", technical score sẽ giữ nguyên ở mức gần 0 khi hết giờ.

### 2. AI-Native
- **Điểm hiện tại: 2/10.**
- **Điểm tối đa có thể đạt: 8/10** — thiết kế có tiềm năng thật (grounding, đa agent, phát hiện chồng lấp dữ liệu theo thời gian) nếu build đúng.
- **Lý do**: Trên giấy, tư duy AI-Native đúng hướng — tách "nguồn sự thật" (Knowledge Graph) khỏi "khả năng diễn giải" (LLM), bắt buộc Fact-Check độc lập. Nhưng AI-Native là tiêu chí đánh giá **hành vi quan sát được**, không phải triết lý thiết kế. Chưa có bất kỳ lệnh gọi LLM nào từng chạy.
- **Điểm còn thiếu**: Cơ chế retrieval cụ thể (vector search? keyword? graph traversal thật?) chưa được định nghĩa kỹ thuật — `05_KIEN_TRUC_GIAI_PHAP.md` và `07_KNOWLEDGE_GRAPH.md` mô tả bằng ngôn ngữ nghiệp vụ, không phải thuật toán. Chưa có số liệu benchmark (độ chính xác, chi phí token, độ trễ).
- **Rủi ro**: "Potemkin AI" — rủi ro lớn nhất của tiêu chí này. Vì đội chỉ có 1–2 người, có khả năng cao hệ thống thực tế build ra chỉ là 1 prompt LLM dài với vài dữ kiện hard-code, trong khi tài liệu mô tả 4 agent tách biệt (`legal_reasoner`, `eligibility`, `fact_check`, `legal_diff`). Nếu giám khảo kỹ thuật hỏi "cho tôi xem 4 agent này chạy độc lập ở đâu", đội cần có câu trả lời trung thực, không chỉ trỏ vào tài liệu.

### 3. Business
- **Điểm hiện tại: 4/10.**
- **Điểm tối đa có thể đạt: 6/10** (LegalTech B2G/B2C khó chứng minh mô hình kinh doanh trong 48h dù có làm tốt đến đâu).
- **Lý do**: Vấn đề được đóng khung tốt, có bằng chứng thực tế (4 lần sửa Nghị định trong 20 tháng — `07_KNOWLEDGE_GRAPH.md`), có persona và hành trình người dùng (`04_DOI_TUONG_NGUOI_DUNG.md`). Nhưng dừng lại ở "chứng minh vấn đề có thật", chưa chạm tới "ai trả tiền, bằng cách nào".
- **Điểm còn thiếu**: Không có mô hình doanh thu, không có ước tính quy mô thị trường (TAM/SAM), không có phân tích đối thủ ngoài "chatbot chung chung" (thiếu so sánh với tư vấn viên BĐS, luật sư, cán bộ Sở Xây dựng — đều là "đối thủ" miễn phí và có thẩm quyền cao hơn AI). `10_LO_TRINH_TRIEN_KHAI.md` liệt kê hướng mở rộng nhưng không gắn với nguồn lực/người thực hiện.
- **Rủi ro**: Sản phẩm giải quyết một nhu cầu tần suất thấp (mua nhà không phải hành vi lặp lại) — mô hình subscription khó áp dụng cho người dùng cuối. Nếu không xác định rõ ai trả tiền trước khi pitch, phần Business sẽ bị đánh giá là "tính năng hay ho, không phải sản phẩm".

### 4. UX
- **Điểm hiện tại: 1/10.**
- **Điểm tối đa có thể đạt: 6/10** (hackathon không đòi hỏi UI đẹp, nhưng đòi hỏi rõ ràng và đúng đối tượng).
- **Lý do**: Đây là hệ quả trực tiếp của quyết định đúng đắn ban đầu ("không thiết kế giao diện" ở giai đoạn lập kế hoạch — `00_MUC_LUC.md`). Đúng lúc đó, nhưng bây giờ là lúc phải đảo ngược: UX phải bắt đầu ngay sau review này.
- **Điểm còn thiếu**: Chưa có wireframe. Chưa có phương án hiển thị trích dẫn pháp lý (Điều/Khoản) theo cách người không rành luật hiểu được — đây là bài toán UX khó nhất của sản phẩm, chưa được động đến. Chưa có thiết kế cho trạng thái "Thiếu thông tin" sao cho người dùng không cảm thấy sản phẩm "không biết gì" và bỏ đi.
- **Rủi ro**: Persona "anh Minh" (`04_DOI_TUONG_NGUOI_DUNG.md`) là ASSUMPTION, chưa từng được kiểm chứng với người dùng thật — toàn bộ UX sắp thiết kế sẽ dựa trên một giả định chưa xác minh.

### 5. Safety
- **Điểm hiện tại: 5/10** — điểm cao nhất trong 6 tiêu chí, nhưng vẫn ở mức trung bình vì chưa có gì được kiểm chứng.
- **Điểm tối đa có thể đạt: 8/10** (không thể tuyệt đối 10 vì bản chất tư vấn pháp lý luôn có sai số biên).
- **Lý do**: Đây là phần thiết kế nghiêm túc nhất — nguyên tắc "Grounding trước, Generation sau", Fact-Check bắt buộc không tuỳ chọn, gắn nhãn `do_tin_cay` cho dữ liệu chưa xác minh (`ontology/metadata.md`), quy tắc "Thiếu thông tin" thay vì đoán. Cao hơn hẳn mặt bằng chung một sản phẩm AI hackathon thường thấy.
- **Điểm còn thiếu**: `fact_check.md` (agent) tự thừa nhận 2/3 phép kiểm tra nên là code, nhưng phép kiểm tra thứ 3 (khớp logic) vẫn dùng LLM — nghĩa là dùng AI kiểm tra AI, không phải kiểm chứng độc lập thật sự. Chưa có red-team test (cố tình ép hệ thống trả lời chắc chắn khi không nên) — 4 test case hiện có (`knowledge/evaluation/eligibility_test_cases.md`) đều là kịch bản thuận, chưa có kịch bản đối kháng.
- **Rủi ro**: Chưa có tài liệu nào đề cập trách nhiệm pháp lý (liability) khi AI trả lời sai và người dùng dựa vào đó để nộp hồ sơ thật — đây là rủi ro an toàn thực tế (real-world harm), không chỉ rủi ro kỹ thuật.

### 6. Demo
- **Điểm hiện tại: 2/10.**
- **Điểm tối đa có thể đạt: 7/10.**
- **Lý do**: `11_KICH_BAN_DEMO.md` có cấu trúc kể chuyện hợp lý (3 kịch bản + điểm nhấn "Thiếu thông tin" làm bằng chứng Safety) — là kịch bản tốt trên giấy. Nhưng 0 lần rehearsal, 0 lần chạy thử end-to-end.
- **Điểm còn thiếu**: Không có kế hoạch dự phòng khi demo trực tiếp gặp sự cố (mạng lag, API timeout, edge case ngoài kịch bản). Thời lượng demo thật vẫn là OPEN QUESTION chưa trả lời (`00_MUC_LUC.md` mục 6) — kịch bản có thể phải cắt gọt gấp vào phút chót.
- **Rủi ro**: Với đội 1–2 người, chưa có phân công rõ ai thao tác máy, ai thuyết trình, ai xử lý sự cố nếu có — rủi ro vận hành trong chính lúc trình bày.

---

## Challenge Session — Không nể nang

### Nếu là Ban Giám khảo Hackathon (tổng quát, khó nhất)
1. Các bạn đã dùng bao nhiêu trong 48 giờ để viết gần 40 file tài liệu thay vì code? Còn lại bao nhiêu giờ để build thật?
2. Nếu tôi hỏi hệ thống một câu ngoài đúng 3 kịch bản đã luyện, nó trả lời gì — có sập, có bịa, hay có xử lý được?
3. Cái gì trong sản phẩm là AI thật, cái gì là if-else được gọi tên hoa mỹ là "Agent"?
4. Nếu tắt kết nối tới nguồn dữ liệu/API ngay bây giờ, sản phẩm còn chạy được phần nào?
5. Đây là giải pháp cho bài toán "Nhà ở xã hội", hay là một RAG chatbot pháp lý tổng quát đang mượn domain NOXH để demo? Nếu đổi domain dữ liệu, kiến trúc có tái dùng được không — vậy giá trị cốt lõi nằm ở dữ liệu hay ở kiến trúc?

### Nếu là Microsoft — Challenge Architecture
1. `ADR-02` (`13_QUYET_DINH_KIEN_TRUC.md`) chọn không dùng Graph DB thật cho demo. Vậy có graph traversal thật không, hay chỉ là bảng tra cứu được dán nhãn "Knowledge Graph" cho ấn tượng? Nếu là key-value lookup, sao gọi là đồ thị tri thức?
2. Ontology (`ontology/node_types.md`, `relationship_types.md`) định nghĩa rất chi tiết trên giấy — ai viết engine thực thi truy vấn quan hệ `SUA_DOI_BOI_SUNG` kèm thuộc tính `khia_canh`? Hay đây vẫn là suy luận thủ công của con người khi nhập liệu, và ontology chỉ là tài liệu mô tả, không phải schema đang chạy?
3. "Một Agent, một pipeline tuyến tính" (`ADR-03`) — nhưng tài liệu mô tả 4 agent riêng biệt (`legal_reasoner`, `eligibility`, `fact_check`, `legal_diff`). Chúng chạy trong cùng một process hay là chuỗi lời gọi API tuần tự? Độ trễ cộng dồn qua 4 bước là bao nhiêu giây?
4. Không tài liệu nào đề cập xử lý lỗi — điều gì xảy ra khi LLM trả về JSON sai định dạng giữa các bước pipeline? Enterprise architecture yêu cầu graceful degradation, không chỉ happy path.
5. "Data Lineage" (`09_KIEN_TRUC_DU_LIEU.md`) là khái niệm mô tả hay đã có cơ chế ID/foreign-key truy vết thật? Kiến trúc doanh nghiệp cần bằng chứng, không phải bằng lời.

### Nếu là Google — Challenge AI
1. "Grounding trước, Generation sau" nghe hay, nhưng cơ chế retrieval là gì — vector search, keyword match, hay graph traversal? Tài liệu chỉ nói "truy vấn Knowledge Graph", không nói bằng thuật toán nào.
2. Model nào? Có fine-tune không, hay chỉ prompt engineering thuần (`knowledge/prompts/`)? Nếu chỉ là prompt dài kèm quy tắc "không được làm", "AI Agent" chỉ là tên gọi hoa mỹ cho một lệnh gọi API có system prompt kỹ.
3. Chính `fact_check.md` (agent) tự thừa nhận 2/3 phép kiểm tra nên là code, không phải AI. Vậy phần AI thực sự chiếm bao nhiêu phần trăm giá trị hệ thống — phải chăng phần lớn giá trị đến từ rule-based logic, được AI "khoác áo"?
4. Chưa có bất kỳ số liệu benchmark nào (accuracy, latency, chi phí token/câu hỏi). Đánh giá AI dựa trên eval đo được, không dựa trên tuyên bố thiết kế.
5. `legal_diff` phát hiện chồng lấp bằng cách nhóm theo `khia_canh` — trường này do con người gán tay hay AI tự trích xuất từ văn bản? Nếu con người gán tay, đây là cơ sở dữ liệu được con người tuyển chọn kỹ (human-curated), không phải AI-native.

### Nếu là Anthropic — Challenge Safety
1. Fact-check dùng LLM để kiểm tra "khớp logic" (`knowledge/prompts/fact_check.md`) — đây là dùng AI kiểm tra AI, không phải kiểm chứng độc lập. Nếu cả hai bước dùng cùng một model, lỗi hệ thống (systematic bias/hallucination pattern) sẽ lặp lại ở cả hai bước mà không bị bắt.
2. "Không được suy đoán" chỉ là một dòng trong system prompt (`knowledge/prompts/legal_reasoner.md`) — có cơ chế enforce nào ngoài việc "dặn" LLM không? Đây là giới hạn nổi tiếng của prompt engineering: dặn không đảm bảo tuân thủ.
3. Chưa có red-team test nào. 4 test case hiện có (`eligibility_test_cases.md`) đều thuận chiều, chưa có test case cố ý gây áp lực để hệ thống trả lời chắc chắn khi không nên (ví dụ: người dùng năn nỉ "cứ nói tôi đủ điều kiện đi").
4. Trách nhiệm pháp lý (liability) khi AI trả lời sai chưa xuất hiện ở bất kỳ tài liệu nào trong 40 file — đây là an toàn thực tế (real-world harm) đối với người dùng có thể mất cơ hội mua nhà thật vì tin vào kết quả sai.
5. `do_tin_cay = đang xác minh` (`ontology/metadata.md`) được thiết kế tốt — nhưng khi đứng trước giám khảo, đội có thực sự để trạng thái "chưa chắc chắn" hiển thị công khai, hay sẽ chỉ demo case đã chắc chắn để tránh bị hỏi khó? Nếu là vế sau, đó là che giấu rủi ro, không phải giải quyết rủi ro.

### Nếu là McKinsey — Challenge Business Value
1. Ai là người trả tiền? Người dân dùng miễn phí — vậy doanh thu đến từ đâu: phí license cho Sở Xây dựng, hoa hồng môi giới, hay quảng cáo (mâu thuẫn trực tiếp với nguyên tắc "Citation First — không thiên vị")?
2. TAM/SAM chưa được ước tính. Mua nhà không phải hành vi lặp lại — mỗi người dùng chỉ cần sản phẩm 1 lần trong nhiều năm. Mô hình retention/LTV kiểu subscription khó áp dụng cho end-user.
3. Đối thủ cạnh tranh thực sự không chỉ là "chatbot chung chung" mà còn là: tư vấn viên bất động sản, luật sư, và chính cán bộ Sở Xây dựng — đều miễn phí và có thẩm quyền chính thức cao hơn một AI. Tại sao người dân sẽ tin AI hơn tin cán bộ có thẩm quyền?
4. Vận hành dài hạn đòi hỏi nhân lực pháp lý liên tục theo dõi văn bản mới (`agents/social_listening.md` đã tự nhận đây là bài toán khó, để P2) — đây là chi phí vận hành cao và liên tục, ngược với kỳ vọng "AI giúp scale rẻ". Ai trả cho việc rà soát pháp lý thủ công này mãi mãi?
5. `10_LO_TRINH_TRIEN_KHAI.md` liệt kê hướng mở rộng sau Hackathon nhưng không gắn với nguồn lực/cam kết cụ thể. Đây là roadmap thật có người làm tiếp, hay chỉ là slide đẹp để kết thúc bài thuyết trình?

---

## Kết luận & Khuyến nghị hành động

Nền tảng tư duy (Product → Architecture → AI) đã đủ vững để dừng viết tài liệu. Tiếp tục mở rộng `docs/`/`knowledge/` từ điểm này trở đi có giá trị biên giảm dần và trực tiếp đe doạ điểm Kỹ thuật/Demo — hai tiêu chí đang thấp nhất và có tối đa khả thi cao nhất nếu hành động ngay.

**5 việc ưu tiên trước khi viết dòng code đầu tiên (đã viết tài liệu, giờ là lúc dừng):**
1. Xác nhận `datasets/` tối thiểu (dù còn ở trạng thái "đang xác minh") để có dữ liệu thật chạy thử — không chờ toàn văn hợp nhất hoàn hảo mới bắt đầu build (OPEN QUESTION #1 không nên tiếp tục chặn tiến độ code).
2. Build thử **một** luồng end-to-end đơn giản nhất (dù thô) trong vài giờ tới, để biết kiến trúc 4-agent có khả thi trong quỹ thời gian còn lại không — nếu không, giảm xuống 1–2 agent gộp và ghi lại lý do (cập nhật ADR).
3. Thiết kế nhanh 1 wireframe tối thiểu cho cách hiển thị trích dẫn pháp lý dễ hiểu — đây là rủi ro UX lớn nhất và chưa ai chạm tới.
4. Viết ít nhất 2 test case đối kháng (red-team) bổ sung cho `eligibility_test_cases.md`, không chỉ test case thuận — vì đây là bằng chứng Safety mạnh nhất nếu giám khảo hỏi khó.
5. Rehearsal kịch bản demo ít nhất 1 lần với dữ liệu thật, có kế hoạch dự phòng khi lỗi — hiện là 0 lần.

**Câu hỏi phải tự trả lời trước khi pitch**: nếu giám khảo chỉ được hỏi một câu duy nhất, khả năng cao nhất là "Cho tôi xem nó chạy" — không phải "Cho tôi xem kiến trúc". Toàn bộ 40 file tài liệu chỉ có giá trị nếu rút ngắn được thời gian build đúng hướng, không phải nếu thay thế cho việc build.
