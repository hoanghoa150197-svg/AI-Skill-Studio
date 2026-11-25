# V1.6.1 — Startup & Sync Stability Fix

## Nâng cấp từ V1.6

1. Nếu vẫn truy cập được V1.6, xuất JSON để sao lưu. Nếu đang kẹt màn hình đăng nhập, không xóa IndexedDB, không xóa dữ liệu trình duyệt và không dùng bản Cloud để ghi đè Local.
2. Thay toàn bộ mã nguồn GitHub Pages bằng nội dung ZIP V1.6.1. Giữ nguyên repository, URL, Supabase project và tài khoản. Không cần chạy SQL mới nếu đã chạy `upgrade-v1.6.sql` ở V1.6; nếu chưa chạy, vẫn cần SQL đó để đồng bộ Storage.
3. Đóng các tab Studio khác; chờ GitHub Pages deploy xong rồi mở lại bằng Ctrl+F5. Kiểm tra logo CORE · V1.6.1. Nếu vẫn tải phiên bản cũ, F12 → Application → Service Workers → Unregister, sau đó làm mới. KHÔNG chọn Clear site data.
4. Đăng nhập nếu cần. Studio mở sau khi SDK, phiên xác thực, quyền truy cập tài khoản và thư viện IndexedDB đã sẵn sàng. Không cần đợi Cloud tải xong. Kiểm tra thanh trạng thái hoặc mục Tài khoản & Sao lưu.
5. Nếu gặp lỗi mạng, kiểm tra Internet rồi nhấn Thử lại (ở màn hình xác thực) hoặc Đồng bộ ngay (trong Studio). Có kiểm tra Cloud định kỳ 30 giây khi trang đang hiển thị và khi mạng trở lại. Nếu có xung đột, sao lưu cả hai bản trước khi chọn bản đúng.

## Thay đổi kỹ thuật

- SDK được nạp động với giới hạn chờ 15 giây; các bước getSession, getUser, khóa tài khoản và đọc IndexedDB cũng có giới hạn 15 giây mỗi bước. Đây không phải một giới hạn chung cho toàn bộ quá trình khởi động. Xác thực thất bại vẫn khóa dữ liệu tài khoản.
- Đăng nhập bằng biểu mẫu có giới hạn chờ 30 giây; các request qua fetch của SDK bị hủy sau 25 giây nếu chưa hoàn thành. Một lần đồng bộ có nhiều request nên tổng thời gian có thể lâu hơn.
- Giao diện mở ngay khi tài khoản đã được xác minh và dữ liệu local đã đọc xong; đồng bộ Storage khởi động sau đó, không khóa giao diện chính. Trên thiết bị chưa có local, thư viện có thể trống trong lúc tải Cloud. Tránh tạo/nhập dữ liệu cho đến khi hoàn tất lần tải đầu nếu muốn dùng bản Cloud sẵn có.
- Không tự thay thế Local khi đang chỉnh sửa, có thao tác chưa kết thúc, hoặc dữ liệu Local đã thay đổi trong khi tải Cloud. Xung đột revision vẫn phải xử lý rõ ràng, không tự hợp nhất.
- Cache PWA mới, không chặn cài đặt Service Worker vì CDN SDK; request phục vụ tài nguyên qua SW có timeout 12 giây cho phản hồi mạng và fallback cache khi lỗi mạng. Các script đồng bộ/khởi động có version query.
- Giữ nguyên IndexedDB, cấu trúc Storage, SQL, định dạng backup, chức năng quản lý Skill và CSS Impeccable.

## Kiểm thử

`node tests/startup.test.cjs` và `node tests/storage-sync.test.cjs`. Kiểm thử JavaScript mô phỏng xác thực, IndexedDB, mạng/Storage và xung đột; đã qua kiểm tra cú pháp. Chromium không truy cập được máy chủ thử nghiệm do ERR_BLOCKED_BY_ADMINISTRATOR. Chưa kiểm thử trên Supabase thật hoặc giao diện GitHub Pages đã triển khai.
