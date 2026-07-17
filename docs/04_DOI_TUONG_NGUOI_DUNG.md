# 04 — Đối tượng người dùng

> Đọc trong 5 phút. Mục tiêu: căn cứ cho `03_YEU_CAU_NGHIEP_VU.md` và `11_KICH_BAN_DEMO.md`.

## DECISION
Đối tượng demo 48h: **người dân** có nhu cầu mua/thuê mua NOXH. Doanh nghiệp/chủ đầu tư và cơ quan quản lý là hướng mở rộng sau Hackathon (xem `10_LO_TRINH_TRIEN_KHAI.md`), không nằm trong scope demo.

## Chân dung (ASSUMPTION — chưa có khảo sát thật, cần đội đối chiếu trải nghiệm thực tế nếu có)
**"Anh Minh, 29 tuổi, công nhân khu công nghiệp"**
- Thu nhập ~12–15 triệu/tháng, chưa kết hôn, chưa có nhà.
- Nghe nói "sắp có đợt mở bán NOXH gần khu công nghiệp" nhưng không biết mình có đủ điều kiện không.
- Từng tra Google, đọc nhiều bài báo mâu thuẫn nhau về mức thu nhập tối đa được mua NOXH.
- Không có thời gian/kiến thức đọc văn bản luật gốc. Sợ nộp hồ sơ sai, mất công, mất cơ hội.

## Hành trình hiện tại (không có NOXH Copilot)
| Bước | Hành động | Nỗi đau |
|---|---|---|
| 1 | Tìm kiếm Google "điều kiện mua nhà ở xã hội" | Kết quả từ nhiều thời điểm khác nhau, không rõ cái nào còn hiệu lực |
| 2 | Đọc 2–3 bài báo | Số liệu (trần thu nhập, lãi suất) khác nhau giữa các bài |
| 3 | Hỏi người quen / môi giới | Thông tin truyền miệng, không có căn cứ |
| 4 | Nộp hồ sơ liều | Rủi ro bị từ chối vì hiểu sai điều kiện |

## Hành trình kỳ vọng (có NOXH Copilot)
| Bước | Hành động | Giá trị nhận được |
|---|---|---|
| 1 | Nhập thông tin cơ bản (hôn nhân, thu nhập, tình trạng nhà ở, khu vực) | Không cần đọc luật |
| 2 | AI Agent đối chiếu Knowledge Graph | Dùng đúng điều khoản đang hiệu lực tại thời điểm hỏi |
| 3 | Nhận kết quả: Đủ / Không đủ / Thiếu thông tin | Câu trả lời rõ ràng, không mập mờ |
| 4 | Xem giải thích + trích dẫn điều/khoản/văn bản | Tin tưởng được, đối chiếu lại nếu muốn |

## Nhận định sản phẩm
Giá trị người dùng nhận được không phải "có chatbot trả lời nhanh" mà là **"biết chắc mình có nộp hồ sơ được không, và vì sao"**.

## OPEN QUESTION
"Anh Minh" có đúng là persona ưu tiên không, hay đội muốn nhắm nhóm khác (cán bộ, cặp vợ chồng trẻ, hộ nghèo đô thị)? Nếu có insight thật, cần thay ASSUMPTION này bằng FACT.
