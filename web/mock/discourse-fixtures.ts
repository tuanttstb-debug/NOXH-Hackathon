import type { RawPost } from "@/types/discourse";

/**
 * ⚠️ DỮ LIỆU GIẢ LẬP — KHÔNG PHẢI BÀI ĐĂNG THẬT. KHÔNG DÙNG ĐỂ DEMO TRƯỚC GIÁM KHẢO.
 *
 * Mục đích duy nhất: kiểm thử pipeline chạy đúng khi chưa có dữ liệu thật.
 * Mọi `postId` bắt đầu bằng `synthetic-`, `url` trỏ về `example.invalid` (tên miền được
 * RFC 6761 dành riêng, không bao giờ tồn tại thật) và `synthetic: true` — để không có
 * đường nào lẫn dữ liệu này vào output thật mà không bị phát hiện.
 *
 * Dữ liệu thật cần 30–50 bài tuyển tay (`docs/features/PUBLIC_DISCOURSE_FILTER.md` mục 10).
 * Nội dung dưới đây do AI viết để mô phỏng các DẠNG phát ngôn sai lệch phổ biến —
 * không trích từ người thật, không quy cho ai.
 */
export const syntheticPosts: RawPost[] = [
  {
    postId: "synthetic-001",
    channel: "facebook",
    url: "https://example.invalid/synthetic/001",
    publishedAt: "2026-07-18T08:00:00+07:00",
    synthetic: true,
    text: "Mọi người ơi cho em hỏi, em nghe nói là cứ thu nhập dưới 15 triệu là chắc chắn được mua nhà ở xã hội, không cần điều kiện gì thêm đúng không ạ? Em đang định nộp hồ sơ mà chưa rõ lắm, ai biết chỉ em với.",
  },
  {
    postId: "synthetic-002",
    channel: "threads",
    url: "https://example.invalid/synthetic/002",
    publishedAt: "2026-07-18T09:30:00+07:00",
    synthetic: true,
    text: "Ai cũng mua được nhà ở xã hội hết nhé mọi người, thu nhập bao nhiêu cũng được, không cần chứng minh gì cả. Mình vừa đi hỏi về là biết luôn. Cứ mạnh dạn nộp hồ sơ đi đừng sợ.",
  },
  {
    postId: "synthetic-003",
    channel: "facebook",
    url: "https://example.invalid/synthetic/003",
    publishedAt: "2026-07-18T10:15:00+07:00",
    synthetic: true,
    text: "Không đúng đâu bạn ơi, nhà ở xã hội vẫn có điều kiện về thu nhập và điều kiện về nhà ở rõ ràng. Mình đọc nghị định 136 năm 2026 thì người độc thân trần thu nhập là 25 triệu một tháng chứ không phải ai cũng mua được.",
  },
  {
    postId: "synthetic-004",
    channel: "tiktok",
    url: "https://example.invalid/synthetic/004",
    publishedAt: "2026-07-18T11:00:00+07:00",
    synthetic: true,
    text: "Cứ thu nhập dưới 15 triệu là chắc chắn được mua nhà ở xã hội các bạn nhé, mình khẳng định luôn, không cần lo gì hết, cứ đi nộp hồ sơ là được duyệt thôi.",
  },
  {
    postId: "synthetic-005",
    channel: "dien_dan",
    url: "https://example.invalid/synthetic/005",
    publishedAt: "2026-07-18T12:20:00+07:00",
    synthetic: true,
    text: "Em thấy nhiều người bảo cứ thu nhập dưới 15 triệu là chắc chắn được mua nhà ở xã hội nhưng em nộp hồ sơ rồi mà bị trả lại vì em đang đứng tên một mảnh đất ở quê. Mọi người cẩn thận nhé không phải chỉ mỗi điều kiện thu nhập đâu.",
  },
  {
    postId: "synthetic-006",
    channel: "bao_chi",
    url: "https://example.invalid/synthetic/006",
    publishedAt: "2026-07-18T13:00:00+07:00",
    synthetic: true,
    text: "Thị trường bất động sản quý này ghi nhận nhiều biến động về giá thuê văn phòng tại khu vực trung tâm, các chuyên gia nhận định nguồn cung sẽ tiếp tục tăng trong thời gian tới.",
  },
];
