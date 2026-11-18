# Bảng Xếp Hạng Light Novel Việt Nam

Trang kết quả và bình chọn của [bxh.lightnovel.vn](https://bxh.lightnovel.vn) — bản dựng lại từ đầu (v2).

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · three.js / React Three Fiber · Motion · Lenis.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # toàn bộ trang được xuất tĩnh
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ: hero 3D, lời ngỏ, Top 10, hạng mục, hành trình, tiếng nói, đối tác |
| `/leaderboard`, `/leaderboard/1-2024` | Bảng tổng sắp từng kỳ, `?cat=` chọn hạng mục |
| `/feedback` | Tường góp ý của độc giả |
| `/vote` | Lá phiếu (tự khoá ngoài thời gian bình chọn; thêm `?preview` để xem thử) |

- `src/lib/config.ts` — kỳ hiện tại, thời gian mở/đóng bình chọn, định nghĩa hạng mục.
- `src/lib/content.ts` — nội dung chữ: lời ngỏ, dòng thời gian, trích dẫn, đối tác.
- `src/data/*.json` — dữ liệu đã chuẩn hoá, **được sinh ra**, không sửa tay.
- `data/raw/` — dữ liệu gốc từ back-end (đã bỏ IP ở phần góp ý).
- `public/covers/` — ảnh bìa đã tải về và nén (400×568 webp).

## Cập nhật dữ liệu / mở kỳ mới

1. Đặt file kết quả mới vào `data/raw/`, khai báo kỳ trong `scripts/build-data.mjs`.
2. `npm run data` — tải bìa còn thiếu, tính màu nhấn, ghi lại `src/data`.
3. Sửa `CURRENT_PERIOD` và `VOTING` trong `src/lib/config.ts`.
4. Khi mở bình chọn: sao chép `.env.example` thành `.env.local` và điền endpoint + hCaptcha site key.

Phiếu được gửi dạng `POST` JSON:

```json
{
  "favoriteRanobe": [1, 2], "favoriteOneshot": [3], "favoritePublisher": [4], "favoriteRookie": [5],
  "feedback": { "topic": "", "content": "", "title": "", "publisher": "" },
  "userInfo": { "gender": "male", "age": 20 },
  "token": "<hcaptcha>"
}
```

Máy chủ trả `{ "message": "created" }` khi thành công; `rateLimit` / `invalidCaptcha` khi từ chối.

## Thực hiện

Hyddyt (tổ chức) · Zennomi (back-end) · Meoki (front-end)
