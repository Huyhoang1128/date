# Trang mời hẹn hò 💌


## Chạy thử ở máy local

Mở thẳng file `index.html` bằng trình duyệt, hoặc chạy 1 server tĩnh đơn giản:

```bash
python -m http.server 8000
```

rồi mở `http://127.0.0.1:8000`.

## Tuỳ chỉnh nội dung

Sửa các giá trị trong [static/js/config.js](static/js/config.js):

- `yourName`, `girlName`, `question`: nội dung lời mời
- `activities`: danh sách hoạt động để lựa chọn ở bước cuối
- `scriptUrl`: URL Web app của Google Apps Script để ghi lại câu trả lời (xem
  bên dưới), để trống nếu không cần ghi lại

⚠️ Vì đây là trang tĩnh, mọi nội dung trong `config.js` đều công khai (ai xem
mã nguồn trang cũng thấy được), không có gì được giấu ở backend.

## Nhạc nền

Đặt file mp3 của bạn vào `static/audio/love-song.mp3` (xem
`static/audio/README.txt`). Trình duyệt chặn tự động phát nhạc có âm thanh nên
người dùng cần bấm nút 🔇 ở góc phải để bật nhạc.

## Ghi lại câu trả lời bằng Google Sheets

1. Tạo một Google Sheet mới.
2. Vào **Extensions → Apps Script**, xoá code mẫu, dán nội dung file
   [google-apps-script/Code.gs](google-apps-script/Code.gs) vào.
3. Bấm **Deploy → New deployment** → chọn loại **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Bấm **Deploy**, copy URL Web app được cấp.
5. Dán URL đó vào `scriptUrl` trong `static/js/config.js`.

Mỗi khi có người hoàn thành form, một dòng mới (thời gian, ngày giờ hẹn, hoạt
động) sẽ tự động được thêm vào Google Sheet.

## Deploy bằng GitHub Pages

1. Đẩy repo lên GitHub — **repo phải để Public** thì GitHub Pages miễn phí mới
   chạy được (Settings → General → Danger Zone → Change visibility).
2. Vào **Settings → Pages** → Source: chọn **Deploy from a branch** → Branch:
   `main`, folder `/ (root)` → **Save**.
3. Sau vài phút, GitHub cấp một URL dạng
   `https://<username>.github.io/<repo>/` — gửi link này để mọi người xem
   được.

## Luồng trang (single-page, chuyển view bằng JS)

1. Câu hỏi mời hẹn hò, nút "Không" né chuột
2. Chọn ngày giờ (nhập tự do)
3. Chọn hoạt động
4. Xác nhận + hiệu ứng ăn mừng, gửi dữ liệu về Google Sheets (nếu đã cấu hình)
