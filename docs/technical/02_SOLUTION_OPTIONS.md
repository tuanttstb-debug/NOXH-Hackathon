# 02 — Challenge Requirement (MoSCoW) & Solution Options

> Đọc trong 15 phút. Bước 2 (Challenge Requirement) + Bước 3 (Đề xuất phương án, chưa chọn) theo yêu cầu Technical Discovery. Không sửa `docs/features/PROJECT_INTELLIGENCE.md`.

---

## Phần A — Challenge Requirement (MoSCoW)

BRD gốc đánh dấu 9/10 Functional Requirement là "Bắt buộc — MVP". Bảng dưới đây phản biện từng FR theo 5 câu hỏi bắt buộc của Bước 2.

| FR | Thật sự cần cho MVP? | Giản lược được? | Thay bằng AI Agent được không? | Mock được không? | Phụ thuộc backend? | **MoSCoW** |
|---|---|---|---|---|---|---|
| FR-01 Entity Resolution | Có — không có thì không tra được dự án nào | Có — string similarity (Levenshtein/trigram) + alias list tĩnh, không cần embedding | Không nên — dùng LLM cho việc match ~20-50 tên là over-engineering | Alias list nhập tay trước demo — được | Có, nhưng chỉ cần tập dữ liệu tĩnh (JSON), không cần DB | **Must Have** (rút gọn kỹ thuật tối đa) |
| FR-02 Project Search | Có — entry point của cả module | Có — bỏ filter theo địa phương/CĐT/pháp lý ở bản đầu, chỉ giữ tìm theo tên/alias | Không cần | Filter nâng cao mock được | Có, nhẹ | **Must Have** (bản rút gọn: chỉ tên/alias) |
| FR-03 Project Intelligence (tổng quan) | Có — giá trị cốt lõi, không có thì module không tồn tại | Có — chỉ hiển thị field đã có trong dataset demo | AI chỉ diễn giải, không phát minh field | Không nên mock — đây là phần phải chứng minh chạy thật | Có | **Must Have** |
| FR-04 Developer Intelligence | Có giá trị nhưng không phải điều kiện tồn tại của module | Có — bỏ "liên kết rủi ro chéo dự án" (đa hop KG), giữ hồ sơ CĐT tĩnh (tên, số dự án) | Không cần AI riêng, chỉ lookup | Lịch sử tranh chấp 2-3 CĐT demo có thể mock | Có | **Should Have** (rút gọn, bỏ cross-project linking sang Phase 2) |
| FR-05 News Intelligence | Có — tạo cảm giác "AI thật" rõ nhất với giám khảo | Có — gắn sentiment/topic khi ingest (LLM 1 lần, không real-time classifier) | Có — dùng đúng 1 LLM call lúc ingest, không cần model chuyên biệt | Nhãn có thể bán tự động, nhưng tin tức phải là dữ liệu thật đã crawl | Có | **Must Have** (rút gọn quy trình gắn nhãn) |
| FR-06 Legal Intelligence | Có — điểm khác biệt cốt lõi, giao thoa trực tiếp Eligibility Checker | Có — tái dùng nguyên Legal KG đã thiết kế (`docs/07_KNOWLEDGE_GRAPH.md`), chỉ thêm cạnh `GOVERNED_BY` | Không — phải giữ nguyên tắc Grounding trước Generation (ADR-01), không cho AI tự suy luận pháp lý | Không nên mock — rủi ro pháp lý cao | Có — **dùng chung backend với Eligibility Checker** | **Must Have** — phụ thuộc cứng vào Eligibility Checker P0 xong trước |
| FR-07 Risk Detection | Có giá trị demo cao nhưng thuật toán phát hiện tự động là bài toán khó | Có — gắn nhãn rủi ro thủ công/bán tự động khi ingest, không xây "hệ thống phát hiện" thật | LLM tóm tắt/gắn nhãn lúc ingest, không real-time | Có — ứng viên rút gọn tốt nhất | Có, nhẹ | **Should Have** (đổi bản chất: "gắn nhãn" thay vì "phát hiện") |
| FR-08 Suitability Analysis | Trùng lặp gần hoàn toàn với Eligibility Checker đã có sẵn pipeline riêng | Có — tái dùng `use-eligibility-chat` khi module đó xong, chỉ truyền thêm Project context | Đã có AI agent riêng (Eligibility Agent) — không xây lại | Mock hoàn toàn ở bản đầu (chỉ link sang) | Phụ thuộc Eligibility Checker backend | **Could Have** cho Project Intelligence v1 → Must Have sau khi Eligibility Checker chạy |
| FR-09 Citation | Bắt buộc tuyệt đối — BRD tự ghi "không thương lượng"; đồng nhất ADR-01 | **Không giản lược cơ chế**, chỉ giản lược hiển thị (list text thay vì UI trích dẫn phức tạp) | Không — đây là lớp kiểm soát AI, không phải việc AI tự làm | **Không được mock** | Có — bước xử lý bắt buộc trong pipeline | **Must Have** (không đổi) |
| FR-10 Follow-up Question | Có giá trị demo nhưng chi phí kỹ thuật (multi-turn state) không tương xứng | Có — giữ Project ID ở client, gửi lại toàn bộ context mỗi lần gọi LLM (stateless), giới hạn 1 lượt hỏi tiếp | Đã là AI (chính LLM call) | Giới hạn 1 lượt follow-up cho demo | Có, tái dùng nguyên pipeline reasoning | **Should Have** (rút gọn: single follow-up, không session store) |

