# Trang mời hẹn hò 💌

Web app Flask lấy cảm hứng từ video tỏ tình của CodeGymVietnam: hỏi một câu hỏi,
nút "Không" né chuột, hiệu ứng trái tim/confetti, đếm ngược, sau đó chọn khung giờ
và hoạt động mong muốn.

## Cài đặt

```bash
pip install -r requirements.txt
cp config.example.py config.py   # rồi sửa nội dung riêng của bạn
python app.py
```

Mở trình duyệt tại `http://127.0.0.1:5000`

## Tuỳ chỉnh

Sửa các giá trị trong `CONFIG` ở file `config.py` (file này không được đưa lên
Git — xem `config.example.py` để biết cấu trúc mẫu):

- `your_name`, `girl_name`, `question`: nội dung lời mời
- `activities`: danh sách hoạt động để lựa chọn ở bước 3

## Nhạc nền

Đặt file mp3 của bạn vào `static/audio/love-song.mp3` (xem
`static/audio/README.txt`). Trình duyệt chặn tự động phát nhạc có âm thanh nên
người dùng cần bấm nút 🔇 ở góc phải để bật nhạc.

## Luồng trang

1. `/` — Câu hỏi mời hẹn hò, nút "Không" né chuột
2. `/step2` — Chọn ngày giờ (date/time picker)
3. `/step3` — Chọn hoạt động
4. `/result` — Xác nhận + hiệu ứng ăn mừng

## Deploy lên Render

`config.py` không được đưa lên Git (chứa nội dung cá nhân), nên khi deploy cần
tạo biến môi trường tương ứng — cách đơn giản nhất là commit tạm nội dung
`config.py` thật vào một nhánh/repo riêng tư, hoặc set nội dung qua biến môi
trường nếu bạn sửa `app.py` để đọc từ đó.

1. Đẩy repo (đã ẩn `config.py`) lên GitHub.
2. Vào [render.com](https://render.com) → New → Blueprint → chọn repo này.
   Render sẽ tự đọc `render.yaml` và cấu hình sẵn `gunicorn app:app`.
3. Trên Render, vào tab Environment và thêm nội dung `config.py` bằng cách:
   thêm file `config.py` trực tiếp trong repo deploy riêng (private), hoặc
   dùng Secret Files của Render để upload file `config.py` lên server.
4. Sau khi deploy xong, Render cung cấp một URL public dạng
   `https://ten-app.onrender.com` — gửi link này để mọi người xem được.
