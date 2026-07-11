# Hướng dẫn nối web với Google Sheet (5 phút)

Việc này cần làm trong tài khoản Google của bạn nên bạn tự thao tác — chỉ copy-dán, không cần biết code.

## Bước 1 — Tạo bảng tính
1. Vào [sheets.google.com](https://sheets.google.com), bấm **+ Trống** để tạo bảng tính mới.
2. Đặt tên bảng tính, ví dụ: `Hương Võ - CTV & Đơn Hàng`.

## Bước 2 — Dán code
1. Trên thanh menu, chọn **Tiện ích mở rộng** (Extensions) → **Apps Script**.
2. Một tab mới mở ra, đang có sẵn vài dòng code mẫu (`function myFunction() {...}`) — **xóa hết**.
3. Mở file `Code.gs` trong thư mục `google-sheet` của dự án này, copy toàn bộ nội dung, dán vào.
4. Bấm biểu tượng **💾 Lưu** (hoặc Ctrl+S).

## Bước 3 — Triển khai (Deploy)
1. Bấm nút **Triển khai** (Deploy) ở góc trên phải → **Triển khai mới** (New deployment).
2. Bấm bánh răng ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web** (Web app).
3. Ở mục **Ai có quyền truy cập** (Who has access) → chọn **Bất kỳ ai** (Anyone).
4. Bấm **Triển khai** (Deploy).
5. Google sẽ yêu cầu cấp quyền lần đầu:
   - Chọn tài khoản Google của bạn.
   - Nếu thấy cảnh báo "Ứng dụng chưa xác minh" (Google haven't verified this app) — đây là bình thường vì đây là script do chính bạn tạo. Bấm **Nâng cao** (Advanced) → **Đi tới ... (không an toàn)** (Go to ... unsafe) → **Allow/Cho phép**.
6. Sau khi triển khai xong, Google hiện ra một đường link dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`
   → **Copy link này.**

## Bước 4 — Gửi link cho tôi
Dán đường link đó vào chat, tôi sẽ gắn vào web ngay (chỉ mất 1 dòng code, không cần bạn làm gì thêm).

## Sau khi kết nối, sheet sẽ tự ghi lại gì?
- Mỗi khi có người **đăng ký làm Cộng Tác Viên** → 1 dòng mới: tên, SĐT, mã CTV.
- Mỗi khi có khách **đi đến trang thanh toán** qua link giới thiệu của CTV nào đó → 1 dòng mới: mã CTV, sản phẩm, số tiền.

**Lưu ý quan trọng:** vì web không có cổng thanh toán tự động xác nhận, sheet này chỉ ghi lại "ai đã đi tới bước thanh toán qua link của CTV nào" — **không** tự xác nhận khách đã thực sự chuyển khoản hay chưa. Bạn vẫn cần đối chiếu với tin nhắn Zalo/biên lai chuyển khoản trước khi trả hoa hồng.
