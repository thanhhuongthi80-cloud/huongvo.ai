# Hướng dẫn nối mã kích hoạt cho "Xưởng Kịch Bản Video Review Faceless" (5 phút)

App này dùng **chung 1 Google Sheet** với hệ thống CTV/affiliate đã có sẵn (link sheet chị gửi), không cần tạo bảng tính mới. Việc này cần làm trong tài khoản Google của chị nên chị tự thao tác — chỉ copy-dán, không cần biết code.

## Bước 1 — Cập nhật code Apps Script
1. Mở [sheet CTV](https://docs.google.com/spreadsheets/d/12B5y2x2itTjuUj27LiOMWg0N_uv7gL38oXBgc2ZmhtE/edit) → **Tiện ích mở rộng** (Extensions) → **Apps Script**.
2. Xóa hết code cũ trong đó.
3. Mở file `Code.gs` trong thư mục `google-sheet` của dự án (đã được cập nhật thêm phần mã kích hoạt), copy toàn bộ, dán vào.
4. Bấm **💾 Lưu** (Ctrl+S).

## Bước 2 — Triển khai lại (Redeploy)
Vì đây là bản cập nhật của deployment đã có (không phải deployment mới), chị làm theo đúng cách vẫn hay làm:
1. Bấm **Triển khai** (Deploy) → **Quản lý triển khai** (Manage deployments).
2. Bấm biểu tượng ✏️ (pencil) cạnh bản deploy hiện tại.
3. Ở mục **Phiên bản** (Version) → chọn **Phiên bản mới** (New version).
4. Bấm **Triển khai** (Deploy).

→ Link `/exec` giữ nguyên, không đổi — vì vậy phần code trong app cũng không cần sửa gì thêm (mình đã gắn sẵn đúng link này rồi).

## Bước 3 — Tạo mã kích hoạt để bán (1 mã = 1 lần mua, dùng mãi mãi)
Tab **"MaKichHoat_review_faceless"** chỉ cần cột A (Mã kích hoạt) là bắt buộc — các cột khác (Ghi chú, hay 2 cột thừa "Số lượt đã dùng"/"Giới hạn thiết bị" từ lúc thử nghiệm trước) đều không ảnh hưởng gì, cứ để yên hoặc xóa tùy ý.

1. Mỗi khách mua, thêm 1 dòng mới ở cột A: gõ mã kích hoạt, ví dụ `VRF-AB12CD`.
2. (Tùy chọn) Ghi chú ở cột khác để nhớ mã nào bán cho ai.
3. Gửi mã cho khách kèm link app — khách nhập mã 1 lần, dùng được **mãi mãi, không giới hạn thiết bị, không giới hạn số lần tạo kịch bản**.

## Kiểm tra
- Mở app trên trình duyệt (ở chế độ ẩn danh / Incognito để giả lập khách hàng mới), nhập mã kích hoạt vừa tạo, bấm "Xác nhận mã".
- Nếu báo lỗi, kiểm tra lại: đã Redeploy phiên bản mới ở Bước 2 chưa, mã đã thêm đúng vào tab "MaKichHoat_review_faceless" chưa.
- Muốn xóa mã đã lưu trên trình duyệt để test lại từ đầu: mở DevTools (F12) → Console → gõ `localStorage.removeItem('vrf_activated_code')` → tải lại trang.

## Lưu ý cho các app sau này
Nếu chị làm thêm app khác cũng cần mã kích hoạt, không cần tạo sheet/script mới — chỉ cần nhờ tôi đổi giá trị `APP_ID` trong file `gate.js` của app đó (ví dụ `xuong_video_ai`), mỗi app sẽ tự có tab mã kích hoạt riêng trong cùng 1 bảng tính này, không lẫn mã vào nhau.

## Bước tiếp theo — đưa app lên mạng có link
Bước này làm trên Vercel (chị đã có tài khoản từ các trang khác):
1. Vào [vercel.com](https://vercel.com) → đăng nhập.
2. **Add New** → **Project** → chọn Import repo GitHub của chị (`huongvo.ai`).
3. Ở phần **Root Directory**, bấm **Edit** → chọn thư mục `video-review-faceless`.
4. Bấm **Deploy**. Vercel sẽ cấp cho chị 1 link dạng `ten-du-an.vercel.app`.

Lưu ý: code phải được đẩy (push) lên GitHub trước thì Vercel mới thấy để import — bước này nhờ tôi làm giúp khi chị sẵn sàng, tôi sẽ xin phép trước khi đẩy code lên.
