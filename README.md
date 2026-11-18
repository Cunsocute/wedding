# Thiệp cưới Nguyễn Hoàng Minh & Hoàng Thùy Dương — Enduring Grace

Website được dựng lại theo bố cục cuộn dọc của mẫu **Enduring Grace** trên M-Invite, đồng thời sử dụng ảnh và thông tin cưới từ file Word bạn đã gửi trước đó.

## Chạy website

1. Giải nén `Enduring-Grace-Wedding.zip`.
2. Mở `index.html` bằng Chrome/Edge, hoặc mở thư mục bằng VS Code và chạy Live Server.
3. Giữ nguyên thư mục `assets/`, `index.html`, `styles.css` và `script.js` cùng cấp.

## Các phần trong thiệp

- Ảnh bìa, tên cô dâu chú rể và ngày cưới.
- Thông tin hai gia đình.
- Lễ vu quy, lễ thành hôn, tiệc nhà trai và tiệc nhà gái, kèm liên kết mở Google Maps.
- Save the Date và đồng hồ đếm ngược.
- Album ảnh có chế độ xem toàn màn hình.
- Biểu mẫu RSVP: xác nhận tham dự, số lượng khách, khách nhà trai/nhà gái và lời nhắn.
- Timeline, lịch tháng 11/2026, phần mừng cưới QR, dress code và trang cảm ơn.
- Hiệu ứng 3D Tilt khi rê chuột, chuyển động xuất hiện khi cuộn, ảnh phóng to có hiệu ứng lật 3D, trình chiếu, phóng to/thu nhỏ, điều khiển bằng phím và vuốt trên điện thoại.
- Cánh hoa rơi có thể bật/tắt; nhạc nền có nút bật/tắt và cho phép chọn MP3 từ máy.
- Nút chia sẻ liên kết và sổ lời chúc.

## Tùy chỉnh nội dung

Mở `script.js` và sửa phần `CONFIG`:

```js
const CONFIG = {
  groom: "Nguyễn Hoàng Minh",
  bride: "Hoàng Thùy Dương",
  weddingDate: "2026-11-29T14:00:00+07:00",
  musicSrc: "assets/wedding-music.mp3",
  supabaseUrl: "",
  supabaseAnonKey: ""
};
```

- Thêm file nhạc MP3 vào `assets/`, sau đó điền đường dẫn vào `musicSrc`. Nếu để trống, nút nhạc sẽ phát giai điệu instrumental tạo bằng Web Audio API. Trình duyệt thường yêu cầu khách chạm nút nhạc trước khi phát.
- Sửa địa chỉ hoặc link Google Maps trực tiếp trong `index.html` nếu địa điểm thay đổi.
- Thay `assets/gift-qr-placeholder.svg` bằng ảnh QR ngân hàng thực tế của cô dâu/chú rể. Tệp hiện tại chỉ là hình minh họa, **không phải mã QR chuyển khoản có thể quét**.
- Ảnh trong `assets/word-source-01.webp` đến `word-source-08.webp` là bản sao tối ưu của 8 ảnh trong file Word; có thể thay các ảnh `hero-couple.webp`, `gallery-*.webp` bằng ảnh chất lượng cao hơn mà vẫn giữ nguyên tên file.

## Sổ lời chúc và RSVP trực tuyến

Mặc định, nếu chưa cấu hình Supabase, lời chúc và RSVP được lưu trong `localStorage` của trình duyệt hiện tại. Dữ liệu đó **không tự đồng bộ giữa các thiết bị/khách mời**.

Để mọi người gửi lời chúc và cùng xem lời chúc trên các thiết bị:

1. Tạo project Supabase.
2. Mở SQL Editor, chạy nội dung trong `supabase-schema.sql`.
3. Sao chép Project URL và anon/public key của project vào `supabaseUrl` và `supabaseAnonKey` trong `script.js`.
4. Không đưa `service_role` key vào mã frontend.
5. Sau khi cấu hình, kiểm tra lại thao tác gửi lời chúc và RSVP trên trình duyệt ẩn danh.

RSVP chỉ có quyền INSERT từ phía khách mời; không có policy SELECT để khách không thể đọc danh sách RSVP của nhau. Chủ thiệp có thể quản lý RSVP trong Supabase Dashboard.

## Chuẩn bị Google Sheets (chưa kết nối)

Tệp `google-apps-script-template.js` là mẫu backend để ghi RSVP và lời chúc vào hai tab `RSVP` và `Lời chúc` trong Google Sheet. Hiện tại website **chưa gửi dữ liệu lên Google Sheets**; khi chưa cấu hình dịch vụ trực tuyến, dữ liệu vẫn chỉ lưu trong `localStorage` của trình duyệt.

Khi sẵn sàng kết nối:

1. Tạo Google Sheet, mở **Extensions → Apps Script**, rồi dán nội dung tệp mẫu vào trình soạn thảo Apps Script.
2. Deploy thành Web app, chọn **Execute as: Me** và thiết lập quyền truy cập phù hợp. Web app cho phép khách gửi dữ liệu sẽ nhận được yêu cầu công khai; không lưu thông tin nhạy cảm trong biểu mẫu.
3. Sau khi deploy, cấu hình URL Web app trong website và kiểm tra gửi RSVP/lời chúc. Chưa cần deploy hoặc cấu hình URL để chạy website hiện tại.

## Lưu ý về dữ liệu

Thông tin lịch cưới đang sử dụng theo file Word và nội dung project trước đó: tiệc nhà gái 18:00 ngày 28/11/2026 tại Nhà hàng Sen Vàng, Phú Cát – Quốc Oai – Hà Nội; lễ vu quy 09:00 ngày 29/11/2026 tại tư gia nhà gái; tiệc nhà trai 09:30 ngày 29/11/2026 tại Tân Mỹ – Tiên Phong – Bắc Ninh; lễ thành hôn 14:00 ngày 29/11/2026 tại tư gia nhà trai. Hãy kiểm tra lại giờ/địa chỉ trước khi gửi thiệp chính thức.

Tên cha mẹ nhà trai trong ảnh Word bị che một phần, nên website chỉ ghi thông tin địa phương nhà trai thay vì tự đoán tên.
