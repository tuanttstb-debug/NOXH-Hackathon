# Hướng dẫn thêm dữ liệu cho Public Discourse Filter

> Ba nguồn dữ liệu: **Facebook/TikTok/diễn đàn** (dán tay), **báo chí** (RSS tự động), **YouTube** (crawler tự động).
> File này hướng dẫn nguồn 1 và 2. YouTube xem `HUONG_DAN_YOUTUBE_API.md`.

---

## 1. Thêm bài Facebook / TikTok / Threads / diễn đàn

### Bước 1 — tạo file

Tạo `web/data/discourse/manual-posts.json` (copy từ `manual-posts.example.json`).
File này **đã nằm trong `.gitignore`** — dữ liệu người thật không lên GitHub.

### Bước 2 — dán bài theo đúng format

```json
[
  {
    "postId": "fb-001",
    "channel": "facebook",
    "url": "https://www.facebook.com/groups/123/posts/456",
    "text": "Dán NGUYÊN VĂN nội dung bài đăng vào đây, không tóm tắt, không sửa chính tả.",
    "publishedAt": "2026-07-15T09:30:00+07:00"
  },
  {
    "postId": "tiktok-001",
    "channel": "tiktok",
    "url": "https://www.tiktok.com/@user/video/123456",
    "text": "Nội dung caption hoặc lời thoại.",
    "publishedAt": "2026-07-16T20:00:00+07:00"
  }
]
```

### 5 trường BẮT BUỘC — thiếu 1 trường là bản ghi bị **loại âm thầm**

| Trường | Quy tắc kiểm tra thật (`lib/discourse/sources.ts`) |
|---|---|
| `postId` | chuỗi, khác rỗng. **Trùng `postId` thì bản sau ghi đè bản trước** — đặt số tăng dần cho chắc |
| `channel` | phải là **một trong**: `facebook` · `tiktok` · `threads` · `dien_dan` · `bao_chi` · `youtube`. Sai chính tả = loại |
| `url` | phải bắt đầu bằng `http://` hoặc `https://`. **Bắt buộc mở lại được** để người kiểm chứng tự đối chiếu |
| `text` | chuỗi, khác rỗng sau khi cắt khoảng trắng |
| `publishedAt` | chuỗi. Nên dùng ISO: `2026-07-15T09:30:00+07:00` |

> Bản ghi hỏng **không làm vỡ pipeline** mà bị bỏ lặng lẽ, chỉ đếm vào `stats.invalidDropped`. **Luôn kiểm số này sau khi chạy** — nếu > 0 là có bài của bạn bị mất.

### Bước 3 — kiểm tra ngay

```bash
cd web && npm run dev
# cửa sổ khác:
curl -X POST http://localhost:3000/api/discourse -H "Content-Type: application/json" -d "{}"
```

Nhìn `stats`:
```json
"perSource": { "manual-posts.json": 30 },   ← đúng số bài bạn dán chưa?
"invalidDropped": 0,                         ← phải là 0
"rejectedByGate": 12,                        ← bị 2 bộ lọc bên dưới loại
"claimsFound": 18,
"flaggedP1": 0
```

---

## 2. ⚠️ HAI BỘ LỌC ÂM THẦM — lý do phần lớn bài bị loại

Lần chạy thật gần nhất: **216 bài vào, 153 bị loại (71%)**. Không phải lỗi — nhưng phải biết để chọn bài cho đúng.

### Bộ lọc 1 — Từ khoá (`passesKeywordGate`)

Bài **phải chứa ít nhất một** cụm sau (không phân biệt hoa thường và **không cần dấu**):

```
nhà ở xã hội · noxh · nhà xã hội · thu nhập thấp · mua nhà giá rẻ
nghị định 100 · nghị định 136 · nghị định 54 · nghị định 261
```

→ Bài nói về NOXH nhưng dùng từ khác ("nhà ở giá rẻ cho công nhân", "dự án Bình Quới") **sẽ bị loại**.

### Bộ lọc 2 — Chất lượng (`passesQualityGate`)

