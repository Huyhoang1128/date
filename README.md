# Thiệp mời sinh nhật 🎂

## Chạy thử ở máy local

Mở thẳng file `index.html` bằng trình duyệt, hoặc chạy 1 server tĩnh đơn giản:

```bash
python -m http.server 8000
```

rồi mở `http://127.0.0.1:8000`.

## Tuỳ chỉnh nội dung

Sửa các giá trị trong [static/js/config.js](static/js/config.js):

- `hostName`: tên chủ tiệc (người có sinh nhật)
- `partyTime`: thời gian bữa tiệc
- `question`: câu mời ở trang đầu
- `restaurants`: vài nhà hàng gợi ý sẵn (không bắt buộc), quán khách gợi ý
  sẽ tự được thêm vào cho người sau chọn
- `activities`: danh sách hoạt động sau tiệc để khách bình chọn
- `scriptUrl`: URL Web app của Google Apps Script để ghi lại câu trả lời (xem
  bên dưới), để trống nếu không cần ghi lại

⚠️ Vì đây là trang tĩnh, mọi nội dung trong `config.js` đều công khai (ai xem
mã nguồn trang cũng thấy được), không có gì được giấu ở backend.

## Nhạc nền

Đặt file mp3 của bạn vào `static/audio/bg-music.mp3` (xem
`static/audio/README.txt`). Trang tự thử phát nhạc ngay khi mở; nếu trình
duyệt chặn autoplay có âm thanh, nhạc sẽ tự bật ngay khi người dùng chạm/bấm
vào bất kỳ đâu trên trang lần đầu tiên. Nút 🔊/🔇 ở góc phải để bật/tắt thủ
công bất cứ lúc nào.

## Ghi lại câu trả lời bằng Google Sheets

1. Tạo một Google Sheet mới.
2. Vào **Extensions → Apps Script**, xoá code mẫu, dán nội dung file
   [google-apps-script/Code.gs](google-apps-script/Code.gs) vào.
3. Bấm **Deploy → New deployment** → chọn loại **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Bấm **Deploy**, copy URL Web app được cấp.
5. Dán URL đó vào `scriptUrl` trong `static/js/config.js`.

Mỗi khi có bạn bè xác nhận tham dự, một dòng mới (thời gian gửi, tên, số
người, nhà hàng, hoạt động muốn chơi, lời nhắn) sẽ tự động được thêm vào
Google Sheet. Dòng tiêu đề được tạo tự động khi Sheet còn trống.

Sheet này cũng là nơi lưu các nhà hàng mọi người gợi ý: khi mở trang, danh
sách quán (kèm số phiếu) được tải từ Sheet, nên quán người trước gợi ý sẽ hiện
ra cho người sau chọn. Chưa cấu hình `scriptUrl` thì trang chỉ hiện các quán
trong `restaurants` của config. Ai có link cũng gợi ý quán được, nếu có quán
linh tinh thì cứ xoá dòng đó trong Sheet.

Khi sửa `Code.gs` sau này, vào **Deploy → Manage deployments** → biểu tượng
bút chì → Version: **New version** → **Deploy** để giữ nguyên URL cũ (tạo
"New deployment" sẽ ra URL mới, phải dán lại vào config).

## Deploy bằng GitHub Pages

1. Đẩy repo lên GitHub — **repo phải để Public** thì GitHub Pages miễn phí mới
   chạy được (Settings → General → Danger Zone → Change visibility).
2. Vào **Settings → Pages** → Source: chọn **Deploy from a branch** → Branch:
   `main`, folder `/ (root)` → **Save**.
3. Sau vài phút, GitHub cấp một URL dạng
   `https://<username>.github.io/<repo>/` — gửi link này cho bạn bè.

## Luồng trang (single-page, chuyển view bằng JS)

1. Thiệp mời kèm thời gian; nút "Bận rồi" né chuột
2. Nhập tên và số người đi
3. Chọn nhà hàng mọi người đã gợi ý, hoặc gợi ý quán mới
4. Bình chọn hoạt động sau tiệc
5. Lời chúc / lưu ý (không bắt buộc)
6. Xác nhận + hiệu ứng ăn mừng, gửi dữ liệu về Google Sheets (nếu đã cấu hình)