**Kết luận Bước 2**: Chỉ 4/10 FR còn giữ nguyên mức "Must Have" không đổi bản chất (FR-02 rút gọn, FR-03, FR-06, FR-09). 3 FR chuyển xuống Should Have (FR-04, FR-05 giữ Must nhưng đổi cách làm, FR-07, FR-10). FR-08 chuyển Could Have. Không có FR nào bị loại hoàn toàn (Won't Have) — toàn bộ 10 FR đều có phiên bản rút gọn khả thi, khác với việc cắt bỏ.

---

## Phần B — Solution Options (chưa chọn, so sánh ở Bước 4 trong `03_FINAL_ARCHITECTURE.md`)

Với mỗi thành phần: tối thiểu 2 phương án, so sánh Ưu điểm / Nhược điểm / Độ phức tạp / Chi phí / Rủi ro / Khả năng demo / Khả năng mở rộng.

### B1. Entity Resolution

| Tiêu chí | A. Exact + Alias list tĩnh | B. Fuzzy string match (trigram/Levenshtein) + alias | C. Embedding similarity (semantic match) |
|---|---|---|---|
| Ưu điểm | Đơn giản nhất, 100% dự đoán được kết quả | Chịu được lỗi gõ/viết tắt, vẫn không cần hạ tầng ML | Xử lý được cả trường hợp tên gần giống về nghĩa, không chỉ về chữ |
| Nhược điểm | Thất bại ngay khi người dùng gõ sai/viết tắt — hỏng chính kịch bản "Ecohome" mà BRD dùng làm ví dụ khác biệt | Vẫn có thể nhầm giữa các tên viết gần giống nhau về mặt chữ nhưng khác dự án | Cần embedding model + vector store — hạ tầng mới hoàn toàn |
| Độ phức tạp | Rất thấp | Thấp | Trung bình–Cao |
| Chi phí | ~0 | ~0 (thư viện string-similarity có sẵn) | Chi phí gọi embedding API + lưu trữ vector |
| Rủi ro | Cao — dễ demo thất bại ngay bước đầu | Thấp | Trung bình — thêm 1 điểm lỗi hạ tầng mới trong 48h |
| Khả năng demo | Yếu — không chứng minh được "AI-Native" | Đủ tốt — chứng minh được cơ chế xác nhận đa lựa chọn (FR-01) | Tốt nhất về mặt "ấn tượng" nhưng rủi ro vận hành cao hơn giá trị tăng thêm ở N=20-50 |
| Khả năng mở rộng | Kém — không scale khi số dự án tăng | Trung bình — vẫn cần alias thủ công khi scale | Tốt — đúng hướng Phase 2 (BRD mục 12.2) |

### B2. News Crawl

| Tiêu chí | A. Crawl thủ công/bán tự động 1 lần cho tập demo (~20-50 dự án) | B. Crawler tự động theo lịch (Scrapy/Playwright + RSS) | C. Không crawl — mọi tin tức lấy qua Live Search theo yêu cầu |
|---|---|---|---|
| Ưu điểm | Kiểm soát chất lượng dữ liệu trước Demo Day, không phụ thuộc uptime nguồn ngoài lúc demo | Luôn cập nhật, đúng tinh thần "production" | Không tốn thời gian xây crawler |
| Nhược điểm | Dữ liệu tĩnh, không tự cập nhật (chấp nhận được cho demo) | Rủi ro crawler lỗi/nguồn thay đổi cấu trúc HTML ngay trước demo | Latency cao, phụ thuộc API bên ngoài mỗi lần hỏi, không xây được News DB/KG bền vững |
| Độ phức tạp | Thấp | Cao | Trung bình (phụ thuộc độ phức tạp gọi Live Search) |
| Chi phí | Thời gian nhân sự (đọc/gắn nhãn thủ công) | Hạ tầng crawler + bảo trì | Chi phí API mỗi lần truy vấn |
| Rủi ro | Thấp | Cao — đúng loại rủi ro "Crawler Failure" nêu ở Bước 11 | Trung bình — phụ thuộc rate limit/độ ổn định API ngoài |
| Khả năng demo | Cao — dữ liệu đã kiểm chứng, không lo lỗi runtime | Trung bình — rủi ro lỗi ngay lúc demo | Trung bình — latency ảnh hưởng trải nghiệm demo trực tiếp |
| Khả năng mở rộng | Kém — không tự động | Tốt | Trung bình — không xây được nền tảng KG lâu dài |

### B3. Knowledge Graph (lưu trữ)

| Tiêu chí | A. PostgreSQL (managed serverless: Supabase/Neon) + bảng `edges` | B. Native Graph DB (Neo4j/Neptune) | C. Structured JSON/TS tĩnh (không DB) |
|---|---|---|---|
| Ưu điểm | Hỗ trợ SQL quen thuộc + pgvector nếu cần vector search sau; đúng theo ADR-02 pattern đã dùng cho Legal KG | Truy vấn đa hop mạnh nhất, đúng bản chất "graph" | Zero infra — khớp 100% với pattern hiện tại của repo (`knowledge/phap_ly/*.md`, `web/mock/*.ts`); không thêm điểm lỗi mới |
| Nhược điểm | Cần setup + hosting mới (dù nhanh, vẫn là thành phần hạ tầng chưa từng tồn tại trong repo) | Học phí vận hành cao trong 48h, không ai trong đội "đã quen thuộc" (vi phạm nguyên tắc chọn công nghệ ở `13_QUYET_DINH_KIEN_TRUC.md`) | Không hỗ trợ truy vấn quan hệ phức tạp/vector search thật; phải tự viết logic join trong code ứng dụng |
| Độ phức tạp | Trung bình | Cao | Rất thấp |
| Chi phí | Thấp (free tier serverless đủ cho demo) | Cao (thời gian setup + vận hành) | ~0 |
| Rủi ro | Trung bình — thêm 1 dependency ngoài (DB provider) | Cao — rủi ro tiến độ lớn nhất trong toàn bộ B1-B9 | Thấp nhất |
| Khả năng demo | Tốt — đủ mạnh cho ~20-50 dự án + vài trăm tin tức | Tốt nếu chạy được, nhưng rủi ro không chạy kịp | Đủ tốt cho quy mô demo, nhưng không "trông" ấn tượng bằng truy vấn KG thật nếu giám khảo hỏi sâu |
| Khả năng mở rộng | Tốt — đúng lộ trình BRD mục 12.2/12.3 | Tốt nhất về lý thuyết | Kém — phải migrate hoàn toàn khi scale |

### B4. Vector Search / Embedding

| Tiêu chí | A. pgvector (trong PostgreSQL) | B. In-process embedding + cosine similarity (không DB, tính trong bộ nhớ ứng dụng) | C. Không dùng vector — keyword/tag filter thuần |
|---|---|---|---|
| Ưu điểm | Semantic search thật, tích hợp cùng KG storage nếu chọn B3-A | Semantic search thật mà không cần DB — tính trực tiếp trong Node.js process ở quy mô nhỏ | Đơn giản nhất, không phụ thuộc embedding API lúc runtime |
| Nhược điểm | Phụ thuộc B3-A đã chọn PostgreSQL | Không scale quá vài trăm–vài nghìn item (chấp nhận được ở quy mô demo) | Không xử lý được truy vấn diễn đạt khác từ ngữ (recall thấp hơn) |
| Độ phức tạp | Trung bình | Thấp–Trung bình | Rất thấp |
| Chi phí | Chi phí embedding API khi ingest (1 lần, nhỏ) | Như A nhưng không tốn chi phí lưu trữ vector DB | ~0 |
| Rủi ro | Trung bình (phụ thuộc B3) | Thấp | Thấp |
| Khả năng demo | Tốt | Tốt — vẫn chứng minh được "semantic", không cần khoe hạ tầng | Yếu hơn khi giám khảo hỏi câu diễn đạt khác — nhưng ở tập dữ liệu nhỏ đã curate kỹ, khác biệt không lớn |
| Khả năng mở rộng | Tốt | Trung bình — cần migrate ra DB khi data lớn | Kém |

### B5. Live Search (cập nhật mới nhất)

| Tiêu chí | A. Gọi search API sẵn có, kích hoạt theo yêu cầu (escape hatch) | B. Không triển khai ở MVP — luôn trả "chưa có dữ liệu mới nhất, dữ liệu tính đến ngày X" |
|---|---|---|
| Ưu điểm | Đúng tinh thần Hybrid đề xuất trong BRD, tăng điểm "AI-Native" | Không thêm điểm lỗi/chi phí, tập trung nguồn lực vào Reasoning + Citation (giá trị lõi) |
| Nhược điểm | Thêm 1 dependency ngoài + rủi ro chi phí không kiểm soát (đã tự nêu trong BRD Risk #6) | Mất 1 phần trải nghiệm "luôn mới nhất" |
| Độ phức tạp | Trung bình | Không có |
| Chi phí | Biến động theo tần suất gọi | 0 |
| Rủi ro | Trung bình–Cao (rate limit, chi phí, chất lượng nguồn không kiểm soát) | Thấp |
| Khả năng demo | Cao nếu chạy ổn định lúc demo; rủi ro nếu mạng/API lỗi ngay lúc trình bày | An toàn — timestamp rõ ràng vẫn là một dạng minh bạch được đánh giá cao ở tiêu chí Safety |
| Khả năng mở rộng | Tốt, đúng lộ trình BRD | Cần bổ sung sau, không mất kiến trúc nếu thiết kế đúng "escape hatch" ngay từ đầu (chỉ chưa nối dây) |

### B6. Caching

| Tiêu chí | A. Không cache | B. In-memory cache theo Project ID (trong process Next.js) | C. Cache bền vững (Redis/DB) có TTL |
|---|---|---|---|
| Ưu điểm | Đơn giản nhất, luôn tính mới | Rẻ, nhanh implement, tăng tốc đáng kể khi demo hỏi lại cùng 1 dự án | Bền vững qua restart, chia sẻ giữa nhiều instance |
| Nhược điểm | Chậm và tốn token nếu demo hỏi lại cùng dự án nhiều lần | Mất cache khi restart server (chấp nhận được cho demo) | Thêm 1 hạ tầng mới hoàn toàn (Redis) — không cần thiết ở quy mô 1 server demo |
| Độ phức tạp | Không có | Rất thấp | Trung bình |
| Chi phí | Cao hơn về token/latency lặp lại | ~0 | Chi phí hosting Redis |
| Rủi ro | Thấp về hạ tầng, cao về trải nghiệm demo (chờ lâu mỗi lần) | Thấp | Trung bình (thêm dependency) |
| Khả năng demo | Yếu nếu latency LLM cao | Tốt | Tốt nhưng dư thừa cho quy mô 1 server |
| Khả năng mở rộng | Kém | Trung bình (không chia sẻ giữa instance) | Tốt |

### B7. Reasoning (AI Synthesis)

| Tiêu chí | A. 1 LLM call, structured output, pipeline tuyến tính nhiều bước (mỗi "Agent" BRD = 1 hàm/bước trong cùng pipeline) | B. Agentic loop tự lặp (LLM tự quyết định bước tiếp theo) | C. Multi-agent độc lập thật sự (mỗi Agent BRD là 1 LLM call/service riêng, có thể gọi lẫn nhau) |
|---|---|---|---|
| Ưu điểm | Dễ debug, chi phí/latency dự đoán được, đúng ADR-03 đã áp dụng cho Eligibility Checker | Linh hoạt hơn khi truy vấn phức tạp, có khả năng tự sửa lỗi | Khớp sát nhất với tên gọi trong BRD ("Entity Resolution Agent", "AI Synthesis Agent", "Live Search Agent") |
| Nhược điểm | Kém linh hoạt khi cần agent tự quyết định có cần tra thêm nguồn hay không | Khó debug trong 48h, chi phí/latency khó dự đoán, rủi ro loop vô hạn | Phức tạp điều phối, nhiều điểm lỗi, đúng loại rủi ro "Potemkin AI" đã bị Design Review cảnh báo nếu chỉ làm hình thức |
| Độ phức tạp | Thấp–Trung bình | Cao | Cao |
| Chi phí | Thấp–Trung bình (số lượng token dự đoán được) | Cao, khó dự đoán | Cao (nhiều LLM call hơn) |
| Rủi ro | Thấp | Cao | Cao — rủi ro cụ thể: giám khảo hỏi "cho xem 4 agent chạy độc lập ở đâu" và đội không trả lời được trung thực (đã xảy ra tương tự với 4 agent Eligibility trong Design Review) |
| Khả năng demo | Tốt — tái dùng UI `reasoningSteps` đã build sẵn trong `web/hooks/use-eligibility-chat.ts`, chỉ đổi nội dung bước | Trung bình — khó kiểm soát thời lượng demo | Trung bình — ấn tượng nếu chạy đúng, nhưng rủi ro cao nhất không chạy kịp |
| Khả năng mở rộng | Tốt — có thể tách agent thật sau khi pipeline tuyến tính đã chứng minh đúng logic | Tốt về lý thuyết | Tốt nhất về lý thuyết, nhưng chỉ khi có đủ thời gian/đội ngũ (Phase 2/3, không phải 48h) |

### B8. Citation Binding

| Tiêu chí | A. Post-processing bắt buộc (reject claim không có nguồn khớp trong context đã truy xuất) | B. Chỉ dựa vào prompt instruction ("hãy trích dẫn nguồn") |
|---|---|---|
| Ưu điểm | Đảm bảo Grounding thật, không phụ thuộc độ tuân thủ của LLM; đúng ADR-01 đã áp dụng cho Eligibility Checker | Nhanh implement nhất |
| Nhược điểm | Cần thêm 1 bước xử lý (parse structured output, đối chiếu ID nguồn) | LLM có thể "quên" trích dẫn hoặc bịa nguồn — đúng điểm yếu Design Review đã chỉ ra ("dùng AI kiểm tra AI") |
| Độ phức tạp | Thấp–Trung bình (structured output + so khớp ID, không cần ML) | Rất thấp |
| Chi phí | Không đáng kể | Không đáng kể |
| Rủi ro | Thấp | **Cao — trực tiếp vi phạm NFR "Grounding" không thương lượng của chính BRD** |
| Khả năng demo | Cao — có thể demo trực tiếp trường hợp claim bị reject vì thiếu nguồn (giống kịch bản "Thiếu thông tin" đã dùng cho Eligibility Checker) | Rủi ro cao nếu LLM bịa nguồn ngay lúc demo trước giám khảo |
| Khả năng mở rộng | Tốt | Kém — nợ kỹ thuật an toàn tích luỹ |

**Chuyển sang `03_FINAL_ARCHITECTURE.md`** để chọn phương án cuối cùng cho từng thành phần kèm lý do và trade-off tường minh (Bước 4).