- Sau khi bỏ hết URL, phần còn lại phải **≥ 40 ký tự**
- Tỉ lệ **chữ cái** trên tổng ký tự phải **> 50%**

→ Loại bình luận ngắn ("đúng rồi", "👍👍👍"), bài chỉ có link, bài toàn emoji/số.

---

## 3. ⭐ Muốn sinh được cảnh báo P1 thì phải thu thập thế nào

Đây là phần quan trọng nhất. Quy tắc gắn cờ (`lib/discourse/analyze.ts`):

```
P1  ⟸  trendStatus === "surging"  VÀ  (ngôn ngữ tuyệt đối HOẶC lược điều kiện)

surging ⟸ mentionCount6h >= 5  VÀ  spreadBreadth >= 2
          (≥5 bài cùng claim)      (claim đó xuất hiện ở ≥2 KÊNH khác nhau)
```

**Nghĩa là gom bài lẻ tẻ mỗi bài một ý sẽ KHÔNG bao giờ ra P1.** Đã kiểm chứng: 216 bài thật → 0 P1, và rule không hỏng (dữ liệu dựng riêng kích hoạt P1 đúng).

### Cách thu thập để có tín hiệu thật

1. **Tìm MỘT tin sai lệch đang lan**, ví dụ *"ai cũng mua được NOXH, không cần chứng minh thu nhập"*.
2. Gom **≥ 5 bài** cùng nói ý đó, **diễn đạt gần giống nhau** — claim được gộp theo nội dung chuẩn hoá, diễn đạt càng khác thì càng dễ tách thành nhiều claim riêng.
3. Trải trên **≥ 2 kênh**: ví dụ 3 bài `facebook` + 2 bài `tiktok`. Cùng một kênh thì `spreadBreadth` = 1, **không bao giờ đạt `surging`**.
4. Ưu tiên bài có **ngôn ngữ tuyệt đối** ("chắc chắn", "ai cũng", "không cần điều kiện gì") hoặc **lược điều kiện** (nêu quyền lợi mà bỏ điều kiện kèm theo).

> **Đừng bịa bài để ép ra P1.** Nếu quét dữ liệu thật mà không có tin sai lệch lan nhanh, "0 P1" là **kết quả hợp lệ** và trình bày trung thực sẽ thuyết phục hơn.

---

## 4. Thêm nguồn báo chí (RSS)

Sửa mảng `FEEDS` trong `web/scripts/crawl-rss.mjs`:

```js
const FEEDS = [
  { name: "VnExpress — Bất động sản", url: "https://vnexpress.net/rss/bat-dong-san.rss" },
  { name: "Tên nguồn mới",            url: "https://.../rss/....rss" },   // ← thêm dòng này
];
```

Rồi chạy `cd web && node scripts/crawl-rss.mjs` (ghi đè `rss-posts.json`).

**Kiểm feed trước khi thêm:** mở URL trên trình duyệt, phải ra XML. Đã thử và **loại**: `baochinhphu.vn` và `xaydungchinhsach.chinhphu.vn` — không phát hành RSS, mọi đường dẫn đều 404.

**Lưu ý phạm vi:** báo chí là **nguồn đối chiếu**, không phải dư luận. Đã kiểm chứng: 11 tin báo → 11 claim → **0 P1**, và đó là đúng — báo chính thống có dẫn nguồn, không dùng ngôn ngữ tuyệt đối. **Tin sai lệch chỉ đến từ nội dung người dùng viết.**

---

## 5. Về dữ liệu cá nhân

`manual-posts.json` và `youtube-posts.json` **đã nằm trong `.gitignore`** — đây là bài viết của người thật kèm URL định danh được tài khoản của họ.

⚠️ `redactPii()` chỉ chạy lúc **phân tích**, không chạy lúc ghi file — nên **dữ liệu thô trên đĩa chưa được che**. Đừng copy các file này ra ngoài, đừng dán vào chat, đừng đưa vào slide demo mà chưa che tên/URL.
