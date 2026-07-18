# Lấy YouTube Data API key (miễn phí, ~5 phút)

1. Vào https://console.cloud.google.com/ → tạo project mới (đặt tên gì cũng được, vd `noxh-hackathon`).
2. Menu trái → **APIs & Services** → **Library** → tìm **YouTube Data API v3** → bấm **Enable**.
3. **APIs & Services** → **Credentials** → **Create Credentials** → **API key**.
4. Copy key vừa hiện ra.
5. Mở `web/.env.local` (file này đã nằm trong `.gitignore`, không bị commit) và thêm dòng:

```
YOUTUBE_API_KEY=<dán key vào đây>
```

> **Đừng dán key vào chat.** Key `MKP_API_KEY` ở phiên trước đã bị dán vào chat nên coi như đã lộ
> và cần rotate — không lặp lại với key này.

**Nên làm thêm (1 phút):** ở trang Credentials, bấm vào key → **Restrict key** → chọn
**YouTube Data API v3**. Key bị lộ mà đã giới hạn thì kẻ khác cũng không dùng được cho việc khác.

## Chạy crawler

```bash
cd web
node scripts/crawl-youtube.mjs                          # lần đầu: có search
node scripts/crawl-youtube.mjs --no-search              # lần sau: dùng cache, không tốn bucket search
node scripts/crawl-youtube.mjs --max-videos 20 --max-comments 100
```

Kết quả ghi ra `web/data/discourse/youtube-posts.json`.

## Quota — không phải ràng buộc ở quy mô này

Sau thay đổi 01/06/2026, YouTube tách quota thành các bucket riêng:

| Thao tác | Chi phí | Trần/ngày |
|---|---|---|
| `search.list` | bucket riêng | ~100 lần/ngày ← **thứ khan hiếm duy nhất** |
| `commentThreads.list` | 1 unit | 10.000 unit/ngày ⇒ tới ~1.000.000 bình luận/ngày |

Nhu cầu của dự án (vài nghìn bình luận) dùng **dưới 1% quota/ngày**. Script đã cache `videoId`
xuống `youtube-video-cache.json` nên các lần chạy sau không tốn thêm lần search nào.

Quota reset lúc **00:00 giờ Thái Bình Dương** (khoảng 14:00–15:00 giờ VN, tuỳ mùa DST).

**Không** tạo nhiều Google Cloud project để nhân quota — đó là lách giới hạn, có thể bị thu hồi
quyền truy cập, và không phải thứ nên phải giải thích trước giám khảo.
